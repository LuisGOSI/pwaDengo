import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, X, Calendar, Clock, Tag, Info } from 'lucide-react';
import './CarteleraEventos.css';
import Header from '../../components/layout/Header';

export const CarteleraEventos = () => {
    const [diaSeleccionado, setDiaSeleccionado] = useState(0);
    const [categoriaActiva, setCategoriaActiva] = useState('todos');
    const [bannerActivo, setBannerActivo] = useState(0);

    // Días de la semana
    const dias = [
        { dia: 'Hoy', fecha: '5 NOV' },
        { dia: 'Mañana', fecha: '6 NOV' },
        { dia: 'Viernes', fecha: '7 NOV' },
        { dia: 'Sábado', fecha: '8 NOV' },
        { dia: 'Domingo', fecha: '9 NOV' },
        { dia: 'Lunes', fecha: '10 NOV' },
        { dia: 'Martes', fecha: '11 NOV' },
        { dia: 'Miércoles', fecha: '12 NOV' },
    ];

    // Banners destacados
    const banners = [
        {
            id: 1,
            titulo: 'Festival del Café Artesanal',
            subtitulo: 'El evento más esperado del año',
            descripcion: 'Únete a la celebración con baristas de renombre mundial, catas exclusivas y premios increíbles',
            imagen: '☕',
            color: '#2C1810',
            gradiente: 'linear-gradient(135deg, #2C1810 0%, #5D3A1A 100%)'
        },
        {
            id: 2,
            titulo: 'Gran Inauguración Sucursal Plaza',
            subtitulo: 'Nueva experiencia te espera',
            descripcion: 'Celebra con nosotros la apertura de nuestra sucursal más grande con promociones especiales',
            imagen: '🎉',
            color: '#1A237E',
            gradiente: 'linear-gradient(135deg, #1A237E 0%, #3949AB 100%)'
        },
        {
            id: 3,
            titulo: 'Noche de Jazz y Café',
            subtitulo: 'Música en vivo todos los viernes',
            descripcion: 'Disfruta de los mejores músicos locales mientras saboreas nuestros cafés premium',
            imagen: '🎵',
            color: '#4A148C',
            gradiente: 'linear-gradient(135deg, #4A148C 0%, #7B1FA2 100%)'
        }
    ];

    // Eventos
    const eventos = [
        {
            id: 1,
            titulo: 'Lanzamiento Café de Otoño',
            descripcion: 'Nueva línea de cafés especiales con sabores únicos de temporada',
            duracion: '89 min',
            clasificacion: 'A',
            categoria: 'lanzamiento',
            imagen: '☕',
            color: '#8B4513',
            disponibilidad: 'En Cartelera',
            sucursales: ['Centro', 'Norte', 'Sur']
        },
        {
            id: 2,
            titulo: 'Promoción 2x1 Bebidas',
            descripcion: 'Disfruta el doble por el mismo precio en todas nuestras bebidas',
            duracion: '114 min',
            clasificacion: 'B15',
            categoria: 'promocion',
            imagen: '🎁',
            color: '#E65100',
            disponibilidad: 'En Cartelera',
            sucursales: ['Todas']
        },
        {
            id: 3,
            titulo: 'Taller de Arte Latte',
            descripcion: 'Aprende a crear arte increíble en tu café con expertos',
            duracion: '106 min',
            clasificacion: 'A',
            categoria: 'evento',
            imagen: '🎨',
            color: '#66BB6A',
            disponibilidad: 'En Cartelera',
            sucursales: ['Centro']
        },
        {
            id: 4,
            titulo: 'Menú Vegano Premium',
            descripcion: 'Nuevas opciones 100% veganas en nuestro menú permanente',
            duracion: '116 min',
            clasificacion: 'B',
            categoria: 'lanzamiento',
            imagen: '🌱',
            color: '#26A69A',
            disponibilidad: 'En Cartelera',
            sucursales: ['Todas']
        },
        {
            id: 5,
            titulo: 'Combo Desayuno Especial',
            descripcion: 'Ahorra 30% en nuestros combos hasta las 11am',
            duracion: '98 min',
            clasificacion: 'B',
            categoria: 'promocion',
            imagen: '🥐',
            color: '#EF5350',
            disponibilidad: 'Estreno',
            sucursales: ['Centro', 'Norte']
        }
    ];

    const eventosFiltrados = categoriaActiva === 'todos' 
        ? eventos 
        : eventos.filter(e => e.categoria === categoriaActiva);

    const siguienteBanner = () => {
        setBannerActivo((prev) => (prev + 1) % banners.length);
    };

    const anteriorBanner = () => {
        setBannerActivo((prev) => (prev - 1 + banners.length) % banners.length);
    };

    const scrollDias = (direccion) => {
        const container = document.querySelector('.dias-scroll');
        const scrollAmount = 200;
        container.scrollLeft += direccion === 'next' ? scrollAmount : -scrollAmount;
    };

    return (
        <div className="cartelera-eventos-container">
            <Header />
            {/* Header con selección de cine/sucursal */}
            <div className="cartelera-header">
                <div className="sucursal-selector">
                    <div className="sucursal-info">
                        <MapPin size={20} />
                        <span className="sucursal-nombre">Centro Comercial Altacia</span>
                        <span className="vip-badge">VIP</span>
                    </div>
                    <button className="btn-cerrar">
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Banner Hero con Carousel */}
            <div className="hero-banner" style={{ background: banners[bannerActivo].gradiente }}>
                <button className="banner-nav-btn prev" onClick={anteriorBanner}>
                    <ChevronLeft size={32} />
                </button>

                <div className="banner-content">
                    <div className="banner-imagen">
                        <div className="imagen-evento">
                            <span className="emoji-evento">{banners[bannerActivo].imagen}</span>
                        </div>
                    </div>
                    <div className="banner-info">
                        <h1 className="banner-titulo">{banners[bannerActivo].titulo}</h1>
                        <p className="banner-subtitulo">{banners[bannerActivo].subtitulo}</p>
                        <p className="banner-descripcion">{banners[bannerActivo].descripcion}</p>
                        <button className="btn-obtener-tickets">Obtener tickets</button>
                    </div>
                </div>

                <button className="banner-nav-btn next" onClick={siguienteBanner}>
                    <ChevronRight size={32} />
                </button>

                <div className="banner-indicators">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            className={`indicator ${index === bannerActivo ? 'active' : ''}`}
                            onClick={() => setBannerActivo(index)}
                        />
                    ))}
                </div>
            </div>

            {/* Tabs Cartelera/Horarios */}
            <div className="tabs-container">
                <button className="tab active">Cartelera</button>
                <button className="tab">Horarios</button>
            </div>

            {/* Selector de días */}
            <div className="dias-selector-container">
                <button className="scroll-btn prev" onClick={() => scrollDias('prev')}>
                    <ChevronLeft size={20} />
                </button>
                
                <div className="dias-scroll">
                    {dias.map((dia, index) => (
                        <button
                            key={index}
                            className={`dia-btn ${diaSeleccionado === index ? 'active' : ''}`}
                            onClick={() => setDiaSeleccionado(index)}
                        >
                            <span className="dia-nombre">{dia.dia}</span>
                            <span className="dia-fecha">{dia.fecha}</span>
                        </button>
                    ))}
                </div>

                <button className="scroll-btn next" onClick={() => scrollDias('next')}>
                    <ChevronRight size={20} />
                </button>

                <div className="acciones-extra">
                    <button className="btn-accion">
                        <Calendar size={20} />
                        <span>Fecha</span>
                    </button>
                    <button className="btn-accion">
                        <Tag size={20} />
                        <span>Filtros</span>
                    </button>
                </div>
            </div>

            {/* Filtros de categoría */}
            <div className="categorias-tabs">
                <button
                    className={`categoria-tab ${categoriaActiva === 'todos' ? 'active' : ''}`}
                    onClick={() => setCategoriaActiva('todos')}
                >
                    Todos
                </button>
                <button
                    className={`categoria-tab ${categoriaActiva === 'promocion' ? 'active' : ''}`}
                    onClick={() => setCategoriaActiva('promocion')}
                >
                    Promociones
                </button>
                <button
                    className={`categoria-tab ${categoriaActiva === 'lanzamiento' ? 'active' : ''}`}
                    onClick={() => setCategoriaActiva('lanzamiento')}
                >
                    Lanzamientos
                </button>
                <button
                    className={`categoria-tab ${categoriaActiva === 'evento' ? 'active' : ''}`}
                    onClick={() => setCategoriaActiva('evento')}
                >
                    Eventos
                </button>
            </div>

            {/* Grid de eventos tipo cartelera de cine */}
            <div className="eventos-cartelera-grid">
                {eventosFiltrados.map((evento) => (
                    <div key={evento.id} className="evento-pelicula-card">
                        <div className="pelicula-poster" style={{ backgroundColor: evento.color }}>
                            <span className="poster-emoji">{evento.imagen}</span>
                            <div className="clasificacion-badge">{evento.clasificacion}</div>
                        </div>
                        <div className="pelicula-info">
                            <div className="info-superior">
                                <span className="duracion">{evento.duracion}</span>
                                <button className="btn-disponibilidad">{evento.disponibilidad}</button>
                            </div>
                            <h3 className="pelicula-titulo">{evento.titulo}</h3>
                            <button className="btn-ver-detalle">
                                <span>Ver detalle</span>
                                <Info size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};