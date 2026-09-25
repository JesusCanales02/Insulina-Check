import './IobBadge.css';

export default function IobBadge({ iob }) {
  return (
    <div className="iob-badge">
      <div>
        <strong>Insulina</strong>
      </div>
      <span className="iob-value">{iob} Unidades de insulina</span>
    </div>
  );
}