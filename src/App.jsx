import { useState } from 'react';
import Navbar from './components/Navbar';
import IobBadge from './components/IobBadge';
import CalculatorCard from './components/CalculatorCard';
import FoodGuideCard from './components/FoodGuideCard';
import HistoryCard from './components/HistoryCard';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [insulinaActivaIOB] = useState(1.5);
  const [resultado, setResultado] = useState(null);
  const [carbosSeleccionados, setCarbosSeleccionados] = useState('');

  const [historial, setHistorial] = useState([
    { id: 1, fecha: '10:30 AM', glucosa: 140, carbos: 45, dosis: 4.5, alerta: false },
    { id: 2, fecha: '08:00 AM', glucosa: 65, carbos: 30, dosis: 0, alerta: true },
    { id: 3, fecha: 'Ayer 08:30 PM', glucosa: 190, carbos: 60, dosis: 7.3, alerta: false }
  ]);

  const handleCalculate = (glucosa, carbohidratos) => {
    const boloComida = carbohidratos / 10;
    const boloCorreccion = glucosa > 100 ? (glucosa - 100) / 50 : 0;
    const correccionAjustada = Math.max(0, boloCorreccion - insulinaActivaIOB);
    const dosisFinal = (boloComida + correccionAjustada).toFixed(1);

    let alerta = false;
    let tipoAlerta = 'success';
    let mensaje = "Dosis calculada dentro de parámetros normales.";

    if (glucosa < 70) {
      alerta = true;
      tipoAlerta = 'danger';
      mensaje = "¡Alerta de Hipoglucemia! Consuma 15g de carbohidratos antes de aplicar insulina.";
    } else if (dosisFinal > 15) {
      alerta = true;
      tipoAlerta = 'warning';
      mensaje = `Atención: La dosis calculada (${dosisFinal} U) supera el límite máximo por toma (15 U).`;
    }

    setResultado({
      dosisCalculada: dosisFinal,
      alerta,
      tipoAlerta,
      mensaje,
      iobRestada: insulinaActivaIOB
    });

    setHistorial([
      {
        id: Date.now(),
        fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        glucosa,
        carbos: carbohidratos,
        dosis: dosisFinal,
        alerta
      },
      ...historial
    ]);
  };

  const handleSelectCarbosFromGuide = (carbos) => {
    setCarbosSeleccionados(carbos);
  };

  return (
    <div className="container">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      {currentView === 'dashboard' && (
        <>
          <IobBadge iob={insulinaActivaIOB} />
          <div className="grid-layout">
            <CalculatorCard 
              onCalculate={handleCalculate} 
              result={resultado} 
              initialCarbos={carbosSeleccionados}
            />
            <FoodGuideCard onSelectCarbos={handleSelectCarbosFromGuide} />
            <HistoryCard historial={historial.slice(0, 4)} />
          </div>
        </>
      )}

      {currentView === 'history' && (
        <HistoryCard historial={historial} fullView={true} />
      )}
    </div>
  );
}