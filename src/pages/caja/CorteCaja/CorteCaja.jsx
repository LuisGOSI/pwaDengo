import React, { useState } from 'react';
import './CorteCaja.css';

export const CorteCaja = () => {
    const [activeTab, setActiveTab] = useState('transacciones');
    const [filtros, setFiltros] = useState({
        fechaInicio: '',
        fechaFin: '',
        cajero: '',
        sucursal: ''
    });

    // Datos de ejemplo - transacciones
    const transacciones = [
        {
            id: 'TRX-001',
            fecha: '05/11/2025 09:30',
            cliente: 'María González',
            concepto: 'Mensualidad',
            metodo: 'efectivo',
            monto: 1500.00,
            estado: 'completado',
            cajero: 'Admin Master'
        },
        {
            id: 'TRX-002',
            fecha: '05/11/2025 10:15',
            cliente: 'Juan Pérez',
            concepto: 'Servicio',
            metodo: 'tarjeta',
            monto: 2800.00,
            estado: 'completado',
            cajero: 'Admin Master'
        },
        {
            id: 'TRX-003',
            fecha: '05/11/2025 11:00',
            cliente: 'Ana López',
            concepto: 'Producto',
            metodo: 'puntos',
            monto: 850.00,
            estado: 'completado',
            cajero: 'María González'
        },
        {
            id: 'TRX-004',
            fecha: '05/11/2025 11:45',
            cliente: 'Carlos Martínez',
            concepto: 'Suscripción',
            metodo: 'efectivo',
            monto: 3200.00,
            estado: 'completado',
            cajero: 'Admin Master'
        },
        {
            id: 'TRX-005',
            fecha: '05/11/2025 12:30',
            cliente: 'Luis Fernández',
            concepto: 'Mensualidad',
            metodo: 'tarjeta',
            monto: 1950.00,
            estado: 'pendiente',
            cajero: 'María González'
        }
    ];

    // Cálculos de resumen
    const calcularResumen = () => {
        const completadas = transacciones.filter(t => t.estado === 'completado');
        const totalIngresos = completadas.reduce((sum, t) => sum + t.monto, 0);
        const totalTransacciones = completadas.length;
        
        const porMetodo = {
            efectivo: completadas.filter(t => t.metodo === 'efectivo').reduce((sum, t) => sum + t.monto, 0),
            tarjeta: completadas.filter(t => t.metodo === 'tarjeta').reduce((sum, t) => sum + t.monto, 0),
            puntos: completadas.filter(t => t.metodo === 'puntos').reduce((sum, t) => sum + t.monto, 0)
        };

        return {
            totalIngresos,
            totalTransacciones,
            porMetodo,
            ticketPromedio: totalTransacciones > 0 ? totalIngresos / totalTransacciones : 0
        };
    };

    const resumen = calcularResumen();

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCerrarCaja = () => {
        if (window.confirm('¿Está seguro de cerrar la caja? Esta acción generará un reporte de cierre.')) {
            alert('Corte de caja generado exitosamente');
        }
    };

    const handleExportarReporte = () => {
        alert('Exportando reporte a PDF...');
    };

    const handleVerDetalle = (id) => {
        alert(`Ver detalles de transacción: ${id}`);
    };

    const handleImprimirTicket = (id) => {
        alert(`Imprimiendo ticket: ${id}`);
    };

    const formatMonto = (monto) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(monto);
    };

    return (
        <div className="corte-container">
            {/* Header */}
            <div className="corte-header">
                <div className="corte-title-section">
                    <h1 className="corte-title">Corte de Caja</h1>
                    <p className="corte-subtitle">Administración | Finanzas</p>
                </div>
                <div className="corte-actions">
                    <button className="btn-outline" onClick={handleExportarReporte}>
                        📄 Exportar Reporte
                    </button>
                    <button className="btn-primary" onClick={handleCerrarCaja}>
                        ✓ Cerrar Caja
                    </button>
                </div>
            </div>

            {/* Filtros */}
            <div className="corte-filters">
                <div className="filters-grid">
                    <div className="filter-group">
                        <label className="filter-label">Fecha Inicio</label>
                        <input
                            type="date"
                            name="fechaInicio"
                            value={filtros.fechaInicio}
                            onChange={handleFiltroChange}
                            className="filter-input"
                        />
                    </div>
                    <div className="filter-group">
                        <label className="filter-label">Fecha Fin</label>
                        <input
                            type="date"
                            name="fechaFin"
                            value={filtros.fechaFin}
                            onChange={handleFiltroChange}
                            className="filter-input"
                        />
                    </div>
                    <div className="filter-group">
                        <label className="filter-label">Cajero</label>
                        <select
                            name="cajero"
                            value={filtros.cajero}
                            onChange={handleFiltroChange}
                            className="filter-select"
                        >
                            <option value="">Todos</option>
                            <option value="admin">Admin Master</option>
                            <option value="maria">María González</option>
                            <option value="juan">Juan Pérez</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label className="filter-label">Sucursal</label>
                        <select
                            name="sucursal"
                            value={filtros.sucursal}
                            onChange={handleFiltroChange}
                            className="filter-select"
                        >
                            <option value="">Todas</option>
                            <option value="centro">Centro</option>
                            <option value="norte">Norte</option>
                            <option value="sur">Sur</option>
                        </select>
                    </div>
                </div>
                <button className="btn-filter">Filtrar</button>
            </div>

            {/* Cards de Resumen */}
            <div className="corte-summary">
                <div className="summary-card">
                    <div className="summary-header">
                        <div className="summary-icon icon-green">💰</div>
                    </div>
                    <div className="summary-label">Ingresos Totales</div>
                    <div className="summary-amount">{formatMonto(resumen.totalIngresos)}</div>
                    <div className="summary-detail">Hoy</div>
                </div>

                <div className="summary-card">
                    <div className="summary-header">
                        <div className="summary-icon icon-blue">📊</div>
                    </div>
                    <div className="summary-label">Total Transacciones</div>
                    <div className="summary-amount">{resumen.totalTransacciones}</div>
                    <div className="summary-detail">Completadas</div>
                </div>

                <div className="summary-card">
                    <div className="summary-header">
                        <div className="summary-icon icon-orange">🎯</div>
                    </div>
                    <div className="summary-label">Ticket Promedio</div>
                    <div className="summary-amount">{formatMonto(resumen.ticketPromedio)}</div>
                    <div className="summary-detail">Por transacción</div>
                </div>

                <div className="summary-card">
                    <div className="summary-header">
                        <div className="summary-icon icon-purple">⏰</div>
                    </div>
                    <div className="summary-label">Última Transacción</div>
                    <div className="summary-amount">12:30</div>
                    <div className="summary-detail">PM</div>
                </div>
            </div>

            {/* Contenido Principal */}
            <div className="corte-content">
                <div className="content-header">
                    <div>
                        <div className="content-title">Detalle de Operaciones</div>
                        <div className="content-subtitle">
                            Mostrando {transacciones.length} registros
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="corte-tabs">
                    <button
                        className={`tab-button ${activeTab === 'transacciones' ? 'active' : ''}`}
                        onClick={() => setActiveTab('transacciones')}
                    >
                        Transacciones
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'metodos' ? 'active' : ''}`}
                        onClick={() => setActiveTab('metodos')}
                    >
                        Por Método de Pago
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'cajeros' ? 'active' : ''}`}
                        onClick={() => setActiveTab('cajeros')}
                    >
                        Por Cajero
                    </button>
                </div>

                {/* Contenido de Tabs */}
                {activeTab === 'transacciones' && (
                    <div className="corte-table-container">
                        <table className="corte-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Fecha/Hora</th>
                                    <th>Cliente</th>
                                    <th>Concepto</th>
                                    <th>Método</th>
                                    <th>Monto</th>
                                    <th>Estado</th>
                                    <th>Cajero</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transacciones.map(trx => (
                                    <tr key={trx.id}>
                                        <td>{trx.id}</td>
                                        <td>{trx.fecha}</td>
                                        <td>{trx.cliente}</td>
                                        <td>{trx.concepto}</td>
                                        <td>
                                            <span className={`badge badge-${trx.metodo}`}>
                                                {trx.metodo === 'efectivo' ? '💵 Efectivo' : 
                                                 trx.metodo === 'tarjeta' ? '💳 Tarjeta' : 
                                                 '⭐ Puntos'}
                                            </span>
                                        </td>
                                        <td><strong>{formatMonto(trx.monto)}</strong></td>
                                        <td>
                                            <span className={`badge badge-${trx.estado}`}>
                                                {trx.estado === 'completado' ? 'Completado' : 'Pendiente'}
                                            </span>
                                        </td>
                                        <td>{trx.cajero}</td>
                                        <td>
                                            <div className="table-actions">
                                                <button 
                                                    className="btn-icon" 
                                                    onClick={() => handleVerDetalle(trx.id)}
                                                    title="Ver detalle"
                                                >
                                                    👁️
                                                </button>
                                                <button 
                                                    className="btn-icon" 
                                                    onClick={() => handleImprimirTicket(trx.id)}
                                                    title="Imprimir"
                                                >
                                                    🖨️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'metodos' && (
                    <div className="metodos-grid">
                        <div className="metodo-card">
                            <div className="metodo-nombre">💵 Efectivo</div>
                            <div className="metodo-monto">{formatMonto(resumen.porMetodo.efectivo)}</div>
                            <div className="metodo-transacciones">
                                {transacciones.filter(t => t.metodo === 'efectivo' && t.estado === 'completado').length} transacciones
                            </div>
                        </div>
                        <div className="metodo-card">
                            <div className="metodo-nombre">💳 Tarjeta</div>
                            <div className="metodo-monto">{formatMonto(resumen.porMetodo.tarjeta)}</div>
                            <div className="metodo-transacciones">
                                {transacciones.filter(t => t.metodo === 'tarjeta' && t.estado === 'completado').length} transacciones
                            </div>
                        </div>
                        <div className="metodo-card">
                            <div className="metodo-nombre">⭐ Puntos</div>
                            <div className="metodo-monto">{formatMonto(resumen.porMetodo.puntos)}</div>
                            <div className="metodo-transacciones">
                                {transacciones.filter(t => t.metodo === 'puntos' && t.estado === 'completado').length} transacciones
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'cajeros' && (
                    <div className="corte-table-container">
                        <table className="corte-table">
                            <thead>
                                <tr>
                                    <th>Cajero</th>
                                    <th>Transacciones</th>
                                    <th>Total Vendido</th>
                                    <th>Ticket Promedio</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Admin Master</td>
                                    <td>3</td>
                                    <td><strong>{formatMonto(7500.00)}</strong></td>
                                    <td>{formatMonto(2500.00)}</td>
                                </tr>
                                <tr>
                                    <td>María González</td>
                                    <td>2</td>
                                    <td><strong>{formatMonto(2800.00)}</strong></td>
                                    <td>{formatMonto(1400.00)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Totales */}
                <div className="corte-totals">
                    <div className="totals-row">
                        <span className="totals-label">Efectivo:</span>
                        <span className="totals-value">{formatMonto(resumen.porMetodo.efectivo)}</span>
                    </div>
                    <div className="totals-row">
                        <span className="totals-label">Tarjeta:</span>
                        <span className="totals-value">{formatMonto(resumen.porMetodo.tarjeta)}</span>
                    </div>
                    <div className="totals-row">
                        <span className="totals-label">Puntos:</span>
                        <span className="totals-value">{formatMonto(resumen.porMetodo.puntos)}</span>
                    </div>
                    <div className="totals-row totals-final">
                        <span className="totals-label">TOTAL GENERAL:</span>
                        <span className="totals-value">{formatMonto(resumen.totalIngresos)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};