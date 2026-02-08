import React, { useState, useEffect } from 'react';
import { centersService } from '../services/api';
import MapView from '../components/MapView';
import LocationPicker from '../components/LocationPicker';

function Centers() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCenter, setEditingCenter] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
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
      // Backend now returns { data: [...], meta: {...} }
      setCenters(response.data.data || []);
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

  const handleLocationSelect = (lat, lng) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
  };

  const handleMarkerClick = (center) => {
    setSelectedCenter(center);
  };

  const filteredCenters = statusFilter === 'all'
    ? centers
    : centers.filter(c => c.status === statusFilter);

  const statusLabels = {
    active: { label: 'Activo', color: 'var(--success)' },
    inactive: { label: 'Inactivo', color: 'var(--error)' },
    pending: { label: 'Pendiente', color: 'var(--warning)' }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <span>Cargando centros...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="header flex-between">
        <div>
          <h1>Gestión de Centros de Reciclaje</h1>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '14px', marginTop: '4px' }}>
            {centers.length} centros registrados
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancelar' : '+ Nuevo Centro'}
        </button>
      </div>

      {/* Map Section */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0 }}>🗺️ Mapa de Centros</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'active', 'pending', 'inactive'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`btn btn-small ${statusFilter === status ? 'btn-primary' : 'btn-outline'}`}
              >
                {status === 'all' ? 'Todos' : statusLabels[status].label}
              </button>
            ))}
          </div>
        </div>
        <MapView
          centers={filteredCenters}
          selectedCenter={selectedCenter}
          onMarkerClick={handleMarkerClick}
          height="400px"
        />
        <div style={{ marginTop: '12px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></span>
            Activos ({centers.filter(c => c.status === 'active').length})
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></span>
            Pendientes ({centers.filter(c => c.status === 'pending').length})
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></span>
            Inactivos ({centers.filter(c => c.status === 'inactive').length})
          </span>
        </div>
      </div>

      {showForm && (
        <div className="card">
          <h2>{editingCenter ? '✏️ Editar Centro' : '➕ Nuevo Centro'}</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div>
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Nombre del centro"
                  />
                </div>

                <div className="form-group">
                  <label>Dirección *</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    placeholder="Dirección completa"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label>Teléfono</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Ej: 0412-1234567"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Horario de Operación</label>
                  <input
                    type="text"
                    value={formData.hours_operation}
                    onChange={(e) => setFormData({ ...formData, hours_operation: e.target.value })}
                    placeholder="Ej: Lun-Vie: 8:00-17:00"
                  />
                </div>

                <div className="form-group">
                  <label>Estado *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="pending">Pendiente</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="form-group">
                  <label>Ubicación en el Mapa *</label>
                  <LocationPicker
                    initialLat={formData.latitude ? parseFloat(formData.latitude) : null}
                    initialLng={formData.longitude ? parseFloat(formData.longitude) : null}
                    onLocationSelect={handleLocationSelect}
                    height="280px"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-10" style={{ marginTop: '20px' }}>
              <button type="submit" className="btn btn-success">
                💾 Guardar Centro
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h2>📋 Lista de Centros ({filteredCenters.length})</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Teléfono</th>
                <th>Horario</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCenters.map((center) => (
                <tr
                  key={center.id}
                  style={{
                    cursor: 'pointer',
                    background: selectedCenter?.id === center.id ? 'var(--primary-50)' : 'transparent'
                  }}
                  onClick={() => setSelectedCenter(center)}
                >
                  <td style={{ fontWeight: '500' }}>{center.name}</td>
                  <td>{center.address}</td>
                  <td>{center.phone || '—'}</td>
                  <td>{center.hours_operation || '—'}</td>
                  <td>
                    <span className={`badge badge-${center.status}`}>
                      {statusLabels[center.status]?.label || center.status}
                    </span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
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
