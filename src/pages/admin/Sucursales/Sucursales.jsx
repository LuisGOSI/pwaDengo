import { useState, useEffect } from 'react';
import { Plus, MapPin, Phone } from 'lucide-react';
import './Sucursales.css';
import Sidebar from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../context/SidebarContext';
import { Outlet } from 'react-router-dom';

export const Sucursales = () => {
    const { isOpen } = useSidebar();
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editando, setEditando] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        nombre: '',
        direccion: '',
        latitud: '',
        longitud: '',
        telefono: '',
        horario_apertura: '',
        horario_clausura: ''
    });

    const [sucursales, setSucursales] = useState([]);

    const API_URL = 'http://localhost:3000/api/sucursales';

    useEffect(() => {
        cargarSucursales();
    }, []);

    const cargarSucursales = async () => {
        try {
            const response = await fetch(API_URL);
            const result = await response.json();

            if (result.success) {
                setSucursales(result.data);
            }
        } catch (err) {
            console.error('Error al cargar sucursales:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = editando ? `${API_URL}/${editando}` : API_URL;
            const method = editando ? 'PUT' : 'POST';
            const horarioCompleto = `Lunes a Sábado ${formData.horario_apertura} a ${formData.horario_clausura}`;

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: formData.nombre,
                    direccion: formData.direccion,
                    latitud: parseFloat(formData.latitud),
                    longitud: parseFloat(formData.longitud),
                    telefono: formData.telefono,
                    horario_apertura: horarioCompleto
                })
            });

            const result = await response.json();

            if (result.success) {
                await cargarSucursales();
                resetForm();
            }
        } catch (err) {
            console.error('Error al guardar sucursal:', err);
        }
    };

    const parseHorario = (horarioString) => {
        // Parsear el string "Lunes a Sábado"
        const regex = /(\d{1,2}:\d{2})\s+a\s+(\d{1,2}:\d{2})/;
        const match = horarioString.match(regex);

        if (match) {
            return {
                apertura: match[1],
                clausura: match[2]
            };
        }
        return { apertura: '', clausura: '' };
    };

    const handleEditar = (sucursal) => {
        setEditando(sucursal.id);
        // Parsear el horario desde la base de datos
        const horarios = parseHorario(sucursal.horario_apertura || '');

        setFormData({
            nombre: sucursal.nombre,
            direccion: sucursal.direccion || '',
            latitud: sucursal.latitud || '',
            longitud: sucursal.longitud || '',
            telefono: sucursal.telefono || '',
            horario_apertura: horarios.apertura,
            horario_clausura: horarios.clausura
        });
        setMostrarFormulario(true);
    };

    const handleToggleActiva = async (id, activaActual) => {
        try {
            const response = await fetch(`${API_URL}/activa/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ activa: !activaActual })
            });

            const result = await response.json();

            if (result.success) {
                await cargarSucursales();
            }
        } catch (err) {
            console.error('Error al cambiar estado:', err);
        }
    };

    const resetForm = () => {
        setFormData({
            nombre: '',
            direccion: '',
            latitud: '',
            longitud: '',
            telefono: '',
            horario_apertura: '',
            horario_clausura: ''
        });
        setMostrarFormulario(false);
        setEditando(null);
    };

    const handleCancelar = () => {
        resetForm();
    };

    const filteredSucursales = sucursales.filter(sucursal => {
        const matchesSearch = sucursal.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (sucursal.direccion && sucursal.direccion.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesSearch;
    });

    const getColorForIndex = (index) => {
        const colors = ['#FF6B35', '#4ECDC4', '#95E1D3', '#F38181', '#FFB6C1', '#9B59B6'];
        return colors[index % colors.length];
    };

    return (
        <main className={`main-content ${!isOpen ? 'sidebar-closed' : ''}`}>
            <div>
                <Sidebar />
                <div className="sucursales-container">
                    <div className="sucursales-header">
                        <div className="sucursales-header-left">
                            <h1 className="sucursales-titulo">Catálogo de Sucursales</h1>
                            <p className="sucursales-breadcrumb">Operaciones | Sucursales</p>
                        </div>
                        <button
                            className="btn-nueva-sucursal"
                            onClick={() => {
                                if (!mostrarFormulario) {
                                    resetForm();
                                }
                                setMostrarFormulario(!mostrarFormulario);
                            }}
                        >
                            <Plus size={20} className="btn-icono-plus" />
                            <span>Nueva Sucursal</span>
                        </button>
                    </div>
                    {mostrarFormulario && (
                        <div className="formulario-container">
                            <h3 className="formulario-title">
                                {editando ? 'Editar Sucursal' : 'Nueva Sucursal'}
                            </h3>
                            <form onSubmit={handleSubmit} className="formulario-sucursal">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="nombre">Nombre</label>
                                        <input
                                            type="text"
                                            id="nombre"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Ej: Sucursal Centro"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="telefono">Teléfono</label>
                                        <input
                                            type="text"
                                            id="telefono"
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Ej: (477) 123-4567"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="direccion">Dirección</label>
                                    <input
                                        type="text"
                                        id="direccion"
                                        name="direccion"
                                        value={formData.direccion}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Ej: Av. Principal 123, Centro"
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="latitud">Latitud</label>
                                        <input
                                            type="number"
                                            step="any"
                                            id="latitud"
                                            name="latitud"
                                            value={formData.latitud}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Ej: 21.1219"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="longitud">Longitud</label>
                                        <input
                                            type="number"
                                            step="any"
                                            id="longitud"
                                            name="longitud"
                                            value={formData.longitud}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Ej: -101.6827"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="horario_apertura">Horario de Apertura</label>
                                        <input
                                            type="time"
                                            id="horario_apertura"
                                            name="horario_apertura"
                                            value={formData.horario_apertura}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="horario_clausura">Horario de Clausura</label>
                                        <input
                                            type="time"
                                            id="horario_clausura"
                                            name="horario_clausura"
                                            value={formData.horario_clausura}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="btn-cancelar" onClick={handleCancelar}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-guardar">
                                        {editando ? 'Actualizar Sucursal' : 'Guardar Sucursal'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                    <div className="sucursales-filtros">
                        <div className="filtros-grid">
                            <div className="filtro-group">
                                <label>Buscar</label>
                                <input
                                    type="text"
                                    className="filtro-input"
                                    placeholder="Buscar sucursal..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="sucursales-lista">
                        <div className="lista-header">
                            <h2 className="lista-titulo">Lista de Sucursales</h2>
                            <p className="lista-subtitulo">Total: {filteredSucursales.length} sucursales</p>
                        </div>

                        <div className="tabla-container">
                            <table className="sucursales-tabla">
                                <thead>
                                    <tr>
                                        <th>SUCURSAL</th>
                                        <th>DIRECCIÓN</th>
                                        <th>COORDENADAS</th>
                                        <th>TELÉFONO</th>
                                        <th>HORARIO</th>
                                        <th>ESTADO</th>
                                        <th>ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSucursales.map((sucursal, index) => (
                                        <tr key={sucursal.id}>
                                            <td>
                                                <div className="sucursal-info">
                                                    <div
                                                        className="sucursal-avatar"
                                                        style={{ backgroundColor: getColorForIndex(index) }}
                                                    >
                                                        {sucursal.nombre.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div className="sucursal-datos">
                                                        <p className="sucursal-nombre">{sucursal.nombre}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="direccion-container">
                                                    <MapPin size={16} className="direccion-icon" />
                                                    <span className="sucursal-direccion">{sucursal.direccion}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="sucursal-coordenadas">
                                                    {sucursal.latitud}, {sucursal.longitud}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="telefono-container">
                                                    <Phone size={16} className="telefono-icon" />
                                                    <span className="sucursal-telefono">{sucursal.telefono}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="sucursal-horario">{sucursal.horario_apertura}</span>
                                            </td>
                                            <td>
                                                <span className={`estado-badge ${sucursal.activa ? 'estado-activo' : 'estado-inactivo'}`}>
                                                    {sucursal.activa ? 'Activa' : 'Inactiva'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="sucursal-acciones">
                                                    <button
                                                        onClick={() => handleEditar(sucursal)}
                                                        className="btn-accion btn-editar"
                                                        title="Editar"
                                                    >
                                                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleActiva(sucursal.id, sucursal.activa)}
                                                        className={`btn-accion ${sucursal.activa ? 'btn-desactivar' : 'btn-activar'}`}
                                                        title={sucursal.activa ? 'Desactivar' : 'Activar'}
                                                    >
                                                        {sucursal.activa ? (
                                                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                            </svg>
                                                        ) : (
                                                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredSucursales.length === 0 && (
                            <div className="no-results">
                                No se encontraron sucursales
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Outlet />
        </main>
    );
};