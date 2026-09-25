import './Navbar.css';

export default function Navbar({ currentView, setCurrentView }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h1>Insulina Check</h1>
      </div>
      <div className="nav-buttons">
        <button
          className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentView('dashboard')}
        >
          Inicio
        </button>
        <button
          className={`nav-btn ${currentView === 'history' ? 'active' : ''}`}
          onClick={() => setCurrentView('history')}
        >
          Historial
        </button>
      </div>
    </nav>
  );
}