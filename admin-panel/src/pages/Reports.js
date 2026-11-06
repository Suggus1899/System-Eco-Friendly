import React, { useState, useEffect } from 'react';
import { materialsService, centersService, challengesService, schedulesService } from '../services/api';
import { PieChart, BarChart } from '../components/Charts';

// Category labels
const categoryLabels = {
    organico: 'Orgánico',
    plastico: 'Plástico',
    vidrio: 'Vidrio',
    papel: 'Papel',
    electronico: 'Electrónico'
};

const categoryColors = {
    organico: '#f59e0b',
    plastico: '#3b82f6',
    vidrio: '#10b981',
    papel: '#ec4899',
    electronico: '#8b5cf6'
};

function Reports() {
    const [reportType, setReportType] = useState('materials');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [dateRange, setDateRange] = useState({
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        generateReport();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reportType]);

    const generateReport = async () => {
        setLoading(true);
        try {
            let reportData = {};

            switch (reportType) {
                case 'materials':
                    const materials = await materialsService.getAll();
                    // Backend returns { data: [...], meta: {...} }
                    const materialsData = materials.data.data || [];
                    const materialsByCategory = materialsData.reduce((acc, m) => {
                        acc[m.category] = (acc[m.category] || 0) + 1;
                        return acc;
                    }, {});
                    reportData = {
                        title: 'Reporte de Materiales',
                        total: materialsData.length,
                        items: materialsData,
                        byCategory: materialsByCategory
                    };
                    break;

                case 'centers':
                    const centers = await centersService.getAll();
                    const centersData = centers.data.data || [];
                    const centersByStatus = centersData.reduce((acc, c) => {
                        acc[c.status] = (acc[c.status] || 0) + 1;
                        return acc;
                    }, {});
                    reportData = {
                        title: 'Reporte de Centros de Reciclaje',
                        total: centersData.length,
                        items: centersData,
                        byStatus: centersByStatus
                    };
                    break;

                case 'challenges':
                    const challenges = await challengesService.getAll();
                    const challengesData = challenges.data.data || [];
                    reportData = {
                        title: 'Reporte de Retos',
                        total: challengesData.length,
                        items: challengesData,
                        active: challengesData.filter(c => c.status === 'active').length
                    };
                    break;

                case 'schedules':
                    const schedules = await schedulesService.getAll();
                    const schedulesData = schedules.data.data || [];
                    const schedulesByZone = schedulesData.reduce((acc, s) => {
                        acc[s.zone] = (acc[s.zone] || 0) + 1;
                        return acc;
                    }, {});
                    reportData = {
                        title: 'Reporte de Horarios',
                        total: schedulesData.length,
                        items: schedulesData,
                        byZone: schedulesByZone
                    };
                    break;

                default:
                    break;
            }

            setData(reportData);
        } catch (error) {
            console.error('Error generating report:', error);
        }
        setLoading(false);
    };

    const exportToCSV = () => {
        if (!data || !data.items) return;

        const headers = Object.keys(data.items[0] || {}).join(',');
        const rows = data.items.map(item =>
            Object.values(item).map(v => `"${v}"`).join(',')
        ).join('\n');

        const csv = `${headers}\n${rows}`;
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const printReport = () => {
        window.print();
    };

    const reportTypes = [
        { value: 'materials', label: 'Materiales', icon: '♻️' },
        { value: 'centers', label: 'Centros', icon: '📍' },
        { value: 'challenges', label: 'Retos', icon: '🎯' },
        { value: 'schedules', label: 'Horarios', icon: '📅' }
    ];

    return (
        <div>
            <div className="header flex-between">
                <div>
                    <h1>📊 Reportes</h1>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '14px', marginTop: '4px' }}>
                        Genera y exporta reportes del sistema
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-outline" onClick={printReport}>
                        🖨️ Imprimir
                    </button>
                    <button className="btn btn-primary" onClick={exportToCSV} disabled={!data}>
                        📥 Exportar CSV
                    </button>
                </div>
            </div>

            {/* Report Type Selector */}
            <div className="card">
                <h2>Configuración del Reporte</h2>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div className="form-group" style={{ margin: 0, minWidth: '200px' }}>
                        <label>Tipo de Reporte</label>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                        >
                            {reportTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.icon} {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                        <label>Fecha Desde</label>
                        <input
                            type="date"
                            value={dateRange.from}
                            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                        />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                        <label>Fecha Hasta</label>
                        <input
                            type="date"
                            value={dateRange.to}
                            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                        />
                    </div>

                    <button className="btn btn-success" onClick={generateReport}>
                        🔄 Generar Reporte
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <span>Generando reporte...</span>
                </div>
            ) : data ? (
                <>
                    {/* Report Summary */}
                    <div className="card" id="report-preview">
                        <h2>{data.title}</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                            Período: {dateRange.from} - {dateRange.to} | Total de registros: <strong>{data.total}</strong>
                        </p>

                        {/* Charts based on report type */}
                        {reportType === 'materials' && data.byCategory && (
                            <div style={{ marginBottom: '30px' }}>
                                <h3 style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>Distribución por Categoría</h3>
                                <PieChart
                                    data={Object.entries(data.byCategory).map(([cat, count]) => ({
                                        label: categoryLabels[cat] || cat,
                                        value: count,
                                        color: categoryColors[cat] || '#6b7280'
                                    }))}
                                    size={180}
                                />
                            </div>
                        )}

                        {reportType === 'centers' && data.byStatus && (
                            <div style={{ marginBottom: '30px' }}>
                                <h3 style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>Distribución por Estado</h3>
                                <BarChart
                                    data={Object.entries(data.byStatus).map(([status, count]) => ({
                                        label: status === 'active' ? 'Activos' : status === 'pending' ? 'Pendientes' : 'Inactivos',
                                        value: count,
                                        color: status === 'active' ? '#10b981' : status === 'pending' ? '#f59e0b' : '#ef4444'
                                    }))}
                                    height={150}
                                />
                            </div>
                        )}

                        {reportType === 'schedules' && data.byZone && (
                            <div style={{ marginBottom: '30px' }}>
                                <h3 style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>Horarios por Zona</h3>
                                <BarChart
                                    data={Object.entries(data.byZone).map(([zone, count]) => ({
                                        label: zone,
                                        value: count,
                                        color: 'var(--primary-500)'
                                    }))}
                                    height={150}
                                />
                            </div>
                        )}

                        {/* Data Table */}
                        <div className="table-container" style={{ maxHeight: '400px', overflow: 'auto' }}>
                            <table>
                                <thead>
                                    <tr>
                                        {reportType === 'materials' && (
                                            <>
                                                <th>ID</th>
                                                <th>Nombre</th>
                                                <th>Categoría</th>
                                                <th>Reciclable</th>
                                            </>
                                        )}
                                        {reportType === 'centers' && (
                                            <>
                                                <th>ID</th>
                                                <th>Nombre</th>
                                                <th>Dirección</th>
                                                <th>Estado</th>
                                            </>
                                        )}
                                        {reportType === 'challenges' && (
                                            <>
                                                <th>ID</th>
                                                <th>Título</th>
                                                <th>Puntos</th>
                                                <th>Estado</th>
                                            </>
                                        )}
                                        {reportType === 'schedules' && (
                                            <>
                                                <th>ID</th>
                                                <th>Zona</th>
                                                <th>Categoría</th>
                                                <th>Día</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.items.map((item, index) => (
                                        <tr key={index}>
                                            {reportType === 'materials' && (
                                                <>
                                                    <td>{item.id}</td>
                                                    <td>{item.name}</td>
                                                    <td>
                                                        <span className={`badge badge-${item.category}`}>
                                                            {categoryLabels[item.category] || item.category}
                                                        </span>
                                                    </td>
                                                    <td>{item.recyclable ? '✓ Sí' : '✗ No'}</td>
                                                </>
                                            )}
                                            {reportType === 'centers' && (
                                                <>
                                                    <td>{item.id}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.address}</td>
                                                    <td>
                                                        <span className={`badge badge-${item.status}`}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                </>
                                            )}
                                            {reportType === 'challenges' && (
                                                <>
                                                    <td>{item.id}</td>
                                                    <td>{item.title}</td>
                                                    <td>{item.points_reward} pts</td>
                                                    <td>
                                                        <span className={`badge badge-${item.status}`}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                </>
                                            )}
                                            {reportType === 'schedules' && (
                                                <>
                                                    <td>{item.id}</td>
                                                    <td>{item.zone}</td>
                                                    <td>{item.material_category}</td>
                                                    <td>{['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][item.day_of_week]}</td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: 'var(--text-tertiary)' }}>
                        Selecciona un tipo de reporte y haz clic en "Generar Reporte"
                    </p>
                </div>
            )}

            {/* Print Styles */}
            <style>{`
        @media print {
          .sidebar, .header button, .card:first-of-type {
            display: none !important;
          }
          .main-content {
            margin-left: 0 !important;
          }
          #report-preview {
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>
        </div>
    );
}

export default Reports;
