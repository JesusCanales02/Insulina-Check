import { useState, useEffect } from 'react';
import './CalculatorCard.css';

export default function CalculatorCard({ onCalculate, result, initialCarbos }) {
  const [glucosa, setGlucosa] = useState('');
  const [carbohidratos, setCarbohidratos] = useState('');

  useEffect(() => {
    if (initialCarbos) {
      setCarbohidratos(initialCarbos);
    }
  }, [initialCarbos]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate(parseFloat(glucosa) || 0, parseFloat(carbohidratos) || 0);
  };

  return (
    <div className="card">
      <h2 className="card-title">🩺 Calculadora de Dosis</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Glucosa Actual (mg/dL)</label>
          <input
            type="number"
            className="form-input"
            placeholder="Ej. 135"
            value={glucosa}
            onChange={(e) => setGlucosa(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Carbohidratos a consumir (g)</label>
          <input
            type="number"
            className="form-input"
            placeholder="Ej. 40"
            value={carbohidratos}
            onChange={(e) => setCarbohidratos(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-primary">
          Calcular Dosis Segura
        </button>
      </form>

      {result && (
        <div className={`alert-box alert-${result.tipoAlerta}`}>
          <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
            Dosis Sugerida: {result.dosisCalculada} U
          </div>
          <div>{result.mensaje}</div>
          {result.iobRestada > 0 && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: 0.9 }}>
              * Se restaron {result.iobRestada} U de Insulina Activa (IOB) para evitar apilamiento.
            </div>
          )}
        </div>
      )}
    </div>
  );
}