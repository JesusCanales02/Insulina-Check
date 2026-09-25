import './Navbar.css';

export default function Navbar({ currentView, setCurrentView }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h1>InsuliCheck Care+</h1>
        <small>Plataforma Clínica de Seguridad</small>
      </div>
      <div className="nav-buttons">
        <button
          className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentView('dashboard')}
        >
          Dashboard
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