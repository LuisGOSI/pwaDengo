import { useEffect, useState, useRef, useMemo } from 'react';
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
    const { signOut, role } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const navRef = useRef(null);
    const scrollPositionRef = useRef(0);

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
        if (path.includes('/admin/ingredientes')) return 'ingredientes';
        if (path.includes('/admin/ProductosComunidad')) return 'productos-comunidad';
        if (path.includes('/admin/cartelera')) return 'cartelera';
        if (path.includes('/admin/configuracion')) return 'configuracion';
        return 'inicio';
    };

    const [activeSection, setActiveSection] = useState(getActiveSection());

    // Guardar la posición del scroll antes de navegar
    useEffect(() => {
        const handleScroll = () => {
            if (navRef.current) {
                scrollPositionRef.current = navRef.current.scrollTop;
            }
        };

        const navElement = navRef.current;
        if (navElement) {
            navElement.addEventListener('scroll', handleScroll);
            return () => navElement.removeEventListener('scroll', handleScroll);
        }
    }, []);

    // Actualizar la sección activa SIN resetear el scroll
    useEffect(() => {
        const newActiveSection = getActiveSection();
        setActiveSection(newActiveSection);

        // Restaurar la posición del scroll después de actualizar
        requestAnimationFrame(() => {
            if (navRef.current) {
                navRef.current.scrollTop = scrollPositionRef.current;
            }
        });
    }, [location.pathname]);

    // Definición de todas las secciones del menú con roles permitidos
    const allMenuSections = [
        {
            title: 'GENERAL',
            items: [
                { id: 'inicio', label: 'Inicio', icon: Home, path: '/admin', roles: [1] },
                { id: 'reportes', label: 'Reportes', icon: FileText, path: '/admin/ReporteVenta', roles: [1, 2] }
            ]
        },
        {
            title: 'OPERACIONES',
            items: [
                { id: 'pedidos', label: 'Pedidos', icon: ShoppingCart, path: '/admin/ordenes', roles: [2, 3, 4] },
                { id: 'corte-caja', label: 'Corte de caja', icon: DollarSign, path: '/admin/CorteCaja', roles: [1, 2, 4] },
                { id: 'cobranza', label: 'Cobranza', icon: CreditCard, path: '/admin/CobranzaDigital', roles: [1, 2, 4] },
                { id: 'sucursales', label: 'Sucursales', icon: Grid, path: '/admin/Sucursal', roles: [1, 2] }
            ]
        },
        {
            title: 'PRODUCTOS',
            items: [
                { id: 'productos', label: 'Productos', icon: Package, path: '/admin/productos', roles: [1, 2, 3] },
                { id: 'ingredientes', label: 'Ingredientes', icon: Layers, path: '/admin/ingredientes', roles: [1, 2, 3] },
                { id: 'categorias', label: 'Categorías', icon: Grid, path: '/admin/CatalogoCategorias', roles: [1, 2, 3, 4] },
                { id: 'productos-comunidad', label: 'Productos comunidad', icon: Users, path: '/admin/ProductosComunidad', roles: [1, 2, 3, 4] }
            ]
        },
        {
            title: 'MARKETING',
            items: [
                { id: 'promociones', label: 'Promociones', icon: Tag, path: '/admin/promociones', roles: [1, 2, 3, 4] },
                { id: 'eventos', label: 'Eventos', icon: Megaphone, path: '/admin/eventos', roles: [1, 2, 3, 4] },
                { id: 'cartelera', label: 'Cartelera', icon: Calendar, path: '/admin/cartelera', roles: [1, 2] }
            ]
        },
        {
            title: 'CLIENTES',
            items: [
                { id: 'usuarios', label: 'Usuarios', icon: Users, path: '/admin/usuarios', roles: [1, 2] },
                { id: 'resenas', label: 'Reseñas', icon: Star, path: '/admin/resenias', roles: [1, 2, 3] },
                { id: 'segmentacion', label: 'Segmentación', icon: PieChart, path: '/admin/SegmentacionPromociones', roles: [1, 2] }
            ]
        },
        {
            title: 'CONFIGURACIÓN',
            items: [
                { id: 'configuracion', label: 'Configuración', icon: Settings, path: '/admin/configuracion', roles: [1, 2, 3, 4] }
            ]
        }
    ];

    // Filtrar el menú según el rol del usuario
    const menuSections = useMemo(() => {
        if (!role) return [];

        return allMenuSections
            .map(section => ({
                ...section,
                items: section.items.filter(item => item.roles.includes(role))
            }))
            .filter(section => section.items.length > 0); // Solo mostrar secciones con items
    }, [role]);

    const handleNavigation = (path, itemId) => {
        // Guardar posición actual antes de navegar
        if (navRef.current) {
            scrollPositionRef.current = navRef.current.scrollTop;
        }

        setActiveSection(itemId);
        navigate(path);
        
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
            <button type='button'
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
                            {role === 1 ? 'ADMIN' : role === 2 ? 'GERENTE' : role === 3 ? 'BARISTA' : role === 4 ? 'CAJA' : 'USUARIO'}
                        </div>
                    )}
                </div>

                {/* Navegación con ref para controlar el scroll */}
                <nav className="sidebar-nav" ref={navRef}>
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
                                <p className="sidebar-user-role">
                                    {role === 1 ? 'Administrador' : role === 2 ? 'Gerente' : role === 3 ? 'Barista' : role === 4 ? 'Cajero' : 'Usuario'}
                                </p>
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