import React, { useState, useEffect } from 'react';

const ToastNotification = () => {
  const [toast, setToast] = useState(null);

  const showToast = (type, title, message) => {
    setToast({ type, title, message, id: Date.now() });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#10b981" fillOpacity="0.2"/>
            <path d="M9 12l2 2 4-4" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'error':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#ef4444" fillOpacity="0.2"/>
            <path d="M15 9l-6 6M9 9l6 6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'warning':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#f59e0b" fillOpacity="0.2"/>
            <path d="M12 8v4M12 16h.01" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.exampleButtons}>
        <h2 style={styles.title}>Sistema de Notificaciones Profesional</h2>
        <p style={styles.subtitle}>Haz clic en los botones para ver las diferentes notificaciones</p>
        
        <div style={styles.buttonGrid}>
          <button
            onClick={() => showToast('success', 'Evento Creado', 'El evento se ha registrado exitosamente en el sistema')}
            style={{...styles.button, ...styles.successButton}}
          >
            ✓ Crear Evento
          </button>
          
          <button
            onClick={() => showToast('success', 'Evento Actualizado', 'Los cambios se han guardado correctamente')}
            style={{...styles.button, ...styles.successButton}}
          >
            ✓ Actualizar Evento
          </button>
          
          <button
            onClick={() => showToast('success', 'Evento Eliminado', 'El evento ha sido eliminado permanentemente')}
            style={{...styles.button, ...styles.warningButton}}
          >
            🗑 Eliminar Evento
          </button>
          
          <button
            onClick={() => showToast('error', 'Error al Guardar', 'No se pudo completar la operación. Por favor, intenta nuevamente')}
            style={{...styles.button, ...styles.errorButton}}
          >
            ✕ Simular Error
          </button>

          <button
            onClick={() => showToast('error', 'Campos Requeridos', 'Por favor completa todos los campos obligatorios antes de continuar')}
            style={{...styles.button, ...styles.errorButton}}
          >
            ✕ Error de Validación
          </button>

          <button
            onClick={() => showToast('success', 'Estado Cambiado', 'El estado del evento se ha actualizado correctamente')}
            style={{...styles.button, ...styles.successButton}}
          >
            ✓ Cambiar Estado
          </button>
        </div>

        <div style={styles.codeSection}>
          <h3 style={styles.codeTitle}>📝 Código de Implementación</h3>
          <div style={styles.codeBlock}>
            <pre style={styles.code}>{`// En tu componente Eventos.jsx, importa:
import { ToastContainer, showToast } from './ToastNotification';

// Luego reemplaza los alerts:

// ✅ ANTES:
alert('Evento creado correctamente');

// ✅ DESPUÉS:
showToast('success', 'Evento Creado', 
  'El evento se ha registrado exitosamente');

// Para errores:
showToast('error', 'Error al Guardar', 
  'No se pudo completar la operación');

// Para advertencias:
showToast('warning', 'Atención', 
  'Verifica los datos antes de continuar');`}</pre>
          </div>
        </div>
      </div>

      {toast && (
        <div
          style={{
            ...styles.toast,
            ...styles[`${toast.type}Toast`]
          }}
        >
          <div style={styles.toastContent}>
            <div style={styles.iconContainer}>
              {getIcon(toast.type)}
            </div>
            <div style={styles.textContainer}>
              <div style={styles.toastTitle}>{toast.title}</div>
              <div style={styles.toastMessage}>{toast.message}</div>
            </div>
            <button
              onClick={() => setToast(null)}
              style={styles.closeButton}
            >
              ✕
            </button>
          </div>
          <div style={{
            ...styles.progressBar,
            ...styles[`${toast.type}Progress`]
          }} />
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  exampleButtons: {
    maxWidth: '900px',
    margin: '0 auto',
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '8px',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '16px',
    color: '#718096',
    textAlign: 'center',
    marginBottom: '40px',
  },
  buttonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '40px',
  },
  button: {
    padding: '16px 24px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  successButton: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
  },
  errorButton: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
  },
  warningButton: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: 'white',
  },
  codeSection: {
    marginTop: '40px',
    borderTop: '2px solid #e5e7eb',
    paddingTop: '32px',
  },
  codeTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: '16px',
  },
  codeBlock: {
    background: '#1a202c',
    borderRadius: '12px',
    padding: '24px',
    overflow: 'auto',
  },
  code: {
    color: '#e5e7eb',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: 0,
    fontFamily: 'Monaco, Consolas, monospace',
  },
  toast: {
    position: 'fixed',
    top: '24px',
    right: '24px',
    minWidth: '380px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
    overflow: 'hidden',
    animation: 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    zIndex: 9999,
  },
  successToast: {
    borderLeft: '5px solid #10b981',
  },
  errorToast: {
    borderLeft: '5px solid #ef4444',
  },
  warningToast: {
    borderLeft: '5px solid #f59e0b',
  },
  toastContent: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '20px',
    gap: '14px',
  },
  iconContainer: {
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
  },
  toastTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '4px',
  },
  toastMessage: {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.5',
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    color: '#9ca3af',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '0',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  },
  progressBar: {
    height: '4px',
    animation: 'progress 4s linear',
  },
  successProgress: {
    background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
  },
  errorProgress: {
    background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
  },
  warningProgress: {
    background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
  },
};

// Agregar animaciones con un style tag
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(100px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }

  @keyframes progress {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }

  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.15) !important;
  }

  button:active {
    transform: translateY(0);
  }
`;
document.head.appendChild(styleSheet);

export default ToastNotification;