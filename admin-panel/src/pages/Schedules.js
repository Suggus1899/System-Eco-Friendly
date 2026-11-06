import React, { useState, useEffect } from 'react';
import { schedulesService } from '../services/api';

function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    zone: '',
    material_category: 'plastico',
    day_of_week: 1,
    time: '',
    description: '',
    active: true
  });

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const response = await schedulesService.getAll();
      // Backend now returns { data: [...], meta: {...} }
      setSchedules(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading schedules:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSchedule) {
        await schedulesService.update(editingSchedule.id, formData);
      } else {
        await schedulesService.create(formData);
      }
      loadSchedules();
      resetForm();
    } catch (error) {
      alert('Error al guardar: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      zone: schedule.zone,
      material_category: schedule.material_category,
      day_of_week: schedule.day_of_week,
      time: schedule.time || '',
      description: schedule.description || '',
      active: schedule.active
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este horario?')) {
      try {
        await schedulesService.delete(id);
        loadSchedules();
      } catch (error) {
        alert('Error al eliminar: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      zone: '',
      material_category: 'plastico',
      day_of_week: 1,
      time: '',
      description: '',
      active: true
    });
    setEditingSchedule(null);
    setShowForm(false);
  };

  const dayLabels = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const categoryLabels = {
    organico: 'Orgánico',
    plastico: 'Plástico',
    vidrio: 'Vidrio',
    papel: 'Papel',
    electronico: 'Electrónico'
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <div className="header flex-between">
        <h1>Gestión de Horarios</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Nuevo Horario'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2>{editingSchedule ? 'Editar Horario' : 'Nuevo Horario'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Zona *</label>
              <input
                type="text"
                value={formData.zone}
                onChange={(e) => setFormData({...formData, zone: e.target.value})}
                required
                placeholder="Ej: Centro, Norte, Sur, Este"
              />
            </div>

            <div className="form-group">
              <label>Categoría de Material *</label>
              <select
                value={formData.material_category}
                onChange={(e) => setFormData({...formData, material_category: e.target.value})}
                required
              >
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Día de la Semana *</label>
              <select
                value={formData.day_of_week}
                onChange={(e) => setFormData({...formData, day_of_week: parseInt(e.target.value)})}
                required
              >
                {dayLabels.map((day, index) => (
                  <option key={index} value={index}>{day}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Hora</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({...formData, active: e.target.checked})}
                  style={{ width: 'auto', marginRight: '10px' }}
                />
                Activo
              </label>
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
        <h2>Lista de Horarios ({schedules.length})</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Zona</th>
                <th>Material</th>
                <th>Día</th>
                <th>Hora</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => (
                <tr key={schedule.id}>
                  <td>{schedule.zone}</td>
                  <td>{categoryLabels[schedule.material_category]}</td>
                  <td>{dayLabels[schedule.day_of_week]}</td>
                  <td>{schedule.time || 'N/A'}</td>
                  <td>
                    <span className={`badge badge-${schedule.active ? 'active' : 'inactive'}`}>
                      {schedule.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-primary btn-small"
                      onClick={() => handleEdit(schedule)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-danger btn-small"
                      onClick={() => handleDelete(schedule.id)}
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

export default Schedules;
