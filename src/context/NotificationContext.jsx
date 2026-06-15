import React, { createContext, useState, useContext, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const notification = useCallback((message, status = 'info') => {
        const id = Date.now() + Math.random();
        setNotifications((prev) => [...prev, { id, message, status }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            removeNotification(id);
        }, 3000);
    }, [removeNotification]);

    return (
        <NotificationContext.Provider value={{ notification }}>
            {children}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
                {notifications.map((n) => (
                    <NotificationToast key={n.id} {...n} onClose={() => removeNotification(n.id)} />
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

const NotificationToast = ({ message, status, onClose }) => {
    const styles = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warn: 'bg-yellow-500 text-white',
        info: 'bg-blue-500 text-white',
    };

    const icons = {
        success: <CheckCircle size={20} />,
        error: <AlertCircle size={20} />,
        warn: <AlertTriangle size={20} />,
        info: <Info size={20} />,
    };

    return (
        <div className={`pointer-events-auto min-w-[300px] max-w-md p-4 rounded-lg shadow-lg flex items-start gap-3 transform transition-all duration-300 animate-in slide-in-from-right-full ${styles[status] || styles.info}`}>
            <div className="mt-0.5">{icons[status] || icons.info}</div>
            <div className="flex-1">
                <p className="text-sm font-medium">{message}</p>
            </div>
            <button onClick={onClose} className="opacity-80 hover:opacity-100 transition-opacity">
                <X size={18} />
            </button>
        </div>
    );
};
