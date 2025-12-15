import React, { useState, useEffect } from 'react';
import { centersService } from '../services/api';

function Centers() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCenter, setEditingCenter] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    phone: '',
    email: '',
    hours_operation: '',
    status: 'active'
  });

  useEffect(() => {
    loadCenters();
  }, []);

  const loadCenters = async () => {
    try {
      const response = await centersService.getAll();
      setCenters(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading centers:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      };
      
      if (editingCenter) {
        await centersService.update(editingCenter.id, data);
      } else {
        await centersService.create(data);
      }
      loadCenters();
      resetForm();
    } catch (error) {
      alert('Error al guardar: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEdit = (center) => {
    setEditingCenter(center);
    setFormData({
      name: center.name,
      address: center.address,
      latitude: center.latitude,
      longitude: center.longitude,
      phone: center.phone || '',
      email: center.email || '',
      hours_operation: center.hours_operation || '',
      status: center.status
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este centro?')) {
      try {
        await centersService.delete(id);
        loadCenters();
      } catch (error) {
        alert('Error al eliminar: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      latitude: '',
      longitude: '',
      phone: '',
      email: '',
      hours_operation: '',
      status: 'active'
    });
    setEditingCenter(null);
    setShowForm(false);
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <div className="header flex-between">
        <h1>Gestión de Centros de Reciclaje</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Nuevo Centro'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2>{editingCenter ? 'Editar Centro' : 'Nuevo Centro'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Dirección *</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Latitud *</label>
              <input
                type="number"
                step="0.000001"
                value={formData.latitude}
                onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Longitud *</label>
              <input
                type="number"
                step="0.000001"
                value={formData.longitude}
                onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Horario</label>
              <input
                type="text"
                value={formData.hours_operation}
                onChange={(e) => setFormData({...formData, hours_operation: e.target.value})}
                placeholder="Ej: Lun-Vie: 8:00-17:00"
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
                <option value="pending">Pendiente</option>
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
        <h2>Lista de Centros ({centers.length})</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {centers.map((center) => (
                <tr key={center.id}>
                  <td>{center.name}</td>
                  <td>{center.address}</td>
                  <td>{center.phone || 'N/A'}</td>
                  <td>
                    <span className={`badge badge-${center.status}`}>
                      {center.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-primary btn-small"
                      onClick={() => handleEdit(center)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-danger btn-small"
                      onClick={() => handleDelete(center.id)}
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

export default Centers;
