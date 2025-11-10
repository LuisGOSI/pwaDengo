import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronRight,
    Home,
    FileText,
    ShoppingCart,
    Calendar,
    DollarSign,
    CreditCard,
    Package,
    Layers,
    Grid,
    Users,
    Tag,
    Megaphone,
    Bell,
    Star,
    PieChart,
    Settings,
    UserCog,
    LogOut
} from 'lucide-react';
import logo from "../../assets/images/icono_dengo.svg";
import { useSidebar } from '../../context/SidebarContext';
import { useAuth } from '../../services/AuthContext';

export default function Sidebar() {
    const { isOpen, toggleSidebar } = useSidebar();
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Determinar la sección activa basada en la ruta actual
    const getActiveSection = () => {
        const path = location.pathname;
        if (path === '/admin') return 'inicio';
        if (path.includes('/admin/usuarios')) return 'usuarios';
        if (path.includes('/admin/productos')) return 'productos';
        if (path.includes('/admin/eventos')) return 'eventos';
        if (path.includes('/admin/CatalogoCategorias')) return 'categorias';
        if (path.includes('/admin/promociones')) return 'promociones';
        if (path.includes('/admin/SegmentacionPromociones')) return 'segmentacion';
        if (path.includes('/admin/CobranzaDigital')) return 'cobranza';
        if (path.includes('/admin/CorteCaja')) return 'corte-caja';
        if (path.includes('/admin/ReporteVenta')) return 'reportes';
        if (path.includes('/admin/Sucursal')) return 'sucursales';
        if (path.includes('/admin/resenias')) return 'resenas';
        if (path.includes('/admin/ordenes')) return 'pedidos';
        return 'inicio';
    };

    const [activeSection, setActiveSection] = useState(getActiveSection());

    const menuSections = [
        {
            title: 'GENERAL',
            items: [
                { id: 'inicio', label: 'Inicio', icon: Home, path: '/admin' },
                { id: 'reportes', label: 'Reportes', icon: FileText, path: '/admin/ReporteVenta' }
            ]
        },
        {
            title: 'OPERACIONES',
            items: [
                { id: 'pedidos', label: 'Pedidos', icon: ShoppingCart, path: '/admin/ordenes' },
                { id: 'corte-caja', label: 'Corte de caja', icon: DollarSign, path: '/admin/CorteCaja' },
                { id: 'cobranza', label: 'Cobranza', icon: CreditCard, path: '/admin/CobranzaDigital' }
            ]
        },
        {
            title: 'PRODUCTOS',
            items: [
                { id: 'productos', label: 'Productos', icon: Package, path: '/admin/productos' },
                { id: 'ingredientes', label: 'Ingredientes', icon: Layers, path: '/admin/ingredientes' }, // Asegúrate de crear esta ruta
                { id: 'categorias', label: 'Categorías', icon: Grid, path: '/admin/CatalogoCategorias' },
                { id: 'productos-comunidad', label: 'Productos comunidad', icon: Users, path: '/admin/productos-comunidad' } // Asegúrate de crear esta ruta
            ]
        },
        {
            title: 'MARKETING',
            items: [
                { id: 'promociones', label: 'Promociones', icon: Tag, path: '/admin/promociones' },
                { id: 'eventos', label: 'Eventos', icon: Megaphone, path: '/admin/eventos' },
                { id: 'cartelera', label: 'Cartelera', icon: Calendar, path: '/CarteleraEventos' },
                { id: 'notificaciones', label: 'Notificaciones', icon: Bell, path: '/admin/notificaciones' } // Asegúrate de crear esta ruta
            ]
        },
        {
            title: 'CLIENTES',
            items: [
                { id: 'usuarios', label: 'Usuarios', icon: Users, path: '/admin/usuarios' },
                { id: 'resenas', label: 'Reseñas', icon: Star, path: '/admin/resenias' },
                { id: 'segmentacion', label: 'Segmentación', icon: PieChart, path: '/admin/SegmentacionPromociones' }
            ]
        },
        {
            title: 'CONFIGURACIÓN',
            items: [
                { id: 'sucursales', label: 'Sucursales', icon: Grid, path: '/admin/Sucursal' },
                { id: 'usuarios-roles', label: 'Usuarios y Roles', icon: UserCog, path: '/admin/usuarios-roles' }, // Asegúrate de crear esta ruta
                { id: 'configuracion', label: 'Configuración', icon: Settings, path: '/admin/configuracion' } // Asegúrate de crear esta ruta
            ]
        }
    ];

    const handleNavigation = (path, itemId) => {
        setActiveSection(itemId);
        navigate(path);
        // Cerrar sidebar en móvil después de navegar
        if (window.innerWidth <= 768) {
            toggleSidebar();
        }
    };

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <>
            <button
                className={`sidebar-toggle-btn ${isOpen ? 'open' : 'closed'}`}
                onClick={toggleSidebar}
                aria-label={isOpen ? 'Contraer menú' : 'Expandir menú'}
            >
                {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>

            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={toggleSidebar}
                />
            )}

            <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
                {/* Header del Sidebar */}
                <div className="sidebar-header">
                    <div className="sidebar-logo-wrapper">
                        <div className="sidebar-logo-icon">
                            <img src={logo} alt="Logo Dengo" />
                        </div>
                        {isOpen && (
                            <div className="sidebar-brand">
                                <h1 className="sidebar-brand-title">DENGO</h1>
                                <p className="sidebar-brand-subtitle">CAFETERÍA & HOSTELERÍA</p>
                            </div>
                        )}
                    </div>
                    {isOpen && (
                        <div className="sidebar-admin-badge">
                            ADMIN
                        </div>
                    )}
                </div>

                {/* Navegación */}
                <nav className="sidebar-nav">
                    {menuSections.map((section, index) => (
                        <div key={index} className="sidebar-section">
                            {isOpen && (
                                <h3 className="sidebar-section-title">{section.title}</h3>
                            )}
                            <ul className="sidebar-menu">
                                {section.items.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <li key={item.id}>
                                            <button
                                                className={`sidebar-link ${activeSection === item.id ? 'active' : ''}`}
                                                onClick={() => handleNavigation(item.path, item.id)}
                                                title={!isOpen ? item.label : ''}
                                            >
                                                <Icon className="sidebar-link-icon" size={20} />
                                                {isOpen && <span className="sidebar-link-text">{item.label}</span>}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>

                {/* Footer */}
                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="sidebar-user-avatar">AR</div>
                        {isOpen && (
                            <div className="sidebar-user-info">
                                <p className="sidebar-user-name">Armando Rodríguez</p>
                                <p className="sidebar-user-role">Administrador</p>
                            </div>
                        )}
                    </div>
                    <button
                        className="sidebar-logout-btn"
                        onClick={handleLogout}
                        title={!isOpen ? 'Cerrar sesión' : ''}
                    >
                        <LogOut size={20} />
                        {isOpen && <span>Cerrar sesión</span>}
                    </button>
                </div>
            </aside>
        </>
    );
}