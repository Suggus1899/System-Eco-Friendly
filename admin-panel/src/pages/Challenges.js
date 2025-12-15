import React, { useState, useEffect } from 'react';
import { challengesService } from '../services/api';

function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    points_reward: 10,
    challenge_type: 'weekly',
    start_date: '',
    end_date: '',
    status: 'active',
    target_value: 1
  });

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      const response = await challengesService.getAll();
      setChallenges(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading challenges:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingChallenge) {
        await challengesService.update(editingChallenge.id, formData);
      } else {
        await challengesService.create(formData);
      }
      loadChallenges();
      resetForm();
    } catch (error) {
      alert('Error al guardar: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEdit = (challenge) => {
    setEditingChallenge(challenge);
    setFormData({
      title: challenge.title,
      description: challenge.description,
      points_reward: challenge.points_reward,
      challenge_type: challenge.challenge_type,
      start_date: challenge.start_date?.split('T')[0] || '',
      end_date: challenge.end_date?.split('T')[0] || '',
      status: challenge.status,
      target_value: challenge.target_value || 1
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este reto?')) {
      try {
        await challengesService.delete(id);
        loadChallenges();
      } catch (error) {
        alert('Error al eliminar: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      points_reward: 10,
      challenge_type: 'weekly',
      start_date: '',
      end_date: '',
      status: 'active',
      target_value: 1
    });
    setEditingChallenge(null);
    setShowForm(false);
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <div className="header flex-between">
        <h1>Gestión de Retos</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Nuevo Reto'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2>{editingChallenge ? 'Editar Reto' : 'Nuevo Reto'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Título *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Descripción *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Puntos de Recompensa *</label>
              <input
                type="number"
                value={formData.points_reward}
                onChange={(e) => setFormData({...formData, points_reward: parseInt(e.target.value)})}
                required
              />
            </div>

            <div className="form-group">
              <label>Tipo *</label>
              <select
                value={formData.challenge_type}
                onChange={(e) => setFormData({...formData, challenge_type: e.target.value})}
                required
              >
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
                <option value="daily">Diario</option>
              </select>
            </div>

            <div className="form-group">
              <label>Fecha Inicio</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Fecha Fin</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Valor Objetivo</label>
              <input
                type="number"
                value={formData.target_value}
                onChange={(e) => setFormData({...formData, target_value: parseInt(e.target.value)})}
              />
            </div>

            <div className="form-group">
              <label>Estado *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                required
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="completed">Completado</option>
              </select>
            </div>

            <div className="flex gap-10">
              <button type="submit" className="btn btn-success">Guardar</button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h2>Lista de Retos ({challenges.length})</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Tipo</th>
                <th>Puntos</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {challenges.map((challenge) => (
                <tr key={challenge.id}>
                  <td>{challenge.title}</td>
                  <td>{challenge.challenge_type}</td>
                  <td>{challenge.points_reward}</td>
                  <td>
                    <span className={`badge badge-${challenge.status}`}>
                      {challenge.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-primary btn-small"
                      onClick={() => handleEdit(challenge)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-danger btn-small"
                      onClick={() => handleDelete(challenge.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Challenges;
