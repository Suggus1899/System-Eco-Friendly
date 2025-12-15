import React, { useState, useEffect } from 'react';
import { materialsService } from '../services/api';

function Materials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'plastico',
    description: '',
    disposal_instructions: '',
    image_url: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await materialsService.getAll();
      setMaterials(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar materiales');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await materialsService.update(editingId, formData);
      } else {
        await materialsService.create(formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', category: 'plastico', description: '', disposal_instructions: '', image_url: '' });
      fetchMaterials();
    } catch (err) {
      setError('Error al guardar material');
      console.error(err);
    }
  };

  const handleEdit = (material) => {
    setFormData({
      name: material.name,
      category: material.category,
      description: material.description || '',
      disposal_instructions: material.disposal_instructions || '',
      image_url: material.image_url || '',
    });
    setEditingId(material.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este material?')) {
      try {
        await materialsService.delete(id);
        fetchMaterials();
      } catch (err) {
        setError('Error al eliminar material');
        console.error(err);
      }
    }
  };

  const handleApprove = async (id, currentStatus) => {
    try {
      await materialsService.update(id, { is_approved: !currentStatus });
      fetchMaterials();
    } catch (err) {
      setError('Error al actualizar estado');
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="materials-page">
      <div className="page-header">
        <h1>Gestión de Materiales</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : 'Nuevo Material'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <form className="form-card" onSubmit={handleSubmit}>
          <h2>{editingId ? 'Editar Material' : 'Nuevo Material'}</h2>
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Categoría</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="plastico">Plástico</option>
              <option value="vidrio">Vidrio</option>
              <option value="papel">Papel</option>
              <option value="organico">Orgánico</option>
              <option value="electronicos">Electrónicos</option>
              <option value="metal">Metal</option>
            </select>
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Instrucciones de disposición</label>
            <textarea
              value={formData.disposal_instructions}
              onChange={(e) => setFormData({ ...formData, disposal_instructions: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>URL de Imagen</label>
            <input
              type="text"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Actualizar' : 'Crear'}
          </button>
        </form>
      )}

      <div className="materials-grid">
        {materials.map((material) => (
          <div key={material.id} className="material-card">
            <div className="material-header">
              <h3>{material.name}</h3>
              <span className={`badge badge-${material.category}`}>{material.category}</span>
            </div>
            <p>{material.description}</p>
            <p><strong>Instrucciones:</strong> {material.disposal_instructions}</p>
            <div className="material-actions">
              <button
                className={`btn btn-sm ${material.is_approved ? 'btn-success' : 'btn-warning'}`}
                onClick={() => handleApprove(material.id, material.is_approved)}
              >
                {material.is_approved ? 'Aprobado' : 'Aprobar'}
              </button>
              <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(material)}>
                Editar
              </button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(material.id)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Materials;
