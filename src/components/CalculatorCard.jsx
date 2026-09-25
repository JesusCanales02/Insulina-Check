import { useState, useEffect } from 'react';
import './CalculatorCard.css';

export default function CalculatorCard({ onCalculate, result, initialCarbos, glucosaInputRef }) {
  const [glucosa, setGlucosa] = useState('');
  const [carbohidratos, setCarbohidratos] = useState('');

  // Sincroniza cada vez que initialCarbos cambie (usando el id único)
  useEffect(() => {
    if (initialCarbos && initialCarbos.valor !== undefined) {
      setCarbohidratos(String(initialCarbos.valor));
    }
  }, [initialCarbos]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate(parseFloat(glucosa) || 0, parseFloat(carbohidratos) || 0);
  };

  return (
    <div className="card">
      <h2 className="card-title">Calcular Dosis</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Glucosa actual (mg/dL)</label>
          <input
            ref={glucosaInputRef}
            type="number"
            className="form-input"
            placeholder="Ej. 120"
            value={glucosa}
            onChange={(e) => setGlucosa(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Carbohidratos (g)</label>
          <input
            type="number"
            className="form-input"
            placeholder="Ej. 30"
            value={carbohidratos}
            onChange={(e) => setCarbohidratos(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-primary">
          Calcular Dosis
        </button>
      </form>

      {result && (
        <div className={`alert-box alert-${result.tipoAlerta}`}>
          <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
            Dosis sugerida: {result.dosisCalculada} U
          </div>
          <div>{result.mensaje}</div>
          {result.iobRestada > 0 && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: 0.85 }}>
              * Se restaron {result.iobRestada} U de insulina activa.
            </div>
          )}
        </div>
      )}
    </div>
  );
}