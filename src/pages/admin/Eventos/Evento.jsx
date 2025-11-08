import React, { useState } from 'react';
import './Evento.css';
import Sidebar from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../context/SidebarContext';
import { Outlet } from 'react-router-dom';

export const Eventos = () => {
    const { isOpen } = useSidebar();
    const [busqueda, setBusqueda] = useState('');
    const [tipo, setTipo] = useState('');
    const [estado, setEstado] = useState('');
    const [fecha, setFecha] = useState('');

    const eventos = [
        {
            id: 1,
            titulo: 'Nueva Línea de Bebidas Frías',
            descripcion: 'Celebra con nosotros el lanzamiento de nuestra nueva colección de bebidas frías de...',
            fecha: '15 Diciembre 6, 2025',
            hora: '6:30 PM - 8:30 PM',
            lugar: 'Sucursal Centro',
            asistentes: '50-30 Inscritos',
            categoria: 'DEGUSTACIÓN',
            estado: 'Publicado'
        },
        {
            id: 2,
            titulo: 'Taller de Café Artesanal',
            descripcion: 'Aprende las técnicas de preparación de café de especialidad...',
            fecha: '20 Diciembre 6, 2025',
            hora: '10:00 AM - 12:00 PM',
            lugar: 'Sucursal Norte',
            asistentes: '30-25 Inscritos',
            categoria: 'TALLER',
            estado: 'Publicado'
        }
    ];

    const handleFiltrar = () => {
        console.log('Filtrando eventos...', { busqueda, tipo, estado, fecha });
    };

    return (
        <main className={`main-content ${!isOpen ? 'sidebar-closed' : ''}`}>
            <div className="eventos-container">
                <Sidebar />
                <div className="eventos-header">
                    <div className="eventos-header-left">
                        <h1 className="eventos-titulo">Eventos</h1>
                        <p className="eventos-breadcrumb">Catálogos | Eventos</p>
                    </div>
                    <button className="btn-nuevo-evento">
                        <span className="btn-icono">+</span>
                        Nuevo Evento
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="eventos-stats">
                    <div className="stat-card">
                        <p className="stat-label">Total de eventos</p>
                        <p className="stat-value">24</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-label">Eventos activos</p>
                        <p className="stat-value">8</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-label">Próximos</p>
                        <p className="stat-value">24</p>
                    </div>
                </div>

                {/* Filtros */}
                <div className="eventos-filtros">
                    <div className="filtros-row">
                        <div className="filtro-group">
                            <label>Buscar evento</label>
                            <input
                                type="text"
                                placeholder=""
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="filtro-input"
                            />
                        </div>

                        <div className="filtro-group">
                            <label>Tipo</label>
                            <select
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                                className="filtro-select"
                            >
                                <option value="">-</option>
                                <option value="degustacion">Degustación</option>
                                <option value="taller">Taller</option>
                                <option value="conferencia">Conferencia</option>
                            </select>
                        </div>

                        <div className="filtro-group">
                            <label>Estado de evento</label>
                            <select
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                                className="filtro-select"
                            >
                                <option value="">-</option>
                                <option value="publicado">Publicado</option>
                                <option value="borrador">Borrador</option>
                                <option value="finalizado">Finalizado</option>
                            </select>
                        </div>

                        <div className="filtro-group">
                            <label>Fecha</label>
                            <input
                                type="date"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                                className="filtro-input filtro-date"
                            />
                        </div>
                    </div>

                    <button onClick={handleFiltrar} className="btn-filtrar">
                        Filtrar
                    </button>
                </div>

                {/* Lista de Eventos */}
                <div className="eventos-lista">
                    {eventos.map((evento) => (
                        <div key={evento.id} className="evento-card">
                            <div className="evento-imagen">
                                <span className="evento-badge">{evento.estado}</span>
                            </div>
                            <div className="evento-contenido">
                                <span className="evento-categoria">{evento.categoria}</span>
                                <h3 className="evento-titulo-card">{evento.titulo}</h3>
                                <p className="evento-descripcion">{evento.descripcion}</p>
                                <div className="evento-detalles">
                                    <p className="evento-detalle">{evento.fecha}</p>
                                    <p className="evento-detalle">{evento.hora}</p>
                                    <p className="evento-detalle">{evento.lugar}</p>
                                    <p className="evento-detalle">{evento.asistentes}</p>
                                </div>
                                <div className="evento-acciones">
                                    <button className="btn-accion btn-editar">Editar</button>
                                    <button className="btn-accion btn-ver">Ver</button>
                                    <button className="btn-accion btn-eliminar">Eliminar</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Outlet />
        </main>
    );
}