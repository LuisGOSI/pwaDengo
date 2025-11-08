import React, { useState } from 'react';
import { Plus, Search, Star, ThumbsUp, MessageCircle, Send, Filter } from 'lucide-react';
import './Resenias.css';
import Sidebar from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../context/SidebarContext';
import { Outlet } from 'react-router-dom';

export const Resenias = () => {
    const { isOpen } = useSidebar();
    const [searchTerm, setSearchTerm] = useState('');
    const [calificacionFilter, setCalificacionFilter] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('');
    const [sucursalFilter, setSucursalFilter] = useState('');
    const [respuestaActiva, setRespuestaActiva] = useState(null);
    const [textoRespuesta, setTextoRespuesta] = useState('');

    const resenas = [
        {
            id: 1,
            cliente: 'María González',
            email: 'maria.gonzalez@email.com',
            calificacion: 5,
            fecha: '2 Nov 2025',
            sucursal: 'Centro',
            comentario: 'Excelente servicio y el café es increíble. Los baristas son muy profesionales y el ambiente es acogedor. Definitivamente volveré.',
            respuesta: null,
            estado: 'Pendiente',
            likes: 12,
            avatar: 'MG'
        },
        {
            id: 2,
            cliente: 'Carlos Martínez',
            email: 'carlos.martinez@email.com',
            calificacion: 4,
            fecha: '1 Nov 2025',
            sucursal: 'Norte',
            comentario: 'Muy buen lugar, el café tiene un sabor único. Solo sugeriría más opciones veganas en el menú.',
            respuesta: 'Gracias por tu comentario Carlos. Nos alegra que disfrutes nuestro café. Tomaremos en cuenta tu sugerencia sobre opciones veganas.',
            estado: 'Respondida',
            likes: 8,
            avatar: 'CM'
        },
        {
            id: 3,
            cliente: 'Ana López',
            email: 'ana.lopez@email.com',
            calificacion: 5,
            fecha: '31 Oct 2025',
            sucursal: 'Sur',
            comentario: 'El mejor café de la ciudad. Me encanta el arte latte que hacen, cada taza es una obra de arte.',
            respuesta: null,
            estado: 'Pendiente',
            likes: 15,
            avatar: 'AL'
        },
        {
            id: 4,
            cliente: 'Roberto Díaz',
            email: 'roberto.diaz@email.com',
            calificacion: 3,
            fecha: '30 Oct 2025',
            sucursal: 'Centro',
            comentario: 'El café está bien, pero el servicio fue un poco lento durante la hora pico. Espero que mejoren los tiempos de espera.',
            respuesta: 'Hola Roberto, lamentamos la demora. Estamos trabajando en optimizar nuestro servicio durante horas pico. Gracias por tu paciencia.',
            estado: 'Respondida',
            likes: 5,
            avatar: 'RD'
        },
        {
            id: 5,
            cliente: 'Laura Sánchez',
            email: 'laura.sanchez@email.com',
            calificacion: 5,
            fecha: '29 Oct 2025',
            sucursal: 'Norte',
            comentario: 'Ambiente perfecto para trabajar. WiFi rápido, enchufes disponibles y café delicioso. ¡Mi lugar favorito!',
            respuesta: null,
            estado: 'Pendiente',
            likes: 20,
            avatar: 'LS'
        },
        {
            id: 6,
            cliente: 'Pedro Torres',
            email: 'pedro.torres@email.com',
            calificacion: 4,
            fecha: '28 Oct 2025',
            sucursal: 'Sur',
            comentario: 'Buenos precios y calidad. Los postres son deliciosos, especialmente el cheesecake.',
            respuesta: 'Gracias Pedro, nos alegra que disfrutes nuestros postres. ¡Te esperamos pronto!',
            estado: 'Respondida',
            likes: 10,
            avatar: 'PT'
        }
    ];

    const filteredResenas = resenas.filter(resena => {
        const matchesSearch = resena.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resena.comentario.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCalificacion = !calificacionFilter || resena.calificacion === parseInt(calificacionFilter);
        const matchesEstado = !estadoFilter || resena.estado === estadoFilter;
        const matchesSucursal = !sucursalFilter || resena.sucursal === sucursalFilter;
        return matchesSearch && matchesCalificacion && matchesEstado && matchesSucursal;
    });

    const handleResponder = (id) => {
        setRespuestaActiva(respuestaActiva === id ? null : id);
        setTextoRespuesta('');
    };

    const handleEnviarRespuesta = (id) => {
        console.log(`Respuesta enviada para reseña ${id}:`, textoRespuesta);
        setRespuestaActiva(null);
        setTextoRespuesta('');
    };

    const renderEstrellas = (calificacion) => {
        return [...Array(5)].map((_, index) => (
            <Star
                key={index}
                size={18}
                fill={index < calificacion ? '#FFB800' : 'none'}
                stroke={index < calificacion ? '#FFB800' : '#D0D0D0'}
            />
        ));
    };

    const estadisticas = {
        total: resenas.length,
        pendientes: resenas.filter(r => r.estado === 'Pendiente').length,
        respondidas: resenas.filter(r => r.estado === 'Respondida').length,
        promedio: (resenas.reduce((acc, r) => acc + r.calificacion, 0) / resenas.length).toFixed(1)
    };

    return (
        <main className={`main-content ${!isOpen ? 'sidebar-closed' : ''}`}>
            <div className="resenas-container">
                <Sidebar />
                <div className="resenas-header">
                    <div className="resenas-header-left">
                        <h1 className="resenas-titulo">Gestión de Reseñas</h1>
                        <p className="resenas-breadcrumb">Clientes | Feedback</p>
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="resenas-stats">
                    <div className="stat-box">
                        <div className="stat-value">{estadisticas.total}</div>
                        <div className="stat-label">Total Reseñas</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-value">{estadisticas.pendientes}</div>
                        <div className="stat-label">Pendientes</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-value">{estadisticas.respondidas}</div>
                        <div className="stat-label">Respondidas</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-value">
                            <Star size={20} fill="#FFB800" stroke="#FFB800" />
                            {estadisticas.promedio}
                        </div>
                        <div className="stat-label">Promedio</div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="resenas-filtros">
                    <div className="filtros-grid">
                        <div className="filtro-group">
                            <label>Buscar</label>
                            <input
                                type="text"
                                className="filtro-input"
                                placeholder="Buscar por cliente o comentario..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="filtro-group">
                            <label>Calificación</label>
                            <select
                                className="filtro-select"
                                value={calificacionFilter}
                                onChange={(e) => setCalificacionFilter(e.target.value)}
                            >
                                <option value="">Todas</option>
                                <option value="5">5 Estrellas</option>
                                <option value="4">4 Estrellas</option>
                                <option value="3">3 Estrellas</option>
                                <option value="2">2 Estrellas</option>
                                <option value="1">1 Estrella</option>
                            </select>
                        </div>

                        <div className="filtro-group">
                            <label>Estado</label>
                            <select
                                className="filtro-select"
                                value={estadoFilter}
                                onChange={(e) => setEstadoFilter(e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="Respondida">Respondida</option>
                            </select>
                        </div>

                        <div className="filtro-group">
                            <label>Sucursal</label>
                            <select
                                className="filtro-select"
                                value={sucursalFilter}
                                onChange={(e) => setSucursalFilter(e.target.value)}
                            >
                                <option value="">Todas</option>
                                <option value="Centro">Centro</option>
                                <option value="Norte">Norte</option>
                                <option value="Sur">Sur</option>
                            </select>
                        </div>
                    </div>

                    <button className="btn-filtrar">
                        <Filter size={18} />
                        Filtrar
                    </button>
                </div>

                {/* Lista de Reseñas */}
                <div className="resenas-lista">
                    <div className="lista-header">
                        <h2 className="lista-titulo">Lista de Reseñas</h2>
                        <p className="lista-subtitulo">Total: {filteredResenas.length} reseñas</p>
                    </div>

                    <div className="resenas-items">
                        {filteredResenas.map((resena) => (
                            <div key={resena.id} className="resena-card">
                                <div className="resena-top">
                                    <div className="cliente-info">
                                        <div className="cliente-avatar">{resena.avatar}</div>
                                        <div className="cliente-datos">
                                            <h3 className="cliente-nombre">{resena.cliente}</h3>
                                            <p className="cliente-email">{resena.email}</p>
                                        </div>
                                    </div>
                                    <div className="resena-meta">
                                        <div className="calificacion">
                                            {renderEstrellas(resena.calificacion)}
                                        </div>
                                        <span className="fecha">{resena.fecha}</span>
                                    </div>
                                </div>

                                <div className="resena-content">
                                    <div className="sucursal-tag">{resena.sucursal}</div>
                                    <p className="comentario">{resena.comentario}</p>
                                </div>

                                <div className="resena-footer">
                                    <div className="footer-left">
                                        <button className="btn-icon">
                                            <ThumbsUp size={16} />
                                            <span>{resena.likes}</span>
                                        </button>
                                        <span className={`estado-badge ${resena.estado.toLowerCase()}`}>
                                            {resena.estado}
                                        </span>
                                    </div>
                                    <button
                                        className="btn-responder"
                                        onClick={() => handleResponder(resena.id)}
                                    >
                                        <MessageCircle size={16} />
                                        {resena.respuesta ? 'Ver respuesta' : 'Responder'}
                                    </button>
                                </div>

                                {/* Respuesta existente */}
                                {resena.respuesta && respuestaActiva !== resena.id && (
                                    <div className="respuesta-existente">
                                        <div className="respuesta-header">
                                            <span className="respuesta-label">Tu respuesta:</span>
                                        </div>
                                        <p className="respuesta-texto">{resena.respuesta}</p>
                                    </div>
                                )}

                                {/* Formulario de respuesta */}
                                {respuestaActiva === resena.id && (
                                    <div className="respuesta-form">
                                        <textarea
                                            className="respuesta-textarea"
                                            placeholder="Escribe tu respuesta aquí..."
                                            value={textoRespuesta}
                                            onChange={(e) => setTextoRespuesta(e.target.value)}
                                            rows="3"
                                        />
                                        <div className="respuesta-actions">
                                            <button
                                                className="btn-cancelar-respuesta"
                                                onClick={() => setRespuestaActiva(null)}
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                className="btn-enviar-respuesta"
                                                onClick={() => handleEnviarRespuesta(resena.id)}
                                            >
                                                <Send size={16} />
                                                Enviar respuesta
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Outlet />
        </main>
    );
};