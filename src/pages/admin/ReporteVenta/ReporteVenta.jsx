import React, { useState } from 'react';
import './ReporteVenta.css';
import { useSidebar } from '../../../context/SidebarContext';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../../components/layout/Sidebar';

export const ReporteVenta = () => {
    const [searchTab, setSearchTab] = useState('periodo');
    const [searchTerm, setSearchTerm] = useState('');
    const { isOpen } = useSidebar();

    const [filtros, setFiltros] = useState({
        fechaInicio: '',
        fechaFin: '',
        producto: '',
        categoria: '',
        sucursal: '',
        estado: ''
    });

    // Datos de ejemplo - Ventas
    const ventasData = [
        {
            id: 'VNT-001',
            fecha: '05/11/2025',
            producto: 'Laptop HP',
            categoria: 'Electrónica',
            cantidad: 2,
            precioUnitario: 15000.00,
            total: 30000.00,
            sucursal: 'Centro',
            cliente: 'María González',
            estado: 'completado'
        },
        {
            id: 'VNT-002',
            fecha: '05/11/2025',
            producto: 'Mouse Logitech',
            categoria: 'Accesorios',
            cantidad: 5,
            precioUnitario: 450.00,
            total: 2250.00,
            sucursal: 'Norte',
            cliente: 'Juan Pérez',
            estado: 'completado'
        },
        {
            id: 'VNT-003',
            fecha: '05/11/2025',
            producto: 'Teclado Mecánico',
            categoria: 'Accesorios',
            cantidad: 3,
            precioUnitario: 1200.00,
            total: 3600.00,
            sucursal: 'Centro',
            cliente: 'Ana López',
            estado: 'completado'
        },
        {
            id: 'VNT-004',
            fecha: '04/11/2025',
            producto: 'Monitor Samsung',
            categoria: 'Electrónica',
            cantidad: 1,
            precioUnitario: 5500.00,
            total: 5500.00,
            sucursal: 'Sur',
            cliente: 'Carlos Martínez',
            estado: 'pendiente'
        },
        {
            id: 'VNT-005',
            fecha: '04/11/2025',
            producto: 'Audífonos Sony',
            categoria: 'Audio',
            cantidad: 4,
            precioUnitario: 2800.00,
            total: 11200.00,
            sucursal: 'Norte',
            cliente: 'Luis Fernández',
            estado: 'completado'
        },
        {
            id: 'VNT-006',
            fecha: '04/11/2025',
            producto: 'Tablet Samsung',
            categoria: 'Electrónica',
            cantidad: 2,
            precioUnitario: 8500.00,
            total: 17000.00,
            sucursal: 'Centro',
            cliente: 'Patricia Silva',
            estado: 'completado'
        }
    ];

    // Cálculos de métricas
    const calcularMetricas = () => {
        const ventasCompletadas = ventasData.filter(v => v.estado === 'completado');
        const totalVentas = ventasCompletadas.reduce((sum, v) => sum + v.total, 0);
        const totalTransacciones = ventasCompletadas.length;
        const totalUnidades = ventasCompletadas.reduce((sum, v) => sum + v.cantidad, 0);
        const ticketPromedio = totalTransacciones > 0 ? totalVentas / totalTransacciones : 0;

        return {
            totalVentas,
            totalTransacciones,
            totalUnidades,
            ticketPromedio,
            crecimiento: 12.5 // Porcentaje de ejemplo
        };
    };

    const metricas = calcularMetricas();

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBuscar = () => {
        console.log('Buscando con filtros:', filtros);
        alert('Búsqueda realizada');
    };

    const handleLimpiar = () => {
        setFiltros({
            fechaInicio: '',
            fechaFin: '',
            producto: '',
            categoria: '',
            sucursal: '',
            estado: ''
        });
    };

    const handleExportar = (formato) => {
        alert(`Exportando reporte en formato ${formato.toUpperCase()}`);
    };

    const formatMonto = (monto) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(monto);
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('es-MX').format(num);
    };

    const getProductIcon = (categoria) => {
        const icons = {
            'Electrónica': '💻',
            'Accesorios': '🖱️',
            'Audio': '🎧'
        };
        return icons[categoria] || '📦';
    };

    return (
        <main className={`main-content ${!isOpen ? 'sidebar-closed' : ''}`}>
            <div className="reporte-container">
                <Sidebar />
                <div className="reporte-header">
                    <div className="reporte-title-section">
                        <h1 className="reporte-title">Reporte de Ventas</h1>
                        <p className="reporte-subtitle">Análisis | Consultas</p>
                    </div>
                    <div className="reporte-actions">
                        <button
                            className="btn-icon-only"
                            onClick={() => handleExportar('pdf')}
                            title="Exportar PDF"
                        >
                            📄
                        </button>
                        <button
                            className="btn-icon-only"
                            onClick={() => handleExportar('excel')}
                            title="Exportar Excel"
                        >
                            📊
                        </button>
                        <button
                            className="btn-icon-only"
                            title="Imprimir"
                        >
                            🖨️
                        </button>
                        <button className="btn-primary">
                            + Nueva Venta
                        </button>
                    </div>
                </div>

                {/* Panel de Búsqueda */}
                <div className="reporte-search-panel">
                    <h2 className="search-panel-title">Consultar Ventas</h2>

                    {/* Tabs de Búsqueda */}
                    <div className="search-tabs">
                        <button
                            className={`search-tab ${searchTab === 'periodo' ? 'active' : ''}`}
                            onClick={() => setSearchTab('periodo')}
                        >
                            📅 Por Periodo
                        </button>
                        <button
                            className={`search-tab ${searchTab === 'producto' ? 'active' : ''}`}
                            onClick={() => setSearchTab('producto')}
                        >
                            📦 Por Producto
                        </button>
                        <button
                            className={`search-tab ${searchTab === 'sucursal' ? 'active' : ''}`}
                            onClick={() => setSearchTab('sucursal')}
                        >
                            🏢 Por Sucursal
                        </button>
                    </div>

                    {/* Formulario de Búsqueda - Por Periodo */}
                    {searchTab === 'periodo' && (
                        <div className="search-form-grid">
                            <div className="form-group">
                                <label className="form-label">Fecha Inicio</label>
                                <input
                                    type="date"
                                    name="fechaInicio"
                                    value={filtros.fechaInicio}
                                    onChange={handleFiltroChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Fecha Fin</label>
                                <input
                                    type="date"
                                    name="fechaFin"
                                    value={filtros.fechaFin}
                                    onChange={handleFiltroChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Sucursal</label>
                                <select
                                    name="sucursal"
                                    value={filtros.sucursal}
                                    onChange={handleFiltroChange}
                                    className="form-select"
                                >
                                    <option value="">Todas las sucursales</option>
                                    <option value="centro">Centro</option>
                                    <option value="norte">Norte</option>
                                    <option value="sur">Sur</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Estado</label>
                                <select
                                    name="estado"
                                    value={filtros.estado}
                                    onChange={handleFiltroChange}
                                    className="form-select"
                                >
                                    <option value="">Todos</option>
                                    <option value="completado">Completado</option>
                                    <option value="pendiente">Pendiente</option>
                                    <option value="cancelado">Cancelado</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Formulario de Búsqueda - Por Producto */}
                    {searchTab === 'producto' && (
                        <div className="search-form-grid">
                            <div className="form-group">
                                <label className="form-label">Producto</label>
                                <input
                                    type="text"
                                    name="producto"
                                    value={filtros.producto}
                                    onChange={handleFiltroChange}
                                    className="form-input"
                                    placeholder="Nombre del producto"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Categoría</label>
                                <select
                                    name="categoria"
                                    value={filtros.categoria}
                                    onChange={handleFiltroChange}
                                    className="form-select"
                                >
                                    <option value="">Todas las categorías</option>
                                    <option value="electronica">Electrónica</option>
                                    <option value="accesorios">Accesorios</option>
                                    <option value="audio">Audio</option>
                                    <option value="gaming">Gaming</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Fecha Inicio</label>
                                <input
                                    type="date"
                                    name="fechaInicio"
                                    value={filtros.fechaInicio}
                                    onChange={handleFiltroChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Fecha Fin</label>
                                <input
                                    type="date"
                                    name="fechaFin"
                                    value={filtros.fechaFin}
                                    onChange={handleFiltroChange}
                                    className="form-input"
                                />
                            </div>
                        </div>
                    )}

                    {/* Formulario de Búsqueda - Por Sucursal */}
                    {searchTab === 'sucursal' && (
                        <div className="search-form-grid">
                            <div className="form-group">
                                <label className="form-label">Sucursal</label>
                                <select
                                    name="sucursal"
                                    value={filtros.sucursal}
                                    onChange={handleFiltroChange}
                                    className="form-select"
                                >
                                    <option value="">Seleccione una sucursal</option>
                                    <option value="centro">Centro</option>
                                    <option value="norte">Norte</option>
                                    <option value="sur">Sur</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Fecha Inicio</label>
                                <input
                                    type="date"
                                    name="fechaInicio"
                                    value={filtros.fechaInicio}
                                    onChange={handleFiltroChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Fecha Fin</label>
                                <input
                                    type="date"
                                    name="fechaFin"
                                    value={filtros.fechaFin}
                                    onChange={handleFiltroChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Categoría</label>
                                <select
                                    name="categoria"
                                    value={filtros.categoria}
                                    onChange={handleFiltroChange}
                                    className="form-select"
                                >
                                    <option value="">Todas las categorías</option>
                                    <option value="electronica">Electrónica</option>
                                    <option value="accesorios">Accesorios</option>
                                    <option value="audio">Audio</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Botones de Acción */}
                    <div className="search-actions">
                        <button className="btn-secondary" onClick={handleLimpiar}>
                            Limpiar
                        </button>
                        <button className="btn-search" onClick={handleBuscar}>
                            🔍 Buscar
                        </button>
                    </div>
                </div>

                {/* Cards de Métricas */}
                <div className="reporte-metrics">
                    <div className="metric-card">
                        <div className="metric-header">
                            <div className="metric-icon icon-green">💰</div>
                            <div className="metric-trend trend-up">
                                ↑ {metricas.crecimiento}%
                            </div>
                        </div>
                        <div className="metric-label">Ventas Totales</div>
                        <div className="metric-value">{formatMonto(metricas.totalVentas)}</div>
                        <div className="metric-detail">Últimos 7 días</div>
                    </div>

                    <div className="metric-card">
                        <div className="metric-header">
                            <div className="metric-icon icon-blue">📊</div>
                        </div>
                        <div className="metric-label">Transacciones</div>
                        <div className="metric-value">{formatNumber(metricas.totalTransacciones)}</div>
                        <div className="metric-detail">Ventas completadas</div>
                    </div>

                    <div className="metric-card">
                        <div className="metric-header">
                            <div className="metric-icon icon-orange">📦</div>
                        </div>
                        <div className="metric-label">Unidades Vendidas</div>
                        <div className="metric-value">{formatNumber(metricas.totalUnidades)}</div>
                        <div className="metric-detail">Total de productos</div>
                    </div>

                    <div className="metric-card">
                        <div className="metric-header">
                            <div className="metric-icon icon-purple">🎯</div>
                        </div>
                        <div className="metric-label">Ticket Promedio</div>
                        <div className="metric-value">{formatMonto(metricas.ticketPromedio)}</div>
                        <div className="metric-detail">Por transacción</div>
                    </div>
                </div>

                {/* Gráficas */}
                <div className="reporte-charts">
                    <div className="chart-card">
                        <div className="chart-header">
                            <div className="chart-title">📈 Ventas por Día</div>
                        </div>
                        <div className="chart-placeholder">
                            Gráfica de líneas - Ventas diarias
                        </div>
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <div className="chart-title">🥧 Ventas por Categoría</div>
                        </div>
                        <div className="chart-placeholder">
                            Gráfica circular - Distribución por categoría
                        </div>
                    </div>
                </div>

                {/* Tabla de Datos */}
                <div className="reporte-table-section">
                    <div className="table-header">
                        <div className="table-title">Detalle de Ventas</div>
                        <div className="table-controls">
                            <input
                                type="text"
                                className="search-input"
                                placeholder="🔍 Buscar en la tabla..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="reporte-table-container">
                        <table className="reporte-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Fecha</th>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unit.</th>
                                    <th>Total</th>
                                    <th>Sucursal</th>
                                    <th>Cliente</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ventasData.map(venta => (
                                    <tr key={venta.id}>
                                        <td><strong>{venta.id}</strong></td>
                                        <td>{venta.fecha}</td>
                                        <td>
                                            <div className="product-info">
                                                <div className="product-image">
                                                    {getProductIcon(venta.categoria)}
                                                </div>
                                                <div className="product-details">
                                                    <div className="product-name">{venta.producto}</div>
                                                    <div className="product-category">{venta.categoria}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{venta.cantidad}</td>
                                        <td>{formatMonto(venta.precioUnitario)}</td>
                                        <td><strong>{formatMonto(venta.total)}</strong></td>
                                        <td>{venta.sucursal}</td>
                                        <td>{venta.cliente}</td>
                                        <td>
                                            <span className={`badge badge-${venta.estado === 'completado' ? 'success' : 'warning'}`}>
                                                {venta.estado === 'completado' ? '✓ Completado' : '⏳ Pendiente'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer de Tabla con Paginación */}
                    <div className="table-footer">
                        <div className="pagination-info">
                            Mostrando 1-6 de 6 registros
                        </div>
                        <div className="pagination">
                            <button className="pagination-btn" disabled>
                                ‹
                            </button>
                            <button className="pagination-btn active">1</button>
                            <button className="pagination-btn">2</button>
                            <button className="pagination-btn">3</button>
                            <button className="pagination-btn">
                                ›
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Outlet />
        </main>
    );
};