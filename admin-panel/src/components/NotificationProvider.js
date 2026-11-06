import React, { createContext, useContext, useState, useCallback } from 'react';

// Notification Context
const NotificationContext = createContext();

// Hook to use notifications
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

// Notification types and their styles
const notificationStyles = {
    success: {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        icon: '✓'
    },
    error: {
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        icon: '✕'
    },
    warning: {
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        icon: '⚠'
    },
    info: {
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        icon: 'ℹ'
    }
};

// Single Notification Component
function Toast({ notification, onClose }) {
    const style = notificationStyles[notification.type] || notificationStyles.info;

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 20px',
                background: style.background,
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                color: 'white',
                minWidth: '300px',
                maxWidth: '450px',
                animation: 'slideIn 0.3s ease-out',
                position: 'relative'
            }}
        >
            <span style={{
                width: '28px',
                height: '28px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold'
            }}>
                {style.icon}
            </span>
            <div style={{ flex: 1 }}>
                {notification.title && (
                    <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '2px' }}>
                        {notification.title}
                    </div>
                )}
                <div style={{ fontSize: '13px', opacity: 0.95 }}>
                    {notification.message}
                </div>
            </div>
            <button
                onClick={onClose}
                style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            >
                ✕
            </button>
        </div>
    );
}

// Notification Provider Component
export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback(({ type = 'info', title, message, duration = 5000 }) => {
        const id = Date.now() + Math.random();

        setNotifications(prev => [...prev, { id, type, title, message }]);

        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }

        return id;
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    // Convenience methods
    const notify = {
        success: (message, title) => addNotification({ type: 'success', message, title }),
        error: (message, title) => addNotification({ type: 'error', message, title }),
        warning: (message, title) => addNotification({ type: 'warning', message, title }),
        info: (message, title) => addNotification({ type: 'info', message, title })
    };

    return (
        <NotificationContext.Provider value={{ notify, addNotification, removeNotification }}>
            {children}

            {/* Notification Container */}
            <div
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                }}
            >
                {notifications.map(notification => (
                    <Toast
                        key={notification.id}
                        notification={notification}
                        onClose={() => removeNotification(notification.id)}
                    />
                ))}
            </div>

            {/* Animation styles */}
            <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
        </NotificationContext.Provider>
    );
}

export default NotificationProvider;
