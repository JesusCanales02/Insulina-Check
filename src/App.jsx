import { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import IobBadge from './components/IobBadge';
import CalculatorCard from './components/CalculatorCard';
import HistoryCard from './components/HistoryCard';
import ReminderCard from './components/ReminderCard';
import FoodGuideCard from './components/FoodGuideCard';

const registrosIniciales = [
  {
    id: 1,
    glucosa: 140,
    carbos: 45,
    dosis: 4.5,
    fecha: new Date(Date.now() - 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  },
  {
    id: 2,
    glucosa: 210,
    carbos: 60,
    dosis: 7.2,
    fecha: new Date(Date.now() - 5 * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

export default function App() {
  const glucosaInputRef = useRef(null);
  const [vistaActual, setVistaActual] = useState('dashboard');
  const [resultado, setResultado] = useState(null);
  const [carbosSeleccionados, setCarbosSeleccionados] = useState(null);

  const [historial, setHistorial] = useState(() => {
    const guardado = localStorage.getItem('historial_clinico');
    return guardado ? JSON.parse(guardado) : registrosIniciales;
  });

  useEffect(() => {
    localStorage.setItem('historial_clinico', JSON.stringify(historial));
  }, [historial]);

  const calcularInsulinaActiva = () => {
    if (!historial || historial.length === 0) return '0.0';

    const ultimoRegistro = historial[0];
    if (!ultimoRegistro || !ultimoRegistro.dosis) return '0.0';

    const horaTexto = ultimoRegistro.fecha || ultimoRegistro.hora;
    if (!horaTexto) return '0.0';

    const [horas, minutos] = horaTexto.split(':');
    const horaRegistro = new Date();
    horaRegistro.setHours(parseInt(horas, 10), parseInt(minutos, 10), 0);

    const ahora = new Date();
    let diffMinutos = (ahora - horaRegistro) / (1000 * 60);

    if (diffMinutos < 0) diffMinutos += 24 * 60;

    const DURACION_INSULINA_MINUTOS = 6 * 60;

    if (diffMinutos >= DURACION_INSULINA_MINUTOS) {
      return '0.0';
    }

    const proporcionRestante = (DURACION_INSULINA_MINUTOS - diffMinutos) / DURACION_INSULINA_MINUTOS;
    const insulinaActiva = parseFloat(ultimoRegistro.dosis) * proporcionRestante;

    return insulinaActiva.toFixed(1);
  };

  const handleCalculate = (glucosa, carbohidratos) => {
    const ratioCarbo = 10;
    const factorSensibilidad = 50;
    const metaGlucosa = 100;

    let dosis = 0;
    if (glucosa > metaGlucosa) {
      dosis += (glucosa - metaGlucosa) / factorSensibilidad;
    }
    dosis += carbohidratos / ratioCarbo;

    const iobActual = parseFloat(calcularInsulinaActiva());
    dosis = Math.max(0, dosis - iobActual);

    const dosisCalculada = dosis.toFixed(1);

    let tipoAlerta = 'success';
    let mensaje = 'Glucosa en nivel normal.';

    if (glucosa > 180) {
      tipoAlerta = 'danger';
      mensaje = 'Glucosa alta. Se ajustó la dosis restando la insulina que sigue activa.';
    } else if (glucosa < 70) {
      tipoAlerta = 'warning';
      mensaje = 'Glucosa baja. Consume alimentos con carbohidratos rápido.';
    }

    setResultado({
      dosisCalculada,
      tipoAlerta,
      mensaje
    });

    const nuevoRegistro = {
      id: Date.now(),
      glucosa,
      carbos: carbohidratos,
      dosis: dosisCalculada,
      fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setHistorial([nuevoRegistro, ...historial]);
  };

  const handleFocusGlucosa = () => {
    if (glucosaInputRef.current) {
      glucosaInputRef.current.focus();
      glucosaInputRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem' }}>
      <Navbar currentView={vistaActual} setCurrentView={setVistaActual} />

      <IobBadge iob={calcularInsulinaActiva()} />

      {vistaActual === 'dashboard' ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
            <CalculatorCard 
              onCalculate={handleCalculate} 
              result={resultado} 
              initialCarbos={carbosSeleccionados}
              glucosaInputRef={glucosaInputRef}
            />
            <FoodGuideCard 
              onSendCarbos={(carbos) => setCarbosSeleccionados({ valor: carbos, id: Date.now() })} 
            />
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <ReminderCard onFocusGlucosa={handleFocusGlucosa} />
          </div>
        </>
      ) : (
        <HistoryCard historial={historial} fullView={true} />
      )}
    </div>
  );
}