import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, MapPin, Calendar, Tag, Info } from 'lucide-react';
import './CarteleraEventos.css';
import Header from '../../components/layout/Header';
import { useNavigate } from 'react-router-dom';

const EVENTOS_API_URL = 'https://dengo-back.onrender.com/api/eventos';
const SUCURSALES_API_URL = 'https://dengo-back.onrender.com/api/sucursales';

export const CarteleraEventos = () => {
    const navigate = useNavigate();
    // --------------------------
    // TEMAS PARA CARRUSEL
    // --------------------------
    const coffeeThemes = [
        { name: 'Espresso Intenso', gradient: 'linear-gradient(135deg, #1a0f0c 0%, #3c2a21 100%)', accent: '#d4a373' },
        { name: 'Moca Suave', gradient: 'linear-gradient(135deg, #3e2723 0%, #5d4037 100%)', accent: '#e6c9a8' },
        { name: 'Ambiente Nocturno', gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#38bdf8' }, // Para eventos de noche
        { name: 'Caramelo & Crema', gradient: 'linear-gradient(135deg, #432818 0%, #6f4e37 100%)', accent: '#faedcd' },
    ];

    // --------------------------
    // ESTADOS
    // --------------------------
    const [categoriaActiva] = useState('todos');
    const [bannerActivo, setBannerActivo] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const [sucursales, setSucursales] = useState([]);
    const [sucursalSeleccionada, setSucursalSeleccionada] = useState(null);

    const [eventos, setEventos] = useState([]);
    const [eventosFiltrados, setEventosFiltrados] = useState([]);

    const [loading, setLoading] = useState(true);
    const [tabActiva, setTabActiva] = useState("cartelera");

    const [modalAbierto, setModalAbierto] = useState(false);
    const [eventoSeleccionado, setEventoSeleccionado] = useState(null);


    // --------------------------
    // PETICIÓN SUCURSALES
    // --------------------------
    useEffect(() => {
        const cargarSucursales = async () => {
            try {
                const response = await fetch(SUCURSALES_API_URL);
                const data = await response.json();
                const lista = Array.isArray(data.data) ? data.data : [];

                const listaActivas = lista.filter(s =>
                    s.activa === true || s.activa === 'true' || Number(s.activa) === 1
                );

                setSucursales(listaActivas);
                setSucursalSeleccionada(listaActivas[0] || null);
            } catch (error) {
                console.error("Error al cargar sucursales:", error);
                setSucursales([]);
            }
        };

        cargarSucursales();
    }, []);

    // --------------------------
    // PETICIÓN EVENTOS
    // --------------------------
    useEffect(() => {
        const cargarEventos = async () => {
            setLoading(true);
            try {
                const response = await fetch(EVENTOS_API_URL);
                const data = await response.json();

                const eventosArray = Array.isArray(data.data) ? data.data : [];

                setEventos(eventosArray);
                setEventosFiltrados(eventosArray);
            } catch (error) {
                console.error("Error al cargar eventos:", error);
            } finally {
                setLoading(false);
            }
        };

        cargarEventos();
    }, []);

    // --------------------------
    // FILTROS (Categoría, Sucursal, Día, Validez)
    // --------------------------
    useEffect(() => {
        // Filtramos primero por Activo y Fecha actual
        let filtrados = eventos.filter(evento => {
            const fechaFin = new Date(evento.termina_en);
            const hoy = new Date();
            // El evento debe estar activo Y su fecha de fin debe ser mayor a hoy
            return evento.activo === true && fechaFin > hoy;
        });

        // Filtro de Categoría
        if (categoriaActiva !== "todos") {
            filtrados = filtrados.filter(e => e.categoria === categoriaActiva);
        }

        // Filtro de Sucursal
        if (sucursalSeleccionada) {
            filtrados = filtrados.filter(e =>
                e.sucursal_id === sucursalSeleccionada.id
            );
        }
        setEventosFiltrados(filtrados);
    }, [categoriaActiva, sucursalSeleccionada, eventos]);

    // --------------------------
    // CAROUSEL CON ANIMACIONES
    // --------------------------
    const eventosVisibles = eventos.filter(evento => {
        const fechaFin = new Date(evento.termina_en);
        const hoy = new Date();

        return evento.activo === true && fechaFin > hoy;
    });

    const siguienteBanner = useCallback(() => {
        if (!isTransitioning && eventosVisibles.length > 0) {
            setIsTransitioning(true);
            setBannerActivo((prev) => (prev + 1) % eventosVisibles.length);
            setTimeout(() => setIsTransitioning(false), 600);
        }
    }, [isTransitioning, eventosVisibles.length]);

    const anteriorBanner = useCallback(() => {
        if (!isTransitioning && eventosVisibles.length > 0) {
            setIsTransitioning(true);
            setBannerActivo((prev) => (prev - 1 + eventosVisibles.length) % eventosVisibles.length);
            setTimeout(() => setIsTransitioning(false), 600);
        }
    }, [isTransitioning, eventosVisibles.length]);

    // Auto-avance
    useEffect(() => {
        // Si no hay eventos que cumplan la condición, no iniciamos el timer
        if (eventosVisibles.length === 0) return;

        const interval = setInterval(() => {
            siguienteBanner();
        }, 5000);

        return () => clearInterval(interval);
    }, [siguienteBanner, eventosVisibles.length]);

    // PROTECCIÓN DE ÍNDICE
    // Si el banner activo actual se sale del rango (ej. se borró un evento), volvemos al 0
    if (bannerActivo >= eventosVisibles.length && eventosVisibles.length > 0) {
        setBannerActivo(0);
    }

    // ========== UTILIDADES ==========
    const formatearFecha = (fecha) => {
        if (!fecha) return '';
        return new Date(fecha).toLocaleDateString('es-MX', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="cartelera-eventos-container">
            <Header />

            {/* Hero Section */}
            <div className="menu-hero">
                <h1 className="menu-titulo">Cartelera de Eventos</h1>
                <p className="menu-subtitulo">¡Disfruta de los mejores eventos en Dengo!</p>
                <p className="menu-descripcion">
                    Explora nuestra cartelera de eventos para vivir la mejor experiencia con la familia Dengo<br />
                    y descubre de las actividades que tenemos para tí.
                </p>
            </div>

            {/* SELECT DE SUCURSAL */}
            <div className="cartelera-header">
                <div className="sucursal-card">
                    <div className="icon-wrapper">
                        <MapPin size={18} strokeWidth={2} />
                    </div>

                    <div className="selector-content">
                        <span className="label-sucursal">Ubicación actual</span>

                        <div className="select-wrapper">
                            <select
                                className="selector-sucursal"
                                value={sucursalSeleccionada?.id || ""}
                                onChange={(e) => {
                                    const suc = sucursales.find(s => s.id === parseInt(e.target.value));
                                    setSucursalSeleccionada(suc);
                                }}
                            >
                                {sucursales.map(s => (
                                    <option key={s.id} value={s.id}>{s.nombre}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="chevron-icon" />
                        </div>
                    </div>
                </div>
            </div>

            {/* CARRUSEL - Solo se muestra si hay eventos vigentes */}
            {eventosVisibles.length > 0 && (
                <div
                    className="hero-banner"
                    style={{
                        // Usamos el módulo para que los colores se repitan cíclicamente
                        background: coffeeThemes[bannerActivo % coffeeThemes.length].gradient,
                        '--accent-color': coffeeThemes[bannerActivo % coffeeThemes.length].accent
                    }}
                >
                    <div className="noise-overlay"></div>

                    <button className="banner-nav-btn prev" onClick={anteriorBanner}>
                        <ChevronLeft size={32} />
                    </button>

                    <div className="banner-content">
                        {/* Contenedor Imagen */}
                        <div className={`banner-imagen ${isTransitioning ? 'transitioning' : ''}`}>
                            <div className="imagen-wrapper">
                                {/* AQUI: Usamos eventosVisibles */}
                                <img
                                    src={eventosVisibles[bannerActivo].img}
                                    alt={eventosVisibles[bannerActivo].titulo}
                                    className="banner-img"
                                />
                                <div className="shine-effect"></div>
                            </div>
                        </div>

                        {/* Contenedor Info */}
                        <div className={`banner-info ${isTransitioning ? 'transitioning' : ''}`}>
                            <span className="banner-tag">Evento Especial</span>
                            {/* AQUI: Usamos eventosVisibles */}
                            <h1 className="banner-titulo">{eventosVisibles[bannerActivo].titulo}</h1>
                            <div className="separador-elegante"></div>
                            <p className="banner-descripcion">{eventosVisibles[bannerActivo].descripcion}</p>

                            <button
                                className="btn-reservar"
                                onClick={() => navigate('/login')}
                            >
                                <span>Reservar Lugar</span>
                            </button>
                        </div>
                    </div>

                    <button className="banner-nav-btn next" onClick={siguienteBanner}>
                        <ChevronRight size={32} />
                    </button>

                    {/* Indicadores de progreso */}
                    <div className="slide-counter">
                        0{bannerActivo + 1} <span className="line"></span> 0{eventosVisibles.length}
                    </div>
                </div>
            )}

            {/* TABS */}
            <div className="tabs-container">
                <button
                    className={`tab ${tabActiva === "cartelera" ? "active" : ""}`}
                    onClick={() => setTabActiva("cartelera")}
                >
                    Cartelera
                </button>
            </div>

            {/* GRID */}
            <div className="eventos-cartelera-grid">
                {loading ? (
                    <p>Cargando eventos...</p>
                ) : eventosFiltrados.length === 0 ? (
                    <p>No hay eventos disponibles.</p>
                ) : (
                    eventosFiltrados.map((evento) => (
                        <div key={evento.id} className="evento-pelicula-card">
                            <div className="pelicula-poster" style={{ backgroundColor: evento.color }}>
                                <img src={evento.img} alt={evento.titulo} className="poster-img" />
                            </div>
                            <div className="pelicula-info">
                                <div className="info-superior">
                                    <span className="btn-disponibilidad">{formatearFecha(evento.inicia_en)}</span>
                                </div>
                                <h3 className="pelicula-titulo">{evento.titulo}</h3>
                                <button
                                    className="btn-ver-detalle"
                                    onClick={() => {
                                        setEventoSeleccionado(evento);
                                        setModalAbierto(true);
                                    }}
                                >
                                    <span>Ver detalle</span>
                                    <Info size={16} />
                                </button>

                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* MODAL DE DETALLE DE EVENTO */}
            {modalAbierto && eventoSeleccionado && (
                <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Botón Flotante */}
                        <button
                            className="modal-close"
                            onClick={() => setModalAbierto(false)}
                            aria-label="Cerrar modal"
                        >
                            ✕
                        </button>

                        {/* Imagen Hero (Full Width) */}
                        <div className="modal-hero">
                            <img
                                src={eventoSeleccionado.img}
                                alt={eventoSeleccionado.titulo}
                                className="modal-img"
                            />
                        </div>

                        {/* Contenido de Texto */}
                        <div className="modal-body">
                            <h2 className="modal-title">
                                {eventoSeleccionado.titulo}
                            </h2>

                            <p className="modal-desc">
                                {eventoSeleccionado.descripcion}
                            </p>

                            {/* Grid de Información Detallada */}
                            <div className="modal-info-grid">
                                <div className="info-item">
                                    <label>Inicio</label>
                                    <span>{new Date(eventoSeleccionado.inicia_en).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                                </div>
                                <div className="info-item">
                                    <label>Fin</label>
                                    <span>{new Date(eventoSeleccionado.termina_en).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                                </div>
                                <div className="info-item">
                                    <label>Capacidad</label>
                                    <span>{eventoSeleccionado.capacidad} personas</span>
                                </div>
                            </div>

                            {/* Sección de Ubicación */}
                            <div className="modal-sucursal">
                                <h3>Ubicación</h3>
                                <p><strong>{eventoSeleccionado.sucursales.nombre}</strong></p>
                                <p style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    📍 {eventoSeleccionado.sucursales.direccion}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};