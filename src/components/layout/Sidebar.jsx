import { useState } from 'react';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import logo from "../../assets/images/logo_sidebar.png";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <button
                className="sidebar-toggle-floating"
                onClick={toggleSidebar}
                aria-label={isOpen ? 'Contraer menú' : 'Expandir menú'}
                title={isOpen ? 'Contraer menú' : 'Expandir menú'}
            >
                {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
            </button>

            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={toggleSidebar}
                />
            )}

            <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                        <picture>
                            <img src={logo} alt="Logo Dengo" className="header-logo-img" />
                        </picture>
                    
                    <div className="sidebar-brand">
                        <h1 className="sidebar-brand-title">DENGO</h1>
                        <p className="sidebar-brand-subtitle">CAFETERÍA</p>
                    </div>
                    <button className="sidebar-admin-badge">
                        ADMINISTRADOR
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <div className="sidebar-section">
                        <h3 className="sidebar-section-title">GENERAL</h3>
                        <ul className="sidebar-menu">
                            <li><a href="#dashboard" className="sidebar-link active">Dashboard</a></li>
                            <li><a href="#reportes" className="sidebar-link">Reportes</a></li>
                        </ul>
                    </div>

                    <div className="sidebar-section">
                        <h3 className="sidebar-section-title">OPERACIONES</h3>
                        <ul className="sidebar-menu">
                            <li><a href="#pedidos" className="sidebar-link">Pedidos</a></li>
                            <li><a href="#reservaciones" className="sidebar-link">Reservaciones</a></li>
                            <li><a href="#corte-caja" className="sidebar-link">Corte de caja</a></li>
                            <li><a href="#cobranza" className="sidebar-link">Cobranza</a></li>
                        </ul>
                    </div>

                    <div className="sidebar-section">
                        <h3 className="sidebar-section-title">CATÁLOGOS</h3>
                        <ul className="sidebar-menu">
                            <li><a href="#productos" className="sidebar-link">Productos</a></li>
                            <li><a href="#ingredientes" className="sidebar-link">Ingredientes</a></li>
                            <li><a href="#categorias" className="sidebar-link">Categorías</a></li>
                            <li><a href="#productos-comunidad" className="sidebar-link">Productos de la comunidad</a></li>
                        </ul>
                    </div>

                    <div className="sidebar-section">
                        <h3 className="sidebar-section-title">CATÁLOGOS</h3>
                        <ul className="sidebar-menu">
                            <li><a href="#promociones" className="sidebar-link">Promociones</a></li>
                            <li><a href="#eventos" className="sidebar-link">Eventos</a></li>
                            <li><a href="#cartelera" className="sidebar-link">Cartelera</a></li>
                            <li><a href="#notificaciones" className="sidebar-link">Notificaciones</a></li>
                        </ul>
                    </div>

                    <div className="sidebar-section">
                        <h3 className="sidebar-section-title">CLIENTES</h3>
                        <ul className="sidebar-menu">
                            <li><a href="#usuarios" className="sidebar-link">Usuarios</a></li>
                            <li><a href="#resenas" className="sidebar-link">Reseñas</a></li>
                            <li><a href="#segmentacion" className="sidebar-link">Segmentación</a></li>
                        </ul>
                    </div>

                    <div className="sidebar-section">
                        <h3 className="sidebar-section-title">CONFIGURACIÓN</h3>
                        <ul className="sidebar-menu">
                            <li><a href="#sucursales" className="sidebar-link">Sucursales</a></li>
                            <li><a href="#usuarios-roles" className="sidebar-link">Usuarios y Roles</a></li>
                            <li><a href="#configuracion" className="sidebar-link">Configuración</a></li>
                        </ul>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="sidebar-user-avatar">AR</div>
                        <div className="sidebar-user-info">
                            <p className="sidebar-user-name">Armando Rodríguez</p>
                            <p className="sidebar-user-role">Administrador</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}