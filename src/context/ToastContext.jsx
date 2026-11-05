import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random().toString();
    const newToast = { id, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => {
          let Icon = CheckCircle2;
          let iconClass = 'toast-icon-success';

          if (toast.type === 'error') {
            Icon = XCircle;
            iconClass = 'toast-icon-error';
          } else if (toast.type === 'warning') {
            Icon = AlertCircle;
            iconClass = 'toast-icon-warning';
          } else if (toast.type === 'info') {
            Icon = Info;
            iconClass = 'toast-icon-info';
          }

          return (
            <div key={toast.id} className={`toast toast-${toast.type} slide-in`}>
              <Icon className={`toast-icon ${iconClass}`} size={20} />
              <div className="toast-content">{toast.message}</div>
              <button
                className="toast-close-btn"
                onClick={() => removeToast(toast.id)}
                aria-label="Close notification"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
