import React, { useState } from 'react';
import './cartelera.css';
import Sidebar from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../context/SidebarContext';
import { Outlet } from 'react-router-dom';

export const Cartelera = () => {
    const { isOpen } = useSidebar();
    const [publicaciones, setPublicaciones] = useState([
        {
            id: 1,
            tipo: 'noticia',
            titulo: 'Nueva Sucursal en Zona Norte',
            descripcion: 'Nos complace anunciar la apertura de nuestra nueva sucursal en la zona norte de la ciudad.',
            fecha: '2025-11-08',
            autor: 'Juan Pérez',
            imagen: '🏪',
            activo: true
        },
        {
            id: 2,
            tipo: 'promocion',
            titulo: '2x1 en Frappuccinos',
            descripcion: 'Todos los viernes de noviembre, lleva 2 frappuccinos al precio de 1. Válido en todas las sucursales.',
            fecha: '2025-11-07',
            autor: 'María González',
            imagen: '🎉',
            activo: true
        },
        {
            id: 3,
            tipo: 'lanzamiento',
            titulo: 'Nuevo Café de Temporada',
            descripcion: 'Prueba nuestro nuevo café de temporada con notas de canela y avellana. Edición limitada.',
            fecha: '2025-11-06',
            autor: 'Carlos Ramírez',
            imagen: '☕',
            activo: true
        },
        {
            id: 4,
            tipo: 'noticia',
            titulo: 'Horarios Especiales Navideños',
            descripcion: 'Consulta nuestros horarios especiales para la temporada navideña en todas las sucursales.',
            fecha: '2025-11-05',
            autor: 'Ana López',
            imagen: '🎄',
            activo: false
        },
        {
            id: 5,
            tipo: 'promocion',
            titulo: 'Club de Lealtad',
            descripcion: 'Únete a nuestro club de lealtad y obtén puntos en cada compra. ¡Canjéalos por bebidas gratis!',
            fecha: '2025-11-04',
            autor: 'Luis Torres',
            imagen: '⭐',
            activo: true
        },
        {
            id: 6,
            tipo: 'lanzamiento',
            titulo: 'Línea de Tés Premium',
            descripcion: 'Descubre nuestra nueva línea de tés premium importados directamente de Asia.',
            fecha: '2025-11-03',
            autor: 'Carmen Ruiz',
            imagen: '🍵',
            activo: true
        }
    ]);

    const [filtros, setFiltros] = useState({
        busqueda: '',
        tipo: '',
        estado: ''
    });

    const [modalAbierto, setModalAbierto] = useState(false);
    const [nuevaPublicacion, setNuevaPublicacion] = useState({
        tipo: 'noticia',
        titulo: '',
        descripcion: '',
        imagen: '📰'
    });

    const emojisDisponibles = ['📰', '🎉', '☕', '🎄', '⭐', '🍵', '🏪', '🎊', '🌟', '💼', '📢', '🎁'];

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNuevaPublicacionChange = (e) => {
        const { name, value } = e.target;
        setNuevaPublicacion(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const publicacionesFiltradas = publicaciones.filter(pub => {
        const matchBusqueda = pub.titulo.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
            pub.descripcion.toLowerCase().includes(filtros.busqueda.toLowerCase());
        const matchTipo = !filtros.tipo || pub.tipo === filtros.tipo;
        const matchEstado = !filtros.estado ||
            (filtros.estado === 'activo' && pub.activo) ||
            (filtros.estado === 'inactivo' && !pub.activo);

        return matchBusqueda && matchTipo && matchEstado;
    });

    const limpiarFiltros = () => {
        setFiltros({
            busqueda: '',
            tipo: '',
            estado: ''
        });
    };

    const toggleActivo = (id) => {
        setPublicaciones(prev => prev.map(pub =>
            pub.id === id ? { ...pub, activo: !pub.activo } : pub
        ));
    };

    const abrirModal = () => {
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setNuevaPublicacion({
            tipo: 'noticia',
            titulo: '',
            descripcion: '',
            imagen: '📰'
        });
    };

    const publicar = () => {
        if (!nuevaPublicacion.titulo || !nuevaPublicacion.descripcion) {
            alert('Por favor completa todos los campos');
            return;
        }

        const nuevaPub = {
            id: publicaciones.length + 1,
            ...nuevaPublicacion,
            fecha: new Date().toISOString().split('T')[0],
            autor: 'Usuario Actual',
            activo: true
        };

        setPublicaciones(prev => [nuevaPub, ...prev]);
        cerrarModal();
    };

    const getTipoBadgeClass = (tipo) => {
        switch (tipo) {
            case 'noticia': return 'tipo-noticia';
            case 'promocion': return 'tipo-promocion';
            case 'lanzamiento': return 'tipo-lanzamiento';
            default: return 'tipo-noticia';
        }
    };

    const getTipoTexto = (tipo) => {
        switch (tipo) {
            case 'noticia': return 'Noticia';
            case 'promocion': return 'Promoción';
            case 'lanzamiento': return 'Lanzamiento';
            default: return 'Noticia';
        }
    };

    const formatearFecha = (fecha) => {
        const date = new Date(fecha + 'T00:00:00');
        return date.toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <main className={`main-content ${!isOpen ? 'sidebar-closed' : ''}`}>
        <div className="cartelera-container">
            <Sidebar />
            <div className="cartelera-header">
                <div className="cartelera-header-left">
                    <h1 className="cartelera-titulo">Cartelera</h1>
                    <p className="cartelera-breadcrumb">Marketing / Cartelera</p>
                </div>
                <button className="btn-nueva-publicacion" onClick={abrirModal}>
                    <span className="btn-icono">+</span>
                    Nueva Publicación
                </button>
            </div>

            {/* Filtros */}
            <div className="cartelera-filtros">
                <div className="filtros-grid">
                    <div className="filtro-group">
                        <label>Buscar publicación</label>
                        <input
                            type="text"
                            className="filtro-input"
                            placeholder="Título o descripción..."
                            name="busqueda"
                            value={filtros.busqueda}
                            onChange={handleFiltroChange}
                        />
                    </div>

                    <div className="filtro-group">
                        <label>Tipo</label>
                        <select
                            className="filtro-select"
                            name="tipo"
                            value={filtros.tipo}
                            onChange={handleFiltroChange}
                        >
                            <option value="">Todos los tipos</option>
                            <option value="noticia">Noticias</option>
                            <option value="promocion">Promociones</option>
                            <option value="lanzamiento">Lanzamientos</option>
                        </select>
                    </div>

                    <div className="filtro-group">
                        <label>Estado</label>
                        <select
                            className="filtro-select"
                            name="estado"
                            value={filtros.estado}
                            onChange={handleFiltroChange}
                        >
                            <option value="">Todos los estados</option>
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                    </div>

                    <div className="filtro-group" style={{ alignSelf: 'flex-end' }}>
                        <button
                            className="btn-filtrar"
                            onClick={limpiarFiltros}
                        >
                            Limpiar filtros
                        </button>
                    </div>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="cartelera-stats">
                <div className="stat-card">
                    <div className="stat-icono">📰</div>
                    <div className="stat-info">
                        <p className="stat-valor">{publicaciones.filter(p => p.tipo === 'noticia').length}</p>
                        <p className="stat-label">Noticias</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icono">🎉</div>
                    <div className="stat-info">
                        <p className="stat-valor">{publicaciones.filter(p => p.tipo === 'promocion').length}</p>
                        <p className="stat-label">Promociones</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icono">☕</div>
                    <div className="stat-info">
                        <p className="stat-valor">{publicaciones.filter(p => p.tipo === 'lanzamiento').length}</p>
                        <p className="stat-label">Lanzamientos</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icono">✅</div>
                    <div className="stat-info">
                        <p className="stat-valor">{publicaciones.filter(p => p.activo).length}</p>
                        <p className="stat-label">Activas</p>
                    </div>
                </div>
            </div>

            {/* Grid de Publicaciones */}
            <div className="publicaciones-grid">
                {publicacionesFiltradas.map(pub => (
                    <div key={pub.id} className={`publicacion-card ${!pub.activo ? 'inactiva' : ''}`}>
                        <div className="publicacion-header">
                            <span className={`tipo-badge ${getTipoBadgeClass(pub.tipo)}`}>
                                {getTipoTexto(pub.tipo)}
                            </span>
                            <span className={`estado-badge ${pub.activo ? 'estado-activo' : 'estado-inactivo'}`}>
                                {pub.activo ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>

                        <div className="publicacion-imagen">
                            {pub.imagen}
                        </div>

                        <div className="publicacion-content">
                            <h3 className="publicacion-titulo">{pub.titulo}</h3>
                            <p className="publicacion-descripcion">{pub.descripcion}</p>
                        </div>

                        <div className="publicacion-footer">
                            <div className="publicacion-meta">
                                <p className="publicacion-autor">👤 {pub.autor}</p>
                                <p className="publicacion-fecha">📅 {formatearFecha(pub.fecha)}</p>
                            </div>
                            <div className="publicacion-acciones">
                                <button
                                    className="btn-accion btn-editar"
                                    title="Editar"
                                >
                                    ✏️
                                </button>
                                <button
                                    className="btn-accion btn-toggle"
                                    onClick={() => toggleActivo(pub.id)}
                                    title={pub.activo ? 'Desactivar' : 'Activar'}
                                >
                                    {pub.activo ? '🔓' : '🔒'}
                                </button>
                                <button
                                    className="btn-accion btn-eliminar"
                                    title="Eliminar"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {publicacionesFiltradas.length === 0 && (
                <div className="sin-resultados">
                    <p>No se encontraron publicaciones con los filtros aplicados</p>
                </div>
            )}

            {/* Modal Nueva Publicación */}
            {modalAbierto && (
                <div className="modal-overlay" onClick={cerrarModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-titulo">Nueva Publicación</h2>
                            <button className="btn-cerrar-modal" onClick={cerrarModal}>✕</button>
                        </div>

                        <div className="modal-body">
                            <div className="form-group">
                                <label>Tipo de publicación</label>
                                <select
                                    className="form-select"
                                    name="tipo"
                                    value={nuevaPublicacion.tipo}
                                    onChange={handleNuevaPublicacionChange}
                                >
                                    <option value="noticia">Noticia</option>
                                    <option value="promocion">Promoción</option>
                                    <option value="lanzamiento">Lanzamiento</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Título</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Escribe un título atractivo..."
                                    name="titulo"
                                    value={nuevaPublicacion.titulo}
                                    onChange={handleNuevaPublicacionChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Descripción</label>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Escribe la descripción de tu publicación..."
                                    name="descripcion"
                                    value={nuevaPublicacion.descripcion}
                                    onChange={handleNuevaPublicacionChange}
                                    rows="4"
                                />
                            </div>

                            <div className="form-group">
                                <label>Icono</label>
                                <div className="emojis-selector">
                                    {emojisDisponibles.map((emoji, index) => (
                                        <button
                                            key={index}
                                            className={`emoji-btn ${nuevaPublicacion.imagen === emoji ? 'selected' : ''}`}
                                            onClick={() => setNuevaPublicacion(prev => ({ ...prev, imagen: emoji }))}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn-cancelar" onClick={cerrarModal}>
                                Cancelar
                            </button>
                            <button className="btn-publicar" onClick={publicar}>
                                Publicar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        <Outlet />
        </main>
    );
};