import React, { useState } from 'react';
import './Evento.css';
import './ModalEvento.css';
import Sidebar from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../context/SidebarContext';
import { Outlet } from 'react-router-dom';

export const Eventos = () => {
    const { isOpen } = useSidebar();
    const [busqueda, setBusqueda] = useState('');
    const [tipo, setTipo] = useState('');
    const [estado, setEstado] = useState('');
    const [fecha, setFecha] = useState('');
    const [mostrarModal, setMostrarModal] = useState(false);
    const [editando, setEditando] = useState(null);
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        sucursal: '',
        inicia_en: '',
        termina: '',
        capacidad: '',
        estado: ''
    });

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Datos del evento:', formData);
        // Aquí irá la lógica para guardar el evento
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            titulo: '',
            descripcion: '',
            sucursal: '',
            inicia_en: '',
            termina: '',
            capacidad: '',
            estado: ''
        });
        setMostrarModal(false);
        setEditando(null);
    };

    const handleCancelar = () => {
        resetForm();
    };

    return (
        <main className={`main-content ${!isOpen ? 'sidebar-closed' : ''}`}>
            <div className="eventos-container">
                <Sidebar />
                <div className="eventos-header">
                    <div className="eventos-header-left">
                        <h1 className="eventos-titulo">Eventos</h1>
                        <p className="eventos-breadcrumb">Marketing | Eventos</p>
                    </div>
                    <button
                        className="btn-nuevo-evento"
                        onClick={() => setMostrarModal(true)}
                    >
                        <span className="btn-icono">+</span>
                        Nuevo Evento
                    </button>
                </div>

                {mostrarModal && (
                    <div className="modal-overlay" onClick={handleCancelar}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2 className="modal-titulo">
                                    {editando ? 'Editar Evento' : 'Nuevo Evento'}
                                </h2>
                                <button className="modal-close" onClick={handleCancelar}>
                                    ×
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="modal-form">
                                {/* SECCIÓN 1: Información Básica */}
                                <div className="form-section">
                                    <h3 className="section-title">📝 Información Básica</h3>

                                    <div className="form-group">
                                        <label htmlFor="titulo">
                                            Título del Evento <span className="required">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="titulo"
                                            name="titulo"
                                            value={formData.titulo}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Ej: Lanzamiento de Nueva Línea de Productos"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="descripcion">
                                            Descripción <span className="required">*</span>
                                        </label>
                                        <textarea
                                            id="descripcion"
                                            name="descripcion"
                                            value={formData.descripcion}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Describe los detalles del evento..."
                                            rows="4"
                                        />
                                        <p className="char-counter">
                                            {formData.descripcion.length}/500 caracteres
                                        </p>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="estado">
                                            Estado <span className="required">*</span>
                                        </label>
                                        <select
                                            id="estado"
                                            name="estado"
                                            value={formData.estado}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Seleccionar estado</option>
                                            <option value="borrador">📝 Borrador</option>
                                            <option value="publicado">✅ Publicado</option>
                                            <option value="finalizado">🏁 Finalizado</option>
                                        </select>
                                    </div>
                                </div>

                                {/* SECCIÓN 2: Ubicación y Capacidad */}
                                <div className="form-section">
                                    <h3 className="section-title">📍 Ubicación y Capacidad</h3>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="sucursal">
                                                Sucursal <span className="required">*</span>
                                            </label>
                                            <select
                                                id="sucursal"
                                                name="sucursal"
                                                value={formData.sucursal}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Seleccionar sucursal</option>
                                                <option value="centro">Sucursal Centro</option>
                                                <option value="norte">Sucursal Norte</option>
                                                <option value="sur">Sucursal Sur</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="capacidad">
                                                Capacidad <span className="required">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                id="capacidad"
                                                name="capacidad"
                                                value={formData.capacidad}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Ej: 50"
                                                min="1"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* SECCIÓN 3: Fechas y Horarios */}
                                <div className="form-section">
                                    <h3 className="section-title">📅 Fechas y Horarios</h3>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="inicia_en">
                                                Fecha y Hora de Inicio <span className="required">*</span>
                                            </label>
                                            <input
                                                type="datetime-local"
                                                id="inicia_en"
                                                name="inicia_en"
                                                value={formData.inicia_en}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="termina">
                                                Fecha y Hora de Término <span className="required">*</span>
                                            </label>
                                            <input
                                                type="datetime-local"
                                                id="termina"
                                                name="termina"
                                                value={formData.termina}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {formData.inicia_en && formData.termina && (
                                        <div className="info-box">
                                            <p>
                                                <span className="icon">ℹ️</span>
                                                Duración estimada: {
                                                    (() => {
                                                        const inicio = new Date(formData.inicia_en);
                                                        const fin = new Date(formData.termina);
                                                        const diff = (fin - inicio) / (1000 * 60 * 60);
                                                        return diff > 0 ? `${diff.toFixed(1)} horas` : 'Fecha inválida';
                                                    })()
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Footer con botones */}
                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        className="btn-cancelar-modal"
                                        onClick={handleCancelar}
                                    >
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-guardar-modal">
                                        {editando ? 'Actualizar Evento' : 'Crear Evento'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

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