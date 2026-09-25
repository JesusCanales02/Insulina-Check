import './IobBadge.css';

export default function IobBadge({ iob }) {
  return (
    <div className="iob-badge">
      <div>
        <strong>Insulina a Bordo (IOB) Activa:</strong>
        <div style={{ fontSize: '0.85rem' }}>Protección activa contra apilamiento de dosis (Insulin Stacking)</div>
      </div>
      <span className="iob-value">{iob} U</span>
    </div>
  );
}