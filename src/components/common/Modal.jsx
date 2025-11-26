import React, { useState, useEffect } from 'react';
import './Modal.css';

const Modal = ({ 
  children, 
  isOpen: externalIsOpen, 
  onClose, 
  title,
  size = 'medium',
  showCloseIcon = true,
  closeOnBackdropClick = true,
  className = ''
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Determinar si se usa el estado externo o interno
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalIsOpen !== undefined ? onClose : setInternalIsOpen;

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    if (externalIsOpen !== undefined && onClose) {
      onClose(false);
    } else {
      setInternalIsOpen(false);
    }
  };

  const handleBackdropClick = (event) => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className={`modal-content modal-${size} ${className}`}>
        {/* Header del modal */}
        {(title || showCloseIcon) && (
          <div className="modal-header">
            {title && <h2 className="modal-title">{title}</h2>}
            {showCloseIcon && (
              <button 
                className="modal-close-btn"
                onClick={handleClose}
                aria-label="Cerrar modal"
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M18 6L6 18M6 6L18 18" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Contenido dinámico del modal */}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
