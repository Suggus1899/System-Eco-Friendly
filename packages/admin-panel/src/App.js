import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Materials from './pages/Materials';
import './App.css';

function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="navbar-brand">
            <h1>🌱 EcoGestión Local</h1>
          </div>
          <div className="navbar-menu">
            <Link to="/">Dashboard</Link>
            <Link to="/materials">Materiales</Link>
            <Link to="/centers">Centros</Link>
            <Link to="/schedules">Horarios</Link>
            <Link to="/challenges">Retos</Link>
            <div className="navbar-user">
              <span>{user.name} ({user.role})</span>
              <button onClick={handleLogout} className="btn btn-sm btn-secondary">
                Salir
              </button>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/centers" element={<CentersPlaceholder />} />
            <Route path="/schedules" element={<SchedulesPlaceholder />} />
            <Route path="/challenges" element={<ChallengesPlaceholder />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Dashboard({ user }) {
  return (
    <div className="dashboard">
      <h1>Bienvenido, {user.name}!</h1>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>📦 Materiales</h3>
          <p>Gestiona los tipos de materiales reciclables</p>
          <Link to="/materials" className="btn btn-primary">Ver Materiales</Link>
        </div>
        <div className="dashboard-card">
          <h3>🏢 Centros de Reciclaje</h3>
          <p>Administra los centros de reciclaje</p>
          <Link to="/centers" className="btn btn-primary">Ver Centros</Link>
        </div>
        <div className="dashboard-card">
          <h3>📅 Horarios</h3>
          <p>Configura horarios de recolección</p>
          <Link to="/schedules" className="btn btn-primary">Ver Horarios</Link>
        </div>
        <div className="dashboard-card">
          <h3>🏆 Retos</h3>
          <p>Crea y gestiona retos semanales</p>
          <Link to="/challenges" className="btn btn-primary">Ver Retos</Link>
        </div>
      </div>
    </div>
  );
}

function CentersPlaceholder() {
  return <div className="placeholder"><h2>Módulo de Centros de Reciclaje</h2><p>Implementar CRUD completo similar a Materials</p></div>;
}

function SchedulesPlaceholder() {
  return <div className="placeholder"><h2>Módulo de Horarios de Recolección</h2><p>Implementar CRUD completo similar a Materials</p></div>;
}

function ChallengesPlaceholder() {
  return <div className="placeholder"><h2>Módulo de Retos</h2><p>Implementar CRUD completo similar a Materials</p></div>;
}

export default App;
