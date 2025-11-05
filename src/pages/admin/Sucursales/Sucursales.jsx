import React, { useState, useEffect } from 'react';
import { Plus, Search, MapPin, Phone } from 'lucide-react';
import './Sucursales.css';

export const Sucursales = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [ciudadFilter, setCiudadFilter] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('');
    const [zonaFilter, setZonaFilter] = useState('');

    const sucursales = [
        {
            id: 1,
            nombre: 'Sucursal Centro',
            direccion: 'Av. Principal #123, Centro',
            ciudad: 'León',
            estado: 'Guanajuato',
            zona: 'Centro',
            telefono: '(477) 123-4567',
            horario: 'L-D 7:00-22:00',
            coordenadas: '21.1236, -101.6859',
            color: '#FF6B35'
        },
        {
            id: 2,
            nombre: 'Sucursal Norte',
            direccion: 'Blvd. Norte #456, Col. Jardines',
            ciudad: 'León',
            estado: 'Guanajuato',
            zona: 'Norte',
            telefono: '(477) 234-5678',
            horario: 'L-D 8:00-21:00',
            coordenadas: '21.1458, -101.6742',
            color: '#4ECDC4'
        },
        {
            id: 3,
            nombre: 'Sucursal Sur',
            direccion: 'Av. del Sur #789, Col. Las Torres',
            ciudad: 'León',
            estado: 'Guanajuato',
            zona: 'Sur',
            telefono: '(477) 345-6789',
            horario: 'L-D 7:30-22:30',
            coordenadas: '21.0985, -101.6923',
            color: '#95E1D3'
        },
        {
            id: 4,
            nombre: 'Sucursal Plaza Mayor',
            direccion: 'Plaza Mayor Local 15',
            ciudad: 'León',
            estado: 'Guanajuato',
            zona: 'Centro',
            telefono: '(477) 456-7890',
            horario: 'L-D 10:00-22:00',
            coordenadas: '21.1198, -101.6831',
            color: '#F38181'
        },
        {
            id: 5,
            nombre: 'Sucursal Universidad',
            direccion: 'Av. Universidad #234',
            ciudad: 'León',
            estado: 'Guanajuato',
            zona: 'Este',
            telefono: '(477) 567-8901',
            horario: 'L-D 7:00-23:00',
            coordenadas: '21.1312, -101.6645',
            color: '#FFB6C1'
        },
        {
            id: 6,
            nombre: 'Sucursal Aeropuerto',
            direccion: 'Terminal Aérea, Zona Comercial',
            ciudad: 'Silao',
            estado: 'Guanajuato',
            zona: 'Aeropuerto',
            telefono: '(472) 678-9012',
            horario: '24 horas',
            coordenadas: '20.9934, -101.4806',
            color: '#9B59B6'
        }
    ];

    const filteredSucursales = sucursales.filter(sucursal => {
        const matchesSearch = sucursal.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             sucursal.direccion.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCiudad = !ciudadFilter || sucursal.ciudad === ciudadFilter;
        const matchesEstado = !estadoFilter || sucursal.estado === estadoFilter;
        const matchesZona = !zonaFilter || sucursal.zona === zonaFilter;
        return matchesSearch && matchesCiudad && matchesEstado && matchesZona;
    });

    return (
        <div className="sucursales-container">
            {/* Header */}
            <div className="sucursales-header">
                <div className="sucursales-header-left">
                    <h1 className="sucursales-titulo">Catálogo de Sucursales</h1>
                    <p className="sucursales-breadcrumb">Operaciones | Ubicaciones</p>
                </div>
                <button className="btn-nueva-sucursal">
                    <Plus size={20} className="btn-icono-plus" />
                    <span>Nueva Sucursal</span>
                </button>
            </div>

            {/* Filtros */}
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

                    <div className="filtro-group">
                        <label>Ciudad</label>
                        <select
                            className="filtro-select"
                            value={ciudadFilter}
                            onChange={(e) => setCiudadFilter(e.target.value)}
                        >
                            <option value="">Todas</option>
                            <option value="León">León</option>
                            <option value="Silao">Silao</option>
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
                            <option value="Guanajuato">Guanajuato</option>
                        </select>
                    </div>

                    <div className="filtro-group">
                        <label>Zona</label>
                        <select
                            className="filtro-select"
                            value={zonaFilter}
                            onChange={(e) => setZonaFilter(e.target.value)}
                        >
                            <option value="">Todas</option>
                            <option value="Centro">Centro</option>
                            <option value="Norte">Norte</option>
                            <option value="Sur">Sur</option>
                            <option value="Este">Este</option>
                            <option value="Aeropuerto">Aeropuerto</option>
                        </select>
                    </div>
                </div>

                <button className="btn-filtrar">Filtrar</button>
            </div>

            {/* Lista de Sucursales */}
            <div className="sucursales-lista">
                <div className="lista-header">
                    <h2 className="lista-titulo">Lista de Sucursales</h2>
                    <p className="lista-subtitulo">Total: {filteredSucursales.length} sucursales</p>
								<div>ACCIONES</div>
                </div>

                <div className="tabla-container">
                    <table className="sucursales-tabla">
                        <thead>
                            <tr>
                                <th>SUCURSAL</th>
                                <th>DIRECCIÓN</th>
                                <th>ZONA</th>
                                <th>TELÉFONO</th>
                                <th>HORARIO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSucursales.map((sucursal) => (
                                <tr key={sucursal.id}>
                                    <td>
                                        <div className="sucursal-info">
                                            <div
                                                className="sucursal-avatar"
                                                style={{ backgroundColor: sucursal.color }}
                                            >
                                                {sucursal.nombre.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="sucursal-datos">
                                                <p className="sucursal-nombre">{sucursal.nombre}</p>
                                                <p className="sucursal-ciudad">{sucursal.ciudad}, {sucursal.estado}</p>
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
                                        <span className={`zona-badge zona-${sucursal.zona.toLowerCase()}`}>
                                            {sucursal.zona}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="telefono-container">
                                            <Phone size={16} className="telefono-icon" />
                                            <span className="sucursal-telefono">{sucursal.telefono}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="sucursal-horario">{sucursal.horario}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};