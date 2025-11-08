import React from 'react';

// CSS SEPARADO
const styles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .notfound-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    padding: 20px;
    position: relative;
    overflow: hidden;
  }

  .notfound-container::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.03) 0%, transparent 70%);
    animation: pulse 4s ease-in-out infinite;
  }

  .notfound-content {
    text-align: center;
    max-width: 600px;
    width: 100%;
    position: relative;
    z-index: 1;
    animation: fadeInUp 0.8s ease-out;
  }

  .notfound-error-code {
    font-size: clamp(120px, 20vw, 200px);
    font-weight: 700;
    color: #1f2937;
    margin: 0;
    line-height: 1;
    letter-spacing: -0.02em;
    animation: float 3s ease-in-out infinite;
    background: linear-gradient(135deg, #1f2937 0%, #6b7280 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .notfound-divider {
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, transparent, #3b82f6, transparent);
    margin: 32px auto;
    animation: fadeInUp 0.8s ease-out 0.2s both;
  }

  .notfound-title {
    font-size: clamp(24px, 4vw, 32px);
    font-weight: 600;
    color: #111827;
    margin: 0 0 16px 0;
    letter-spacing: -0.01em;
    animation: fadeInUp 0.8s ease-out 0.3s both;
  }

  .notfound-description {
    font-size: clamp(14px, 2vw, 16px);
    color: #6b7280;
    margin: 0 0 40px 0;
    line-height: 1.6;
    animation: fadeInUp 0.8s ease-out 0.4s both;
  }

  .notfound-button {
    display: inline-block;
    padding: 14px 32px;
    font-size: 16px;
    font-weight: 500;
    color: #ffffff;
    background-color: #3b82f6;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 14px rgba(59, 130, 246, 0.2);
    animation: fadeInUp 0.8s ease-out 0.5s both;
  }

  .notfound-button:hover {
    background-color: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
  }

  .notfound-button:active {
    transform: translateY(0);
  }

  @media (max-width: 640px) {
    .notfound-error-code {
      font-size: 100px;
    }
    
    .notfound-title {
      font-size: 22px;
    }
    
    .notfound-description {
      font-size: 14px;
    }
  }
`;

// HTML / JSX SEPARADO
export const NotFound = () => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <>
      <style>{styles}</style>
      
      <div className="notfound-container">
        <div className="notfound-content">
          <h1 className="notfound-error-code">404</h1>
          <div className="notfound-divider"></div>
          <h2 className="notfound-title">Página no encontrada</h2>
          <p className="notfound-description">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
          <button
            className="notfound-button"
            onClick={handleGoHome}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </>
  );
};