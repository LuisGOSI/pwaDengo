// ToastNotification.jsx
import React, { useState, createContext, useContext } from 'react';
import './../components/common/Mensaje/Mensaje.css';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = (type, title, message) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, title, message }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 4000);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast debe ser usado dentro de ToastProvider');
    }
    return context;
};

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <Toast 
                    key={toast.id} 
                    {...toast} 
                    onClose={() => removeToast(toast.id)} 
                />
            ))}
        </div>
    );
};

const Toast = ({ type, title, message, onClose }) => {
    const getIcon = () => {
        switch (type) {
            case 'success':
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="#10b981" fillOpacity="0.2"/>
                        <path d="M9 12l2 2 4-4" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                );
            case 'error':
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="#ef4444" fillOpacity="0.2"/>
                        <path d="M15 9l-6 6M9 9l6 6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                );
            case 'warning':
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="#f59e0b" fillOpacity="0.2"/>
                        <path d="M12 8v4M12 16h.01" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`toast toast-${type}`}>
            <div className="toast-content">
                <div className="toast-icon">
                    {getIcon()}
                </div>
                <div className="toast-text">
                    <div className="toast-title">{title}</div>
                    <div className="toast-message">{message}</div>
                </div>
                <button className="toast-close" onClick={onClose}>
                    ✕
                </button>
            </div>
            <div className={`toast-progress toast-progress-${type}`} />
        </div>
    );
};

export default ToastProvider;