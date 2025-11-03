import { useState, useEffect } from 'react';
import { UserCircle } from "lucide-react";
import logo from "../../assets/images/logo_blanco.svg";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Cerrar menú al cambiar tamaño de pantalla a desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="header-wrapper">
      <header className="header">
        <div className="header-container">

          <div className="header-logo">
            <div className="header-logo-circle">
              <span className="header-logo-icon">
                <picture>
                  <img src={logo} alt="Logo Dengo" className="header-logo-img" />
                </picture>
              </span>
            </div>
            <div className="header-logo-text">
              <span className="header-logo-title">DENGO</span>
              <span className="header-logo-subtitle">CAFETERÍA</span>
            </div>
          </div>

          <button
            className={`header-menu-toggle ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Menú de navegación"
            aria-expanded={isMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className={`header-nav ${isMenuOpen ? 'active' : ''}`}>
            <a
              href="/inicio"
              className="header-nav-link"
              onClick={(e) => {
                e.preventDefault();
                closeMenu();
                window.location.href = '/';
              }}
            >
              <span className="header-nav-text">Inicio</span>
            </a>
            <a
              href="/galeria"
              className="header-nav-link"
              onClick={(e) => {
                e.preventDefault();
                closeMenu();
                window.location.href = '/galeria';
              }}
            >
              <span className="header-nav-text">Galería</span>
            </a>
            <a
              href="/menu"
              className="header-nav-link"
              onClick={(e) => {
                e.preventDefault();
                closeMenu();
                window.location.href = '/menu';
              }}
            >
              <span className="header-nav-text">Menú</span>
            </a>
            <a
              href="/nosotros"
              className="header-nav-link"
              onClick={(e) => {
                e.preventDefault();
                closeMenu();
                window.location.href = '/nosotros';
              }}
            >
              <span className="header-nav-text">Nosotros</span>
            </a>
            <a
              href="/contacto"
              className="header-nav-link"
              onClick={(e) => {
                e.preventDefault();
                closeMenu();
                window.location.href = '/contacto';
              }}
            >
              <span className="header-nav-text">Contacto</span>
            </a>
            <button
              aria-label="Perfil de usuario"
              className="header-user-btn header-user-btn-mobile"
              onClick={() => {
                closeMenu();
                window.location.href = '/login';
              }}
            >
              <UserCircle className="header-user-icon" />
              <span className="header-nav-text">Inicio de sesión</span>
            </button>
          </nav>

          <button
            aria-label="Perfil de usuario"
            className="header-user-btn header-user-btn-desktop"
            onClick={() => {
              window.location.href = '/login';
            }}
          >
            <UserCircle className="header-user-icon" />
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div
          className="header-overlay"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

    </div>
  );
}