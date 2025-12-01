import React, { useState, useEffect } from 'react';
import './CorteCaja.css';
import Sidebar from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../context/SidebarContext';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../../services/AuthContext';

export const CorteCaja = () => {
    const { isOpen } = useSidebar();
    const { userData } = useAuth();
    const [transacciones, setTransacciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fechaFiltro, setFechaFiltro] = useState(() => {

        const hoy = new Date();
        const año = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, '0');
        const dia = String(hoy.getDate()).padStart(2, '0');
        return `${año}-${mes}-${dia}`;
    });

    const API_URL = 'https://dengo-back.onrender.com/api';

    useEffect(() => {
        cargarTransacciones();
    }, [fechaFiltro]);

    const cargarTransacciones = async () => {
        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/pedidos/?por_pagina=100&sucursal_id=${userData.sucursal_personal_id}`);

            if (!response.ok) {
                console.error("Error respuesta servidor");
                return;
            }

            const result = await response.json();

            if (result.pedidos) {
                const pedidosArray = Array.isArray(result.pedidos) ? result.pedidos : [result.pedidos];

                const fechaSeleccionada = new Date(fechaFiltro + 'T00:00:00');
                console.log('Fecha Seleccionada:', fechaSeleccionada);
                console.log('Fecha Seleccionada (formato legible):', fechaSeleccionada.toLocaleString('es-MX'));


                const transaccionesFormateadas = pedidosArray
                    .filter(pedido => pedido.pagos && pedido.pagos.length > 0)
                    .flatMap(pedido =>
                        pedido.pagos.map(pago => {
                            
                            let nombreCliente = 'Cliente General';
                            if (pedido.usuarios) {
                                const nombre = pedido.usuarios.nombre || '';
                                const apellidos = pedido.usuarios.apellidos || '';
                                nombreCliente = `${nombre} ${apellidos}`.trim();
                            }

                            return {
                                id: pago.referencia_transaccion,
                                fecha: new Date(pago.creado_en).toLocaleString('es-MX', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                }),
                                fechaObj: new Date(pago.creado_en), // Guardar fecha como objeto para filtrar
                                cliente: nombreCliente,
                                metodo: pago.metodo,
                                monto: parseFloat(pago.monto),
                                estado: pedido.estado === 'entregado' ? 'completado' : 'pendiente'
                            };
                        })
                    )
                    // Filtrar solo las transacciones de la fecha seleccionada
                    .filter(transaccion => {
                        const fechaTransaccion = new Date(transaccion.fechaObj);
                        const fechaTrx = new Date(fechaTransaccion.getFullYear(), fechaTransaccion.getMonth(), fechaTransaccion.getDate());
                        const fechaFiltrada = new Date(fechaSeleccionada.getFullYear(), fechaSeleccionada.getMonth(), fechaSeleccionada.getDate());
                        return fechaTrx.getTime() === fechaFiltrada.getTime();
                    });

                setTransacciones(transaccionesFormateadas);
            }
        } catch (error) {
            console.error('Error al cargar transacciones:', error);
            setTransacciones([]);
        } finally {
            setLoading(false);
        }
    };

    const calcularResumen = () => {
        const completadas = transacciones.filter(t => t.estado === 'completado');
        const pendientes = transacciones.filter(t => t.estado === 'pendiente');
        const totalIngresos = completadas.reduce((sum, t) => sum + t.monto, 0);
        const totalPendiente = pendientes.reduce((sum, t) => sum + t.monto, 0);
        const totalTransacciones = completadas.length;

        const porMetodo = {
            efectivo: completadas.filter(t => t.metodo === 'efectivo').reduce((sum, t) => sum + t.monto, 0),
            tarjeta: completadas.filter(t => t.metodo === 'tarjeta').reduce((sum, t) => sum + t.monto, 0),
            puntos: completadas.filter(t => t.metodo === 'puntos').reduce((sum, t) => sum + t.monto, 0)
        };

        const transaccionesPorMetodo = {
            efectivo: completadas.filter(t => t.metodo === 'efectivo').length,
            tarjeta: completadas.filter(t => t.metodo === 'tarjeta').length,
            puntos: completadas.filter(t => t.metodo === 'puntos').length
        };

        let ultimaTransaccion = '--:--';
        if (completadas.length > 0) {
            const fecha = completadas[0].fecha.split(' ')[1] || '--:--';
            ultimaTransaccion = fecha;
        }

        return {
            totalIngresos,
            totalPendiente,
            totalTransacciones,
            porMetodo,
            transaccionesPorMetodo,
            ticketPromedio: totalTransacciones > 0 ? totalIngresos / totalTransacciones : 0,
            ultimaTransaccion
        };
    };

    const resumen = calcularResumen();

    const formatMonto = (monto) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(monto);
    };

    if (loading) {
        return (
            <main className={`main-content ${!isOpen ? 'sidebar-closed' : ''}`}>
                <div className="corte-container">
                    <Sidebar />
                    <div className="corte-header">
                        <h1 className="corte-title">Corte de Caja</h1>
                        <p className="corte-subtitle">Cargando datos...</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className={`main-content ${!isOpen ? 'sidebar-closed' : ''}`}>
            <div className="corte-container">
                <Sidebar />
                <div className="corte-header">
                    <div className="corte-title-section">
                        <h1 className="corte-title">Corte de Caja</h1>
                        <p className="corte-subtitle">Operaciones | Corte de caja</p>
                    </div>
                    <div className="corte-filter">
                        <label htmlFor="fechaFiltro" style={{ marginRight: '10px', fontWeight: '500' }}>
                            Filtrar Fecha:
                        </label>
                        <input
                            type="date"
                            id="fechaFiltro"
                            value={fechaFiltro}
                            onChange={(e) => setFechaFiltro(e.target.value)}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '6px',
                                border: '1px solid #ddd',
                                fontSize: '14px',
                                cursor: 'pointer'
                            }}
                        />
                    </div>
                </div>

                {/* Cards de Resumen */}
                <div className="corte-summary">
                    <div className="summary-card">
                        <div className="summary-header">
                            <div className="summary-icon icon-green">💰</div>
                        </div>
                        <div className="summary-label">Ingresos Totales</div>
                        <div className="summary-amount">{formatMonto(resumen.totalIngresos)}</div> <br />
                        <div className="summary-detail">
                            Ingresos Pendientes: {formatMonto(resumen.totalPendiente)}
                        </div>
                    </div>

                    <div className="summary-card">
                        <div className="summary-header">
                            <div className="summary-icon icon-blue">📊</div>
                        </div>
                        <div className="summary-label">Total Transacciones Completadas</div>
                        <div className="summary-amount">{resumen.totalTransacciones}</div>
                        <div className="summary-detail">
                            💵 Efectivo: {resumen.transaccionesPorMetodo.efectivo} |
                            💳 Tarjeta: {resumen.transaccionesPorMetodo.tarjeta} | <br />
                            ⭐ Puntos: {resumen.transaccionesPorMetodo.puntos}
                        </div>
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
                        <div className="summary-amount">{resumen.ultimaTransaccion}</div>
                        <div className="summary-detail">Hora</div>
                    </div>
                </div>

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
                </div>

                {/* Contenido Principal */}
                <div className="corte-content">
                    <div className="content-header">
                        <div>
                            <div className="content-title">Detalle de Operaciones</div>
                            <div className="content-subtitle">
                                Mostrando {transacciones.length} registros | Total: {formatMonto(transacciones.reduce((sum, t) => sum + t.monto, 0))}
                            </div>
                        </div>
                    </div>

                    {/* Tabla única sin tabs */}
                    <div className="corte-table-container">
                        {transacciones.length === 0 ? (
                            <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                                No hay transacciones registradas
                            </p>
                        ) : (
                            <>
                                <table className="corte-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Fecha/Hora</th>
                                            <th>Cliente</th>
                                            <th>Método</th>
                                            <th>Monto</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transacciones.map(trx => (
                                            <tr key={trx.id}>
                                                <td>{trx.id}</td>
                                                <td>{trx.fecha}</td>
                                                <td>{trx.cliente}</td>
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
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Outlet />
        </main>
    );
};