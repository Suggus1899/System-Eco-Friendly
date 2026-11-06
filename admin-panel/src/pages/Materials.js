import React, { useState, useEffect } from 'react';
import { materialsService } from '../services/api';

function Materials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'plastico',
    description: '',
    disposal_instructions: '',
    recyclable: true
  });

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      const response = await materialsService.getAll();
      // Backend now returns { data: [...], meta: {...} }
      setMaterials(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading materials:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMaterial) {
        await materialsService.update(editingMaterial.id, formData);
      } else {
        await materialsService.create(formData);
      }
      loadMaterials();
      resetForm();
    } catch (error) {
      alert('Error al guardar: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEdit = (material) => {
    setEditingMaterial(material);
    setFormData({
      name: material.name,
      category: material.category,
      description: material.description || '',
      disposal_instructions: material.disposal_instructions || '',
      recyclable: material.recyclable
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este material?')) {
      try {
        await materialsService.delete(id);
        loadMaterials();
      } catch (error) {
        alert('Error al eliminar: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'plastico',
      description: '',
      disposal_instructions: '',
      recyclable: true
    });
    setEditingMaterial(null);
    setShowForm(false);
  };

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
        <h1>Gestión de Materiales</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Nuevo Material'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2>{editingMaterial ? 'Editar Material' : 'Nuevo Material'}</h2>
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
              <label>Categoría *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              >
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Instrucciones de Disposición</label>
              <textarea
                value={formData.disposal_instructions}
                onChange={(e) => setFormData({...formData, disposal_instructions: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.recyclable}
                  onChange={(e) => setFormData({...formData, recyclable: e.target.checked})}
                  style={{ width: 'auto', marginRight: '10px' }}
                />
                Reciclable
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
        <h2>Lista de Materiales ({materials.length})</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Reciclable</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material) => (
                <tr key={material.id}>
                  <td>{material.name}</td>
                  <td>{categoryLabels[material.category]}</td>
                  <td>{material.recyclable ? '✓ Sí' : '✗ No'}</td>
                  <td>
                    <button 
                      className="btn btn-primary btn-small"
                      onClick={() => handleEdit(material)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-danger btn-small"
                      onClick={() => handleDelete(material.id)}
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

export default Materials;
