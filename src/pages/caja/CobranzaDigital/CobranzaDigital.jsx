import React, { useState } from 'react';
import './CobranzaDigital.css';
import Sidebar from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../context/SidebarContext';
import { Outlet } from 'react-router-dom';

export const CobranzaDigital = () => {
    const { isOpen } = useSidebar();
    const [metodoPago, setMetodoPago] = useState('');
    const [formData, setFormData] = useState({
        clienteNombre: '',
        clienteEmail: '',
        clienteTelefono: '',
        concepto: '',
        monto: '',
        referencia: '',
        numeroTarjeta: '',
        nombreTarjeta: '',
        fechaVencimiento: '',
        cvv: '',
        puntosDisponibles: '5000',
        puntosUtilizar: ''
    });

    const handleMetodoPagoClick = (metodo) => {
        setMetodoPago(metodo);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Procesando pago...', { metodoPago, ...formData });
        alert(`Pago procesado exitosamente por ${metodoPago}`);
    };

    const handleCancel = () => {
        setMetodoPago('');
        setFormData({
            clienteNombre: '',
            clienteEmail: '',
            clienteTelefono: '',
            concepto: '',
            monto: '',
            referencia: '',
            numeroTarjeta: '',
            nombreTarjeta: '',
            fechaVencimiento: '',
            cvv: '',
            puntosDisponibles: '5000',
            puntosUtilizar: ''
        });
    };

    const calcularTotal = () => {
        const monto = parseFloat(formData.monto) || 0;
        const puntosUtilizados = parseFloat(formData.puntosUtilizar) || 0;
        const descuentoPuntos = metodoPago === 'puntos' ? puntosUtilizados : 0;
        return Math.max(0, monto - descuentoPuntos).toFixed(2);
    };

    return (
        <main className={`main-content ${!isOpen ? 'sidebar-closed' : ''}`}>
            <div className="cobranza-container">
                <Sidebar />
                <div className="cobranza-header">
                    <div>
                        <h1 className="cobranza-title">Cobranza Digital</h1>
                        <p className="cobranza-subtitle">Pagos | Transacciones</p>
                    </div>
                    <button className="btn-primary" onClick={handleCancel}>
                        <span>+</span>
                        Nuevo Pago
                    </button>
                </div>

                <div className="cobranza-content">
                    <form onSubmit={handleSubmit}>
                        {/* Información del Cliente */}
                        <div className="form-section">
                            <h2 className="section-title">Información del Cliente</h2>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Nombre Completo</label>
                                    <input
                                        type="text"
                                        name="clienteNombre"
                                        value={formData.clienteNombre}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="Ingrese el nombre"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        name="clienteEmail"
                                        value={formData.clienteEmail}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="correo@ejemplo.com"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Teléfono</label>
                                    <input
                                        type="tel"
                                        name="clienteTelefono"
                                        value={formData.clienteTelefono}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="(477) 123-4567"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Detalles del Pago */}
                        <div className="form-section">
                            <h2 className="section-title">Detalles del Pago</h2>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Concepto</label>
                                    <select
                                        name="concepto"
                                        value={formData.concepto}
                                        onChange={handleInputChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">Seleccione un concepto</option>
                                        <option value="servicio">Pago de Servicio</option>
                                        <option value="producto">Compra de Producto</option>
                                        <option value="mensualidad">Mensualidad</option>
                                        <option value="suscripcion">Suscripción</option>
                                        <option value="otro">Otro</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Monto (MXN)</label>
                                    <input
                                        type="number"
                                        name="monto"
                                        value={formData.monto}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Referencia</label>
                                    <input
                                        type="text"
                                        name="referencia"
                                        value={formData.referencia}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="REF-001"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Método de Pago */}
                        <div className="form-section">
                            <h2 className="section-title">Método de Pago</h2>
                            <div className="payment-methods">
                                <div
                                    className={`payment-card ${metodoPago === 'efectivo' ? 'active' : ''}`}
                                    onClick={() => handleMetodoPagoClick('efectivo')}
                                >
                                    <div className="payment-icon">💵</div>
                                    <div className="payment-label">Efectivo</div>
                                </div>
                                <div
                                    className={`payment-card ${metodoPago === 'tarjeta' ? 'active' : ''}`}
                                    onClick={() => handleMetodoPagoClick('tarjeta')}
                                >
                                    <div className="payment-icon">💳</div>
                                    <div className="payment-label">Tarjeta</div>
                                </div>
                                <div
                                    className={`payment-card ${metodoPago === 'puntos' ? 'active' : ''}`}
                                    onClick={() => handleMetodoPagoClick('puntos')}
                                >
                                    <div className="payment-icon">⭐</div>
                                    <div className="payment-label">Puntos</div>
                                </div>
                            </div>

                            {/* Detalles de Tarjeta */}
                            {metodoPago === 'tarjeta' && (
                                <div className="payment-details">
                                    <div className="alert alert-info">
                                        <span>ℹ️</span>
                                        <span>Ingrese los datos de la tarjeta de crédito o débito</span>
                                    </div>
                                    <div className="form-grid">
                                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                            <label className="form-label">Número de Tarjeta</label>
                                            <input
                                                type="text"
                                                name="numeroTarjeta"
                                                value={formData.numeroTarjeta}
                                                onChange={handleInputChange}
                                                className="form-input"
                                                placeholder="1234 5678 9012 3456"
                                                maxLength="19"
                                                required={metodoPago === 'tarjeta'}
                                            />
                                        </div>
                                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                            <label className="form-label">Nombre en la Tarjeta</label>
                                            <input
                                                type="text"
                                                name="nombreTarjeta"
                                                value={formData.nombreTarjeta}
                                                onChange={handleInputChange}
                                                className="form-input"
                                                placeholder="Como aparece en la tarjeta"
                                                required={metodoPago === 'tarjeta'}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Fecha de Vencimiento</label>
                                            <input
                                                type="text"
                                                name="fechaVencimiento"
                                                value={formData.fechaVencimiento}
                                                onChange={handleInputChange}
                                                className="form-input"
                                                placeholder="MM/AA"
                                                maxLength="5"
                                                required={metodoPago === 'tarjeta'}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">CVV</label>
                                            <input
                                                type="text"
                                                name="cvv"
                                                value={formData.cvv}
                                                onChange={handleInputChange}
                                                className="form-input"
                                                placeholder="123"
                                                maxLength="4"
                                                required={metodoPago === 'tarjeta'}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Detalles de Puntos */}
                            {metodoPago === 'puntos' && (
                                <div className="payment-details">
                                    <div className="alert alert-info">
                                        <span>⭐</span>
                                        <span>Puntos disponibles: {formData.puntosDisponibles} pts (1 punto = $1.00 MXN)</span>
                                    </div>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label className="form-label">Puntos a Utilizar</label>
                                            <input
                                                type="number"
                                                name="puntosUtilizar"
                                                value={formData.puntosUtilizar}
                                                onChange={handleInputChange}
                                                className="form-input"
                                                placeholder="0"
                                                max={formData.puntosDisponibles}
                                                min="0"
                                                required={metodoPago === 'puntos'}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Información de Efectivo */}
                            {metodoPago === 'efectivo' && (
                                <div className="payment-details">
                                    <div className="alert alert-info">
                                        <span>💵</span>
                                        <span>El pago en efectivo será registrado al confirmar la transacción</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Resumen */}
                        {formData.monto && metodoPago && (
                            <div className="summary-section">
                                <h2 className="section-title">Resumen del Pago</h2>
                                <div className="summary-row">
                                    <span className="summary-label">Subtotal:</span>
                                    <span className="summary-value">${parseFloat(formData.monto || 0).toFixed(2)} MXN</span>
                                </div>
                                {metodoPago === 'puntos' && formData.puntosUtilizar && (
                                    <div className="summary-row">
                                        <span className="summary-label">Descuento con Puntos:</span>
                                        <span className="summary-value">-${parseFloat(formData.puntosUtilizar || 0).toFixed(2)} MXN</span>
                                    </div>
                                )}
                                <div className="summary-row summary-total">
                                    <span className="summary-label">Total a Pagar:</span>
                                    <span className="summary-value">${calcularTotal()} MXN</span>
                                </div>
                            </div>
                        )}

                        {/* Botones de Acción */}
                        <div className="form-actions">
                            <button type="button" className="btn-secondary" onClick={handleCancel}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn-success" disabled={!metodoPago}>
                                Procesar Pago
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Outlet />
        </main>
    );
};