import React, { useState } from 'react';
import { Plus, Search, Users, Calendar, Tag, TrendingUp } from 'lucide-react';
import './SegmentacionPromociones.css';

export const SegmentacionPromociones = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [segmentFilter, setSegmentFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [promoFilter, setPromoFilter] = useState('');

    const segmentaciones = [
        {
            id: 1,
            nombre: 'Clientes VIP',
            promocion: 'Descuento 30% Bebidas',
            segmento: 'Premium',
            clientes: 145,
            alcance: '85%',
            estado: 'Activa',
            fechaInicio: '01/11/2025',
            fechaFin: '30/11/2025',
            color: '#FFD700'
        },
        {
            id: 2,
            nombre: 'Nuevos Clientes',
            promocion: '2x1 en Café',
            segmento: 'Nuevos',
            clientes: 89,
            alcance: '92%',
            estado: 'Activa',
            fechaInicio: '05/11/2025',
            fechaFin: '20/11/2025',
            color: '#4ECDC4'
        },
        {
            id: 3,
            nombre: 'Clientes Frecuentes',
            promocion: 'Combo Desayuno',
            segmento: 'Frecuente',
            clientes: 234,
            alcance: '78%',
            estado: 'Activa',
            fechaInicio: '01/11/2025',
            fechaFin: '15/11/2025',
            color: '#FF6B6B'
        },
        {
            id: 4,
            nombre: 'Clientes Inactivos',
            promocion: 'Reactivación 40%',
            segmento: 'Inactivo',
            clientes: 67,
            alcance: '45%',
            estado: 'Programada',
            fechaInicio: '10/11/2025',
            fechaFin: '25/11/2025',
            color: '#95A5A6'
        },
        {
            id: 5,
            nombre: 'Cumpleañeros Mes',
            promocion: 'Postre Gratis',
            segmento: 'Especial',
            clientes: 52,
            alcance: '96%',
            estado: 'Activa',
            fechaInicio: '01/11/2025',
            fechaFin: '30/11/2025',
            color: '#FF69B4'
        },
        {
            id: 6,
            nombre: 'Estudiantes',
            promocion: 'Descuento 20%',
            segmento: 'Estudiante',
            clientes: 178,
            alcance: '88%',
            estado: 'Activa',
            fechaInicio: '01/11/2025',
            fechaFin: '31/12/2025',
            color: '#9B59B6'
        }
    ];

    const filteredSegmentaciones = segmentaciones.filter(seg => {
        const matchesSearch = seg.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             seg.promocion.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSegment = !segmentFilter || seg.segmento === segmentFilter;
        const matchesStatus = !statusFilter || seg.estado === statusFilter;
        const matchesPromo = !promoFilter || seg.promocion.toLowerCase().includes(promoFilter.toLowerCase());
        return matchesSearch && matchesSegment && matchesStatus && matchesPromo;
    });

    // Estadísticas rápidas
    const totalClientes = segmentaciones.reduce((acc, seg) => acc + seg.clientes, 0);
    const promoActivas = segmentaciones.filter(seg => seg.estado === 'Activa').length;
    const alcancePromedio = Math.round(
        segmentaciones.reduce((acc, seg) => acc + parseInt(seg.alcance), 0) / segmentaciones.length
    );

    return (
        <div className="segmentacion-container">
            {/* Header */}
            <div className="segmentacion-header">
                <div className="segmentacion-header-left">
                    <h1 className="segmentacion-titulo">Segmentación de Promociones</h1>
                    <p className="segmentacion-breadcrumb">Marketing | Clientes Objetivo</p>
                </div>
                <button className="btn-nueva-segmentacion">
                    <Plus size={20} className="btn-icono-plus" />
                    <span>Nueva Segmentación</span>
                </button>
            </div>

            {/* Estadísticas */}
            <div className="segmentacion-stats">
                <div className="stat-card">
                    <div className="stat-icon stat-icon-clientes">
                        <Users size={24} />
                    </div>
                    <div className="stat-info">
                        <p className="stat-label">Total Clientes</p>
                        <p className="stat-value">{totalClientes}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-promos">
                        <Tag size={24} />
                    </div>
                    <div className="stat-info">
                        <p className="stat-label">Promociones Activas</p>
                        <p className="stat-value">{promoActivas}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-alcance">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-info">
                        <p className="stat-label">Alcance Promedio</p>
                        <p className="stat-value">{alcancePromedio}%</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-segmentos">
                        <Calendar size={24} />
                    </div>
                    <div className="stat-info">
                        <p className="stat-label">Segmentos Activos</p>
                        <p className="stat-value">{segmentaciones.length}</p>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="segmentacion-filtros">
                <div className="filtros-grid">
                    <div className="filtro-group">
                        <label>Buscar</label>
                        <input
                            type="text"
                            className="filtro-input"
                            placeholder="Buscar segmento o promoción..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filtro-group">
                        <label>Segmento</label>
                        <select
                            className="filtro-select"
                            value={segmentFilter}
                            onChange={(e) => setSegmentFilter(e.target.value)}
                        >
                            <option value="">Todos</option>
                            <option value="Premium">Premium</option>
                            <option value="Nuevos">Nuevos</option>
                            <option value="Frecuente">Frecuente</option>
                            <option value="Inactivo">Inactivo</option>
                            <option value="Especial">Especial</option>
                            <option value="Estudiante">Estudiante</option>
                        </select>
                    </div>

                    <div className="filtro-group">
                        <label>Estado</label>
                        <select
                            className="filtro-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">Todos</option>
                            <option value="Activa">Activa</option>
                            <option value="Programada">Programada</option>
                            <option value="Finalizada">Finalizada</option>
                        </select>
                    </div>

                    <div className="filtro-group">
                        <label>Promoción</label>
                        <input
                            type="text"
                            className="filtro-input"
                            placeholder="Filtrar por promoción..."
                            value={promoFilter}
                            onChange={(e) => setPromoFilter(e.target.value)}
                        />
                    </div>
                </div>

                <button className="btn-filtrar">Filtrar</button>
            </div>

            {/* Lista de Segmentaciones */}
            <div className="segmentacion-lista">
                <div className="lista-header">
                    <h2 className="lista-titulo">Lista de Segmentaciones</h2>
                    <p className="lista-subtitulo">Total: {filteredSegmentaciones.length} segmentaciones</p>
                </div>

                <div className="tabla-container">
                    <table className="segmentacion-tabla">
                        <thead>
                            <tr>
                                <th>SEGMENTO</th>
                                <th>PROMOCIÓN</th>
                                <th>TIPO</th>
                                <th>CLIENTES</th>
                                <th>ALCANCE</th>
                                <th>VIGENCIA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSegmentaciones.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="segmento-info">
                                            <div
                                                className="segmento-avatar"
                                                style={{ backgroundColor: item.color }}
                                            >
                                                {item.nombre.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="segmento-datos">
                                                <p className="segmento-nombre">{item.nombre}</p>
                                                <p className="segmento-subtipo">{item.segmento}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="segmento-promocion">{item.promocion}</span>
                                    </td>
                                    <td>
                                        <span className={`segmento-badge segmento-${item.segmento.toLowerCase()}`}>
                                            {item.segmento}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="segmento-clientes">{item.clientes}</span>
                                    </td>
                                    <td>
                                        <div className="alcance-container">
                                            <div className="alcance-bar">
                                                <div
                                                    className="alcance-fill"
                                                    style={{ width: item.alcance }}
                                                ></div>
                                            </div>
                                            <span className="alcance-text">{item.alcance}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="segmento-vigencia">{item.fechaInicio} - {item.fechaFin}</span>
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