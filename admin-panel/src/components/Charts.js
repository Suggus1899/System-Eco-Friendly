import React from 'react';

// Simple Chart Components without external dependencies
// These use pure SVG for rendering charts

/**
 * Pie Chart Component
 */
export function PieChart({ data, size = 200, showLegend = true }) {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    const createSlice = (value, index) => {
        const percentage = value / total;
        const angle = percentage * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;
        currentAngle = endAngle;

        const start = polarToCartesian(size / 2, size / 2, size / 2 - 10, startAngle);
        const end = polarToCartesian(size / 2, size / 2, size / 2 - 10, endAngle);
        const largeArcFlag = angle > 180 ? 1 : 0;

        const pathData = [
            `M ${size / 2} ${size / 2}`,
            `L ${start.x} ${start.y}`,
            `A ${size / 2 - 10} ${size / 2 - 10} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
            'Z'
        ].join(' ');

        return pathData;
    };

    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
        const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
        return {
            x: centerX + radius * Math.cos(angleInRadians),
            y: centerY + radius * Math.sin(angleInRadians)
        };
    };

    // Reset angle for slice creation
    currentAngle = 0;

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <svg width={size} height={size} style={{ flexShrink: 0 }}>
                {data.map((item, index) => (
                    <path
                        key={index}
                        d={createSlice(item.value, index)}
                        fill={item.color}
                        stroke="var(--bg-card)"
                        strokeWidth="2"
                        style={{ transition: 'all 0.3s ease' }}
                    >
                        <title>{item.label}: {item.value} ({((item.value / total) * 100).toFixed(1)}%)</title>
                    </path>
                ))}
                <circle cx={size / 2} cy={size / 2} r={size / 4} fill="var(--bg-card)" />
                <text
                    x={size / 2}
                    y={size / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontSize: '24px', fontWeight: '700', fill: 'var(--text-primary)' }}
                >
                    {total}
                </text>
                <text
                    x={size / 2}
                    y={size / 2 + 20}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontSize: '12px', fill: 'var(--text-tertiary)' }}
                >
                    Total
                </text>
            </svg>

            {showLegend && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {data.map((item, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '3px',
                                background: item.color
                            }}></span>
                            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                                {item.label}
                            </span>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginLeft: 'auto' }}>
                                {item.value}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/**
 * Bar Chart Component
 */
export function BarChart({ data, height = 200, barColor = 'var(--primary-500)' }) {
    const maxValue = Math.max(...data.map(item => item.value));
    const barWidth = 100 / data.length - 2;

    return (
        <div style={{ width: '100%' }}>
            <svg width="100%" height={height} preserveAspectRatio="xMidYMid meet">
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map((percent) => (
                    <g key={percent}>
                        <line
                            x1="0"
                            y1={`${100 - percent}%`}
                            x2="100%"
                            y2={`${100 - percent}%`}
                            stroke="var(--border-color)"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                        />
                        <text
                            x="-5"
                            y={`${100 - percent}%`}
                            textAnchor="end"
                            dominantBaseline="middle"
                            style={{ fontSize: '10px', fill: 'var(--text-tertiary)' }}
                        >
                            {Math.round((maxValue * percent) / 100)}
                        </text>
                    </g>
                ))}

                {/* Bars */}
                {data.map((item, index) => {
                    const barHeight = (item.value / maxValue) * 100;
                    const x = (index / data.length) * 100 + 1;

                    return (
                        <g key={index}>
                            <rect
                                x={`${x}%`}
                                y={`${100 - barHeight}%`}
                                width={`${barWidth}%`}
                                height={`${barHeight}%`}
                                fill={item.color || barColor}
                                rx="4"
                                style={{ transition: 'all 0.3s ease' }}
                            >
                                <title>{item.label}: {item.value}</title>
                            </rect>
                        </g>
                    );
                })}
            </svg>

            {/* Labels */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                marginTop: '8px',
                paddingLeft: '20px'
            }}>
                {data.map((item, index) => (
                    <span
                        key={index}
                        style={{
                            fontSize: '11px',
                            color: 'var(--text-tertiary)',
                            textAlign: 'center',
                            flex: 1
                        }}
                    >
                        {item.label}
                    </span>
                ))}
            </div>
        </div>
    );
}

/**
 * KPI Card Component
 */
export function KPICard({ title, value, trend, trendValue, icon, color = 'var(--primary-500)' }) {
    const isPositive = trend === 'up';
    const trendColor = isPositive ? 'var(--success)' : 'var(--error)';

    return (
        <div style={{
            padding: '20px',
            background: 'var(--bg-card)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{title}</span>
                {icon && <span style={{ fontSize: '20px' }}>{icon}</span>}
            </div>

            <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {value}
            </div>

            {trendValue && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    color: trendColor
                }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {isPositive ? (
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                        ) : (
                            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                        )}
                    </svg>
                    {trendValue}
                </div>
            )}
        </div>
    );
}

/**
 * Mini Donut Chart for compact displays
 */
export function MiniDonut({ value, max, size = 60, color = 'var(--primary-500)' }) {
    const percentage = (value / max) * 100;
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div style={{ position: 'relative', width: size, height: size }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="var(--border-color)"
                    strokeWidth={strokeWidth}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
            </svg>
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--text-primary)'
            }}>
                {value}
            </div>
        </div>
    );
}

export default { PieChart, BarChart, KPICard, MiniDonut };
