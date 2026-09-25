import { useState, useEffect } from 'react';

export default function ReminderCard({ onFocusGlucosa }) {
  const [rutinas, setRutinas] = useState([
    {
      id: 1,
      titulo: 'Inyección de Insulina',
      intervaloHoras: 24,
      siguienteHora: new Date(Date.now() + 24 * 3600 * 1000),
      activo: true,
      mensajeAviso: 'Aviso: Es hora de su inyección'
    },
    {
      id: 2,
      titulo: 'Horario de Comida',
      intervaloHoras: 6,
      siguienteHora: new Date(Date.now() + 6 * 3600 * 1000),
      activo: true,
      mensajeAviso: 'Aviso: Es hora de su comida'
    },
    {
      id: 3,
      titulo: 'Medición de Glucosa (Opcional)',
      intervaloHoras: 4,
      siguienteHora: new Date(Date.now() + 4 * 3600 * 1000),
      activo: false,
      mensajeAviso: 'Aviso: Es hora de registrar su glucosa'
    }
  ]);

  const [tiemposRestantes, setTiemposRestantes] = useState({});
  const [alertaActiva, setAlertaActiva] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const ahora = new Date();
      const nuevosTiempos = {};

      setRutinas(prevRutinas =>
        prevRutinas.map(rutina => {
          if (!rutina.activo) return rutina;

          const diffSegundos = Math.floor((new Date(rutina.siguienteHora) - ahora) / 1000);

          if (diffSegundos <= 0) {
            const nuevaSiguiente = new Date(ahora.getTime() + rutina.intervaloHoras * 3600 * 1000);

            setAlertaActiva(rutina.mensajeAviso);

            setTimeout(() => {
              setAlertaActiva(null);
            }, 6000);

            return {
              ...rutina,
              siguienteHora: nuevaSiguiente
            };
          }

          const hrs = Math.floor(diffSegundos / 3600);
          const mins = Math.floor((diffSegundos % 3600) / 60);
          const segs = diffSegundos % 60;

          const textoFormateado = `${hrs > 0 ? hrs + 'h ' : ''}${mins > 0 ? mins + 'm ' : ''}${segs < 10 ? '0' : ''}${segs}s`;

          let estadoColor = 'normal';
          if (diffSegundos <= 300) { 
            estadoColor = 'danger';
          } else if (diffSegundos <= 600) { 
            estadoColor = 'warning';
          }

          nuevosTiempos[rutina.id] = {
            restanteStr: textoFormateado,
            estadoColor,
            segundosRestantes: diffSegundos
          };

          return rutina;
        })
      );

      setTiemposRestantes(nuevosTiempos);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleMedicionGlucosa = (id) => {
    setRutinas(rutinas.map(r => {
      if (r.id === id) {
        const nuevoEstado = !r.activo;
        return {
          ...r,
          activo: nuevoEstado,
          siguienteHora: nuevoEstado ? new Date(Date.now() + r.intervaloHoras * 3600 * 1000) : r.siguienteHora
        };
      }
      return r;
    }));
  };

  return (
    <div className="card" style={{ marginTop: '1.5rem' }}>
      <h2 className="card-title">Rutinas de Salud</h2>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
      </p>

      {alertaActiva && (
        <div className="alert-box alert-warning" style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
          {alertaActiva}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {rutinas.map(rutina => {
          const info = tiemposRestantes[rutina.id] || {};

          let bgClass = '#f8fafc';
          let borderClass = 'var(--border)';
          let textColor = 'var(--primary)';

          if (rutina.activo) {
            if (info.estadoColor === 'danger') {
              bgClass = '#fef2f2';
              borderClass = '#fca5a5';
              textColor = '#dc2626';
            } else if (info.estadoColor === 'warning') {
              bgClass = '#fffbe2';
              borderClass = '#fde047';
              textColor = '#d97706';
            }
          }

          return (
            <div 
              key={rutina.id} 
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                background: bgClass,
                border: `1px solid ${borderClass}`,
                opacity: rutina.activo ? 1 : 0.6,
                transition: 'all 0.3s ease'
              }}
            >
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
                  {rutina.titulo} 
                  <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                    (Cada {rutina.intervaloHoras} horas)
                  </span>
                </div>
                
                {rutina.activo ? (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Próxima ejecución: {new Date(rutina.siguienteHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Desactivado
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {rutina.activo && (
                  <div style={{ 
                    fontFamily: 'monospace', 
                    fontWeight: 'bold', 
                    fontSize: '1.1rem', 
                    color: textColor,
                    background: '#ffffff',
                    padding: '0.35rem 0.7rem',
                    borderRadius: '6px',
                    border: `1px solid ${borderClass}`
                  }}>
                    {info.restanteStr || '--'}
                  </div>
                )}

                {rutina.id === 3 ? (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => toggleMedicionGlucosa(rutina.id)}
                      style={{
                        background: rutina.activo ? '#e2e8f0' : 'var(--primary)',
                        color: rutina.activo ? '#334155' : '#ffffff',
                        border: 'none',
                        padding: '0.45rem 0.8rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {rutina.activo ? 'Desactivar' : 'Activar'}
                    </button>

                    {rutina.activo && (
                      <button
                        onClick={onFocusGlucosa}
                        style={{
                          background: 'var(--primary)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.45rem 0.8rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: 'bold'
                        }}
                      >
                        Registrar Glucosa
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}