// ConfirmModal.jsx
import React, { useState, createContext, useContext, useRef } from 'react';
import './ConfirmModal.css';

// ========== CONSTANTES ==========
const CONFIRM_TYPES = {
  DANGER: 'danger',
  WARNING: 'warning',
  INFO: 'info'
};

const ESTADO_INICIAL = {
  isOpen: false,
  title: '',
  message: '',
  onConfirm: null,
  onCancel: null,
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  type: CONFIRM_TYPES.DANGER
};

const ANIMATION_DELAY = 300;

// ========== CONTEXT ==========
const ConfirmContext = createContext();

// ========== ICONOS ==========
const ConfirmIcons = {
  [CONFIRM_TYPES.DANGER]: () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="22" fill="#fee2e2" />
      <path 
        d="M24 16v12M24 32h.01" 
        stroke="#dc2626" 
        strokeWidth="3" 
        strokeLinecap="round" 
      />
    </svg>
  ),
  [CONFIRM_TYPES.WARNING]: () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="22" fill="#fef3c7" />
      <path 
        d="M24 16v12M24 32h.01" 
        stroke="#f59e0b" 
        strokeWidth="3" 
        strokeLinecap="round" 
      />
    </svg>
  ),
  [CONFIRM_TYPES.INFO]: () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="22" fill="#dbeafe" />
      <path 
        d="M24 16h.01M24 22v10" 
        stroke="#3b82f6" 
        strokeWidth="3" 
        strokeLinecap="round" 
      />
    </svg>
  )
};

// ========== PROVIDER ==========
export const ConfirmProvider = ({ children }) => {
  const [confirmState, setConfirmState] = useState(ESTADO_INICIAL);
  const confirmIdCounter = useRef(0);

  const showConfirm = ({
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    type = CONFIRM_TYPES.DANGER
  }) => {
    return new Promise((resolve) => {
      const confirmId = `${Date.now()}-${confirmIdCounter.current++}`;
      
      setConfirmState({
        isOpen: true,
        id: confirmId,
        title,
        message,
        confirmText,
        cancelText,
        type,
        onConfirm: () => {
          resolve(true);
          if (onConfirm) onConfirm();
          closeConfirm();
        },
        onCancel: () => {
          resolve(false);
          if (onCancel) onCancel();
          closeConfirm();
        }
      });
    });
  };

  const closeConfirm = () => {
    setConfirmState(prev => ({ ...prev, isOpen: false }));
    
    setTimeout(() => {
      setConfirmState(ESTADO_INICIAL);
    }, ANIMATION_DELAY);
  };

  return (
    <ConfirmContext.Provider value={{ showConfirm }}>
      {children}
      {confirmState.isOpen && <ConfirmModal {...confirmState} />}
    </ConfirmContext.Provider>
  );
};

// ========== HOOK ==========
export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  
  if (!context) {
    throw new Error('useConfirm debe ser usado dentro de ConfirmProvider');
  }
  
  return context;
};

// ========== COMPONENTE MODAL ==========
const ConfirmModal = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  type
}) => {
  const IconComponent = ConfirmIcons[type] || ConfirmIcons[CONFIRM_TYPES.DANGER];

  return (
    <>
      <div className="confirm-overlay" onClick={onCancel} />
      <div className="confirm-modal">
        <div className="confirm-icon">
          <IconComponent />
        </div>
        
        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-message">{message}</p>
        
        <div className="confirm-actions">
          <button
            className="confirm-btn confirm-btn-cancel"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className={`confirm-btn confirm-btn-confirm confirm-btn-${type}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </>
  );
};

export default ConfirmProvider;