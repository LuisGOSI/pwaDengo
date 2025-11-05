import React, { useState } from 'react';
import './Dashboard.css';
import Sidebar from '../../../components/layout/Sidebar';

export const Dashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const pedidos = [
        {
            id: '#PED-1089',
            cliente: 'María González',
            productos: 'Flat White, Croissant',
            barista: 'Juan Pérez',
            estado: 'En Preparación',
            total: '$145.00'
        },
        {
            id: '#PED-1088',
            cliente: 'Carlos Ramírez',
            productos: 'Espresso Martini x2',
            barista: 'Ana López',
            estado: 'Listo',
            total: '$310.00'
        },
        {
            id: '#PED-1087',
            cliente: 'Luis Fernández',
            productos: 'Hamburguesa Django',
            barista: 'Sin asig',
            estado: '',
            total: ''
        }
    ];

    return (
        <div className="dashboard-contenedor">
            <Sidebar />
            {/* Header */}
            <div className="dashboard-header">
                <div className="header-left">
                    <h1 className="dashboard-title">Dashboard</h1>
                    <p className="dashboard-breadcrumb">Inicio | Dashboard</p>
                </div>
                <div className="header-right">
                    <p className="dashboard-date">Sábado, 25 de Octubre del 2025</p>
                    <div className="notification-badge">
                        <span className="badge-count">8</span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card stat-card-large"></div>
                <div className="stat-card"></div>
                <div className="stat-card stat-card-medium"></div>
                <div className="stat-card stat-card-medium"></div>
                <div className="stat-card stat-card-medium"></div>
            </div>

            {/* Active Orders Section */}
            <div className="pedidos-section">
                <div className="pedidos-header">
                    <h2 className="pedidos-title">Pedidos Activos</h2>
                    <div className="pedidos-actions">
                        <div className="search-box">
                            <span className="search-icon">🔍</span>
                            <input 
                                type="text" 
                                placeholder="Buscar pedido..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        <button className="btn-ver-todos">Ver Todos</button>
                    </div>
                </div>

                {/* Table */}
                <div className="table-container">
                    <table className="pedidos-table">
                        <thead>
                            <tr>
                                <th>ID PEDIDO</th>
                                <th>CLIENTE</th>
                                <th>PRODUCTOS</th>
                                <th>BARISTA ASIGNADO</th>
                                <th>ESTADO</th>
                                <th>TOTAL</th>
                                <th>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidos.map((pedido, index) => (
                                <tr key={index}>
                                    <td className="pedido-id">{pedido.id}</td>
                                    <td>{pedido.cliente}</td>
                                    <td>{pedido.productos}</td>
                                    <td>{pedido.barista}</td>
                                    <td>
                                        {pedido.estado && (
                                            <span className={`estado-badge ${pedido.estado === 'Listo' ? 'estado-listo' : 'estado-preparacion'}`}>
                                                {pedido.estado}
                                            </span>
                                        )}
                                    </td>
                                    <td className="pedido-total">{pedido.total}</td>
                                    <td>
                                        <div className="acciones-buttons">
                                            <button className="btn-action btn-ver">Ver</button>
                                            {pedido.estado === 'Listo' && (
                                                <button className="btn-action btn-entregar">Entregar</button>
                                            )}
                                            {pedido.estado === 'En Preparación' && (
                                                <button className="btn-action btn-asignar">Asignar</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}