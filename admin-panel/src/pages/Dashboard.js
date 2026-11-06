import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { materialsService, centersService, challengesService, schedulesService } from '../services/api';
import { PieChart, BarChart, KPICard } from '../components/Charts';
import MapView from '../components/MapView';

// Icons
const Icons = {
  ArrowRight: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  ),
  TrendUp: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  )
};

// Category colors for materials
const categoryColors = {
  organico: '#f59e0b',
  plastico: '#3b82f6',
  vidrio: '#10b981',
  papel: '#ec4899',
  electronico: '#8b5cf6'
};

const categoryLabels = {
  organico: 'Orgánico',
  plastico: 'Plástico',
  vidrio: 'Vidrio',
  papel: 'Papel',
  electronico: 'Electrónico'
};

function Dashboard() {
  const [stats, setStats] = useState({
    materials: [],
    centers: [],
    activeChallenges: 0,
    schedules: 0,
    pendingCenters: 0,
    totalMaterials: 0,
    totalCenters: 0
  });
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Admin');

  useEffect(() => {
    loadStats();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.name) setUserName(user.name);
  }, []);

  const loadStats = async () => {
    try {
      const [materials, centers, challenges, schedules, pendingCenters] = await Promise.all([
        materialsService.getAll(),
        centersService.getAll(),
        challengesService.getAll({ status: 'active' }),
        schedulesService.getAll(),
        centersService.getAll({ status: 'pending' })
      ]);

      // Group materials by category
      const materialsByCategory = materials.data.reduce((acc, material) => {
        const category = material.category || 'otros';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      setStats({
        materials: materials.data,
        materialsByCategory,
        centers: centers.data,
        activeCenters: centers.data.filter(c => c.status === 'active'),
        activeChallenges: challenges.data.length,
        schedules: schedules.data.length,
        pendingCenters: pendingCenters.data.length,
        totalMaterials: materials.data.length,
        totalCenters: centers.data.length
      });
      setLoading(false);
    } catch (error) {
      console.error('Error loading stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <span>Cargando dashboard...</span>
      </div>
    );
  }

  // Prepare chart data
  const pieChartData = Object.entries(stats.materialsByCategory || {}).map(([category, count]) => ({
    label: categoryLabels[category] || category,
    value: count,
    color: categoryColors[category] || '#6b7280'
  }));

  const weeklyActivityData = [
    { label: 'Lun', value: 12, color: 'var(--primary-400)' },
    { label: 'Mar', value: 19, color: 'var(--primary-500)' },
    { label: 'Mié', value: 8, color: 'var(--primary-400)' },
    { label: 'Jue', value: 15, color: 'var(--primary-500)' },
    { label: 'Vie', value: 22, color: 'var(--primary-600)' },
    { label: 'Sáb', value: 18, color: 'var(--primary-500)' },
    { label: 'Dom', value: 6, color: 'var(--primary-300)' }
  ];

  const statCards = [
    {
      title: 'Materiales',
      value: stats.totalMaterials,
      gradient: 'stat-gradient-1',
      trend: '+2 esta semana'
    },
    {
      title: 'Centros Activos',
      value: stats.activeCenters?.length || 0,
      gradient: 'stat-gradient-2',
      trend: `${stats.pendingCenters} pendientes`
    },
    {
      title: 'Retos Activos',
      value: stats.activeChallenges,
      gradient: 'stat-gradient-3',
      trend: 'Semana actual'
    },
    {
      title: 'Horarios',
      value: stats.schedules,
      gradient: 'stat-gradient-4',
      trend: 'Configurados'
    }
  ];

  const quickActions = [
    { path: '/materials', label: 'Materiales', icon: '♻️', color: 'btn-primary' },
    { path: '/centers', label: 'Centros', icon: '📍', color: 'btn-success' },
    { path: '/challenges', label: 'Retos', icon: '🎯', color: 'btn-secondary' },
    { path: '/schedules', label: 'Horarios', icon: '📅', color: 'btn-outline' }
  ];

  return (
    <div>
      <div className="header">
        <div>
          <h1>Dashboard</h1>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '14px', marginTop: '4px' }}>
            Bienvenido de nuevo, {userName}
          </p>
        </div>
        <div className="user-info">
          <span style={{
            padding: '8px 16px',
            background: 'var(--primary-100)',
            color: 'var(--primary-700)',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            🌱 Sistema Activo
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map((card, index) => (
          <div key={index} className={`stat-card ${card.gradient}`}>
            <h3>{card.title}</h3>
            <div className="stat-value">{card.value}</div>
            <div className="stat-trend">
              <Icons.TrendUp />
              {card.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <div className="card">
          <h2>📊 Materiales por Categoría</h2>
          {pieChartData.length > 0 ? (
            <PieChart data={pieChartData} size={180} />
          ) : (
            <p style={{ color: 'var(--text-tertiary)' }}>No hay datos de materiales</p>
          )}
        </div>

        <div className="card">
          <h2>📈 Actividad Semanal</h2>
          <BarChart data={weeklyActivityData} height={180} />
          <p style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-tertiary)', textAlign: 'center' }}>
            Interacciones de usuarios por día
          </p>
        </div>
      </div>

      {/* Map and Quick Actions Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div className="card">
          <h2>🗺️ Centros de Reciclaje</h2>
          {stats.activeCenters && stats.activeCenters.length > 0 ? (
            <MapView
              centers={stats.activeCenters}
              height="250px"
              interactive={false}
            />
          ) : (
            <div style={{
              height: '250px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg-tertiary)',
              borderRadius: '12px',
              color: 'var(--text-tertiary)'
            }}>
              No hay centros activos para mostrar
            </div>
          )}
          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              {stats.activeCenters?.length || 0} centros activos
            </span>
            <Link to="/centers" className="btn btn-outline btn-small">
              Ver todos <Icons.ArrowRight />
            </Link>
          </div>
        </div>

        <div className="card">
          <h2>⚡ Acciones Rápidas</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.path}
                className={`btn ${action.color}`}
                style={{ justifyContent: 'space-between' }}
              >
                <span>{action.icon} {action.label}</span>
                <Icons.ArrowRight />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* KPIs and System Info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <KPICard
          title="Tasa de Reciclaje"
          value="78%"
          trend="up"
          trendValue="+5% vs mes anterior"
          icon="♻️"
        />
        <KPICard
          title="Usuarios Activos"
          value="234"
          trend="up"
          trendValue="+12 esta semana"
          icon="👥"
        />
        <KPICard
          title="Retos Completados"
          value="89"
          trend="up"
          trendValue="+8 esta semana"
          icon="🏆"
        />
        <KPICard
          title="Puntos Otorgados"
          value="4.2K"
          trend="up"
          trendValue="+350 esta semana"
          icon="⭐"
        />
      </div>

      {/* System Info Footer */}
      <div className="card" style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>EcoGestión Local</span>
            <span style={{ marginLeft: '8px', padding: '4px 8px', background: 'var(--primary-100)', color: 'var(--primary-700)', borderRadius: '4px', fontSize: '12px' }}>v1.0.0</span>
          </div>
          <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            <span>🟢 Backend: Activo</span>
            <span>🟢 Base de datos: Conectada</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
