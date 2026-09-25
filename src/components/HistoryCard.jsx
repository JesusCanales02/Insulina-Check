import './HistoryCard.css';

export default function HistoryCard({ historial, fullView = false }) {
  return (
    <div className="card">
      <div className="history-controls">
        <h2 className="card-title" style={{ margin: 0 }}>📊 Historial Clínico</h2>
        <small style={{ color: 'var(--text-muted)' }}>{historial.length} registros</small>
      </div>

      {historial.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No hay registros almacenados.</p>
      ) : (
        historial.map((item) => {
          let badgeClass = 'normal';
          let badgeText = 'Correcto';

          if (item.glucosa < 70) {
            badgeClass = 'alerta';
            badgeText = 'Hipoglucemia';
          } else if (item.dosis > 15) {
            badgeClass = 'precaucion';
            badgeText = 'Dosis Alta';
          }

          return (
            <div key={item.id} className="history-card-item">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span className={`badge-status ${badgeClass}`}>{badgeText}</span>
                  <strong style={{ fontSize: '1rem' }}>{item.glucosa} mg/dL</strong>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Carbohidratos: <strong>{item.carbos}g</strong> · Hora: {item.fecha}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="dose-number">{item.dosis} U</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Dosis Sugerida</div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}