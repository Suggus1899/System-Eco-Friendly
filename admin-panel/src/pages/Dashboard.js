import React, { useState, useEffect } from 'react';
import { materialsService, centersService, challengesService } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    materials: 0,
    centers: 0,
    activeChallenges: 0,
    pendingCenters: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [materials, centers, challenges, pendingCenters] = await Promise.all([
        materialsService.getAll(),
        centersService.getAll({ status: 'active' }),
        challengesService.getAll({ status: 'active' }),
        centersService.getAll({ status: 'pending' })
      ]);

      setStats({
        materials: materials.data.length,
        centers: centers.data.length,
        activeChallenges: challenges.data.length,
        pendingCenters: pendingCenters.data.length
      });
      setLoading(false);
    } catch (error) {
      console.error('Error loading stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <div className="header">
        <h1>Dashboard</h1>
        <div className="user-info">
          <span>Bienvenido, Admin</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <h3>Total Materiales</h3>
          <div className="stat-value">{stats.materials}</div>
        </div>

        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
          <h3>Centros Activos</h3>
          <div className="stat-value">{stats.centers}</div>
        </div>

        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
          <h3>Retos Activos</h3>
          <div className="stat-value">{stats.activeChallenges}</div>
        </div>

        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
          <h3>Centros Pendientes</h3>
          <div className="stat-value">{stats.pendingCenters}</div>
        </div>
      </div>

      <div className="card">
        <h2>Acciones Rápidas</h2>
        <div className="flex gap-10">
          <a href="/materials" className="btn btn-primary">Gestionar Materiales</a>
          <a href="/centers" className="btn btn-success">Gestionar Centros</a>
          <a href="/challenges" className="btn btn-secondary">Gestionar Retos</a>
        </div>
      </div>

      <div className="card">
        <h2>Información del Sistema</h2>
        <p>Sistema EcoGestión Local v1.0.0</p>
        <p>Panel administrativo para gestión de residuos y reciclaje</p>
      </div>
    </div>
  );
}

export default Dashboard;
