import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/api';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="sidebar">
      <h2>🌱 EcoGestión</h2>
      <nav>
        <ul>
          <li>
            <Link to="/" className={isActive('/')}>
              📊 Dashboard
            </Link>
          </li>
          <li>
            <Link to="/materials" className={isActive('/materials')}>
              ♻️ Materiales
            </Link>
          </li>
          <li>
            <Link to="/centers" className={isActive('/centers')}>
              📍 Centros
            </Link>
          </li>
          <li>
            <Link to="/schedules" className={isActive('/schedules')}>
              📅 Horarios
            </Link>
          </li>
          <li>
            <Link to="/challenges" className={isActive('/challenges')}>
              🎯 Retos
            </Link>
          </li>
          <li style={{ marginTop: '30px' }}>
            <button 
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '10px',
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                textAlign: 'left',
                borderRadius: '5px',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#34495e'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              🚪 Cerrar Sesión
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
