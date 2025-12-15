import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      const { token, user } = response.data;

      if (user.role !== 'admin') {
        setError('Acceso denegado. Se requiere rol de administrador.');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>🌱 EcoGestión Local</h2>
        <p style={{ textAlign: 'center', marginBottom: '20px', color: '#7f8c8d' }}>
          Panel Administrativo
        </p>
        
        {error && (
          <div style={{ 
            padding: '10px', 
            marginBottom: '20px', 
            backgroundColor: '#f8d7da', 
            color: '#721c24',
            borderRadius: '5px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@ecogestion.com"
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: '#7f8c8d' }}>
          Credenciales de prueba: admin@ecogestion.com / password123
        </p>
      </div>
    </div>
  );
}

export default Login;
