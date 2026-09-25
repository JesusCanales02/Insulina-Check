import './HistoryCard.css';

export default function HistoryCard({ historial }) {
  return (
    <div className="card">
      <h2 className="card-title">Historial de Registros</h2>
      {historial.map((item) => (
        <div key={item.id} className="history-item">
          <div>
            <strong>{item.glucosa} mg/dL</strong> · {item.carbos}g carbos
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.fecha}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className={`history-dose ${item.alerta ? 'alert' : 'safe'}`}>
              {item.dosis} U
            </span>
            {item.alerta && <div style={{ fontSize: '0.7rem', color: '#ef4444' }}>Alerta</div>}
          </div>
        </div>
      ))}
    </div>
  );
}