import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    ChevronLeft,
    ChevronRight,
    Home,
    ShoppingCart,
    DollarSign,
    CreditCard,
    Package,
    Layers,
    Grid,
    Users,
    Tag,
    Megaphone,
    Settings,
    LogOut,
} from "lucide-react";
import logo from "../../assets/images/icono_dengo.svg";
import { useSidebar } from "../../context/SidebarContext";
import { useAuth } from "../../services/AuthContext";

// PUNTO DE QUIEBRE MÓVIL (Coincide con tu Header)
const MOBILE_BREAKPOINT = 768;

export default function Sidebar() {
    const { isOpen, toggleSidebar, setIsOpen } = useSidebar(); // Asegúrate de exportar setIsOpen en tu contexto si es posible, si no, toggleSidebar sirve
    const { signOut, role, user, userData } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const navRef = useRef(null);
    const scrollPositionRef = useRef(0);

    // Protección de iniciales
    const initials = user?.email
        ? user.email.split(" ").map((word) => word.charAt(0).toUpperCase()).join("").slice(0, 2)
        : "US";

    // --- LÓGICA DE SECCIÓN ACTIVA ---
    const getActiveSection = () => {
        const path = location.pathname;
        if (path === "/admin") return "inicio";
        if (path.includes("/admin/usuarios")) return "usuarios";
        if (path.includes("/admin/productos")) return "productos";
        if (path.includes("/admin/eventos")) return "eventos";
        if (path.includes("/admin/promociones")) return "promociones";
        if (path.includes("/admin/sucursal")) return "sucursales";
        if (path.includes("/barista/ordenes") || path.includes("/admin/ordenes")) return "pedidos";
        if (path.includes("/caja/cortecaja")) return "corte-caja";
        if (path.includes("/caja/venta")) return "venta";
        if (path.includes("/admin/ingredientes")) return "ingredientes";
        if (path.includes("/admin/productoscomunidad")) return "productos-comunidad";
        if (path.includes("/admin/configuracion")) return "configuracion";
        return "inicio";
    };

    const [activeSection, setActiveSection] = useState(getActiveSection());

    // --- EFECTOS (RESPONSIVIDAD Y SCROLL) ---

    // 1. Preservar scroll del menú
    useEffect(() => {
        const handleScroll = () => {
            if (navRef.current) scrollPositionRef.current = navRef.current.scrollTop;
        };
        const navElement = navRef.current;
        if (navElement) {
            navElement.addEventListener("scroll", handleScroll);
            return () => navElement.removeEventListener("scroll", handleScroll);
        }
    }, []);

    // 2. Sincronizar sección activa
    useEffect(() => {
        setActiveSection(getActiveSection());
        requestAnimationFrame(() => {
            if (navRef.current) navRef.current.scrollTop = scrollPositionRef.current;
        });
    }, [location.pathname]);

    // 3. Bloqueo de Scroll del Body (Igual que en tu Header)
    useEffect(() => {
        if (window.innerWidth <= MOBILE_BREAKPOINT && isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    // 4. Cerrar Sidebar automáticamente si se agranda la pantalla (Desktop)
    // Esto evita bugs visuales si rotas la tablet o agrandas la ventana
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > MOBILE_BREAKPOINT && isOpen) {
                // Opcional: Si quieres que en desktop empiece cerrado o abierto, ajusta aquí.
                // Por defecto dejamos que el contexto decida, pero limpiamos el estilo del body.
                document.body.style.overflow = "unset";
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isOpen]);


    // --- CONFIGURACIÓN DEL MENÚ ---
    const allMenuSections = [
        {
            title: "GENERAL",
            items: [{ id: "inicio", label: "Inicio", icon: Home, path: "/admin", roles: [1, 2, 3, 4] }],
        },
        {
            title: "OPERACIONES",
            items: [
                { id: "pedidos", label: "Pedidos", icon: ShoppingCart, path: "/barista/ordenes", roles: [2, 3, 4] },
                { id: "corte-caja", label: "Corte de caja", icon: DollarSign, path: "/caja/CorteCaja", roles: [1, 2, 4] },
                { id: "venta", label: "Venta", icon: CreditCard, path: "/caja/Venta", roles: [1, 2, 4] },
                { id: "sucursales", label: "Sucursales", icon: Grid, path: "/admin/Sucursal", roles: [1, 2] },
            ],
        },
        {
            title: "PRODUCTOS",
            items: [
                { id: "productos", label: "Productos", icon: Package, path: "/admin/productos", roles: [1, 2, 3] },
                { id: "ingredientes", label: "Ingredientes", icon: Layers, path: "/admin/ingredientes", roles: [1, 2, 3] },
                { id: "productos-comunidad", label: "Productos comunidad", icon: Users, path: "/admin/ProductosComunidad", roles: [1, 2, 3, 4] },
            ],
        },
        {
            title: "MARKETING",
            items: [
                { id: "promociones", label: "Promociones", icon: Tag, path: "/admin/promociones", roles: [1, 2, 3, 4] },
                { id: "eventos", label: "Eventos", icon: Megaphone, path: "/admin/eventos", roles: [1, 2, 3, 4] },
            ],
        },
        {
            title: "CLIENTES",
            items: [{ id: "usuarios", label: "Usuarios", icon: Users, path: "/admin/usuarios", roles: [1, 2] }],
        },
        {
            title: "CONFIGURACIÓN",
            items: [{ id: "configuracion", label: "Configuración", icon: Settings, path: "/admin/configuracion", roles: [1, 2, 3, 4] }],
        },
    ];

    const menuSections = useMemo(() => {
        if (!role) return [];
        return allMenuSections
            .map((section) => ({
                ...section,
                items: section.items.filter((item) => item.roles.includes(role)),
            }))
            .filter((section) => section.items.length > 0);
    }, [role]);

    const handleNavigation = (path, itemId) => {
        if (navRef.current) scrollPositionRef.current = navRef.current.scrollTop;
        setActiveSection(itemId);
        navigate(path);
        
        // Cierra el sidebar automáticamente en móvil
        if (window.innerWidth <= MOBILE_BREAKPOINT && isOpen) {
            toggleSidebar();
        }
    };

    const handleLogout = async () => {
        try {
            await signOut();
            navigate("/login");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <>
            {/* BOTÓN FLOTANTE (Visible en Desktop y Móvil según CSS) */}
            <button
                type="button"
                className={`sidebar-toggle-btn ${isOpen ? "open" : "closed"}`}
                onClick={toggleSidebar}
                aria-label={isOpen ? "Contraer menú" : "Expandir menú"}
            >
                {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>

            {/* OVERLAY (Fondo oscuro en móvil) */}
            <div 
                className={`sidebar-overlay ${isOpen ? "visible" : ""}`} 
                onClick={toggleSidebar} 
            />

            <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo-wrapper">
                        <div className="sidebar-logo-icon">
                            <img src={logo} alt="Logo Dengo" />
                        </div>
                        <div className={`sidebar-brand ${!isOpen ? "hidden" : ""}`}>
                            <h1 className="sidebar-brand-title">DENGO</h1>
                            <p className="sidebar-brand-subtitle">CAFETERÍA & HOSTELERÍA</p>
                        </div>
                    </div>
                    
                    <div className={`sidebar-admin-badge ${!isOpen ? "hidden" : ""}`}>
                        {role === 1 ? "ADMIN" : role === 2 ? "GERENTE" : role === 3 ? "BARISTA" : role === 4 ? "CAJA" : "USUARIO"}
                    </div>
                </div>

                <nav className="sidebar-nav" ref={navRef}>
                    {menuSections.map((section, index) => (
                        <div key={index} className="sidebar-section">
                            <h3 className={`sidebar-section-title ${!isOpen ? "hidden" : ""}`}>
                                {section.title}
                            </h3>
                            <ul className="sidebar-menu">
                                {section.items.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <li key={item.id} className="sidebar-menu-item">
                                            <button
                                                className={`sidebar-link ${activeSection === item.id ? "active" : ""}`}
                                                onClick={() => handleNavigation(item.path, item.id)}
                                                title={!isOpen ? item.label : ""}
                                            >
                                                <Icon className="sidebar-link-icon" size={20} />
                                                <span className={`sidebar-link-text ${!isOpen ? "hidden" : ""}`}>
                                                    {item.label}
                                                </span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="sidebar-user-avatar">{initials}</div>
                        <div className={`sidebar-user-info ${!isOpen ? "hidden" : ""}`}>
                            <p className="sidebar-user-name">{userData?.nombre || "Usuario"} {userData?.apellidos || ""}</p>
                            <p className="sidebar-user-role">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        className="sidebar-logout-btn"
                        onClick={handleLogout}
                        title={!isOpen ? "Cerrar sesión" : ""}
                    >
                        <LogOut size={20} />
                        <span className={!isOpen ? "hidden" : ""}>Cerrar sesión</span>
                    </button>
                </div>
            </aside>
        </>
    );
}