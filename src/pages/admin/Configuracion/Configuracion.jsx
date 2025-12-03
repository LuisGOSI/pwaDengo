import React, { useState } from 'react';
import './Configuracion.css';
import Sidebar from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../context/SidebarContext';
import { Outlet } from 'react-router-dom';

export const Configuracion = () => {
    const { isOpen } = useSidebar();
    const [perfilData, setPerfilData] = useState({
        nombre: 'Juan Pérez',
        email: 'juan.perez@cafeteria.com',
        telefono: '+52 477 123 4567',
        rol: 'Administrador',
        sucursal: 'Centro'
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [notificaciones, setNotificaciones] = useState({
        email: true,
        push: true,
        ventas: false,
        inventario: true,
        reportes: true
    });

    const handlePerfilChange = (e) => {
        const { name, value } = e.target;
        setPerfilData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNotificacionChange = (e) => {
        const { name, checked } = e.target;
        setNotificaciones(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleGuardarPerfil = () => {
        alert('Perfil actualizado correctamente');
    };

    const handleCambiarPassword = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
        if (passwordData.newPassword.length < 8) {
            alert('La contraseña debe tener al menos 8 caracteres');
            return;
        }
        alert('Contraseña cambiada correctamente');
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    const handleGuardarNotificaciones = () => {
        alert('Preferencias de notificaciones guardadas');
    };

    const getPasswordStrength = (password) => {
        if (!password) return { text: '', class: '' };
        if (password.length < 6) return { text: 'Débil', class: 'debil' };
        if (password.length < 10) return { text: 'Media', class: 'media' };
        return { text: 'Fuerte', class: 'fuerte' };
    };

    const strength = getPasswordStrength(passwordData.newPassword);

    return (
        <main className={`main-content ${!isOpen ? 'sidebar-closed' : ''}`}>
            <div className="configuracion-container">
                <Sidebar />
                <div className="configuracion-header">
                    <div className="configuracion-header-left">
                        <h1 className="configuracion-titulo">Configuración</h1>
                        <p className="configuracion-breadcrumb">Cuenta / Configuración</p>
                    </div>
                </div>

                <div className="configuracion-content">
                    {/* Columna Izquierda */}
                    <div className="configuracion-columna-izquierda">
                        {/* Información del Perfil */}
                        <div className="config-card">
                            <div className="card-header">
                                <h2 className="card-titulo">Información del Perfil</h2>
                                <p className="card-subtitulo">Actualiza tu información personal</p>
                            </div>

                            <div className="card-body">
                                <div className="perfil-avatar-section">
                                    <div className="perfil-avatar-grande">
                                        {perfilData.nombre.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </div>
                                    <div className="perfil-avatar-info">
                                        <p className="avatar-nombre">{perfilData.nombre}</p>
                                        <p className="avatar-rol">{perfilData.rol}</p>
                                        <button className="btn-cambiar-foto">Cambiar foto</button>
                                    </div>
                                </div>

                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Nombre completo</label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            className="form-input"
                                            value={perfilData.nombre}
                                            onChange={handlePerfilChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Correo electrónico</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-input"
                                            value={perfilData.email}
                                            onChange={handlePerfilChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Teléfono</label>
                                        <input
                                            type="tel"
                                            name="telefono"
                                            className="form-input"
                                            value={perfilData.telefono}
                                            onChange={handlePerfilChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Sucursal</label>
                                        <select
                                            name="sucursal"
                                            className="form-select"
                                            value={perfilData.sucursal}
                                            onChange={handlePerfilChange}
                                        >
                                            <option value="Centro">Centro</option>
                                            <option value="Norte">Norte</option>
                                            <option value="Sur">Sur</option>
                                            <option value="Plaza">Plaza</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="card-actions">
                                    <button className="btn-guardar" onClick={handleGuardarPerfil}>
                                        Guardar cambios
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Notificaciones */}
                        <div className="config-card">
                            <div className="card-header">
                                <h2 className="card-titulo">Notificaciones</h2>
                                <p className="card-subtitulo">Administra cómo recibes las notificaciones</p>
                            </div>

                            <div className="card-body">
                                <div className="notificacion-item">
                                    <div className="notificacion-info">
                                        <p className="notificacion-titulo">Notificaciones por Email</p>
                                        <p className="notificacion-desc">Recibe actualizaciones por correo electrónico</p>
                                    </div>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            name="email"
                                            checked={notificaciones.email}
                                            onChange={handleNotificacionChange}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>

                                <div className="notificacion-item">
                                    <div className="notificacion-info">
                                        <p className="notificacion-titulo">Notificaciones Push</p>
                                        <p className="notificacion-desc">Recibe notificaciones en el navegador</p>
                                    </div>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            name="push"
                                            checked={notificaciones.push}
                                            onChange={handleNotificacionChange}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>

                                <div className="notificacion-item">
                                    <div className="notificacion-info">
                                        <p className="notificacion-titulo">Alertas de Ventas</p>
                                        <p className="notificacion-desc">Notificaciones sobre nuevas ventas</p>
                                    </div>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            name="ventas"
                                            checked={notificaciones.ventas}
                                            onChange={handleNotificacionChange}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>

                                <div className="notificacion-item">
                                    <div className="notificacion-info">
                                        <p className="notificacion-titulo">Alertas de Inventario</p>
                                        <p className="notificacion-desc">Notificaciones de stock bajo</p>
                                    </div>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            name="inventario"
                                            checked={notificaciones.inventario}
                                            onChange={handleNotificacionChange}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>

                                <div className="notificacion-item">
                                    <div className="notificacion-info">
                                        <p className="notificacion-titulo">Reportes Semanales</p>
                                        <p className="notificacion-desc">Resumen semanal de actividad</p>
                                    </div>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            name="reportes"
                                            checked={notificaciones.reportes}
                                            onChange={handleNotificacionChange}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>

                                <div className="card-actions">
                                    <button className="btn-guardar" onClick={handleGuardarNotificaciones}>
                                        Guardar preferencias
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha - Seguridad */}
                    <div className="configuracion-columna-derecha">
                        <div className="config-card">
                            <div className="card-header">
                                <h2 className="card-titulo">Cambiar Contraseña</h2>
                                <p className="card-subtitulo">Actualiza tu contraseña de forma segura</p>
                            </div>

                            <div className="card-body">
                                <div className="form-group">
                                    <label>Contraseña actual</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showPasswords.current ? "text" : "password"}
                                            name="currentPassword"
                                            className="form-input"
                                            placeholder="Ingresa tu contraseña actual"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                        />
                                        <button
                                            className="btn-toggle-password"
                                            onClick={() => togglePasswordVisibility('current')}
                                            type="button"
                                        >
                                            {showPasswords.current ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Nueva contraseña</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showPasswords.new ? "text" : "password"}
                                            name="newPassword"
                                            className="form-input"
                                            placeholder="Ingresa tu nueva contraseña"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                        />
                                        <button
                                            className="btn-toggle-password"
                                            onClick={() => togglePasswordVisibility('new')}
                                            type="button"
                                        >
                                            {showPasswords.new ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                    {passwordData.newPassword && (
                                        <div className="password-strength">
                                            <div className={`strength-bar ${strength.class}`}></div>
                                            <span className={`strength-text ${strength.class}`}>
                                                {strength.text}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Confirmar nueva contraseña</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showPasswords.confirm ? "text" : "password"}
                                            name="confirmPassword"
                                            className="form-input"
                                            placeholder="Confirma tu nueva contraseña"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                        />
                                        <button
                                            className="btn-toggle-password"
                                            onClick={() => togglePasswordVisibility('confirm')}
                                            type="button"
                                        >
                                            {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                </div>

                                <div className="password-requirements">
                                    <p className="requirements-titulo">La contraseña debe contener:</p>
                                    <ul className="requirements-lista">
                                        <li className={passwordData.newPassword.length >= 8 ? 'valido' : ''}>
                                            Mínimo 8 caracteres
                                        </li>
                                        <li className={/[A-Z]/.test(passwordData.newPassword) ? 'valido' : ''}>
                                            Una letra mayúscula
                                        </li>
                                        <li className={/[a-z]/.test(passwordData.newPassword) ? 'valido' : ''}>
                                            Una letra minúscula
                                        </li>
                                        <li className={/[0-9]/.test(passwordData.newPassword) ? 'valido' : ''}>
                                            Un número
                                        </li>
                                    </ul>
                                </div>

                                <div className="card-actions">
                                    <button className="btn-guardar" onClick={handleCambiarPassword}>
                                        Cambiar contraseña
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Sesiones Activas */}
                        <div className="config-card">
                            <div className="card-header">
                                <h2 className="card-titulo">Sesiones Activas</h2>
                                <p className="card-subtitulo">Administra tus sesiones abiertas</p>
                            </div>

                            <div className="card-body">
                                <div className="sesion-item sesion-actual">
                                    <div className="sesion-icono">💻</div>
                                    <div className="sesion-info">
                                        <p className="sesion-dispositivo">Chrome en Windows</p>
                                        <p className="sesion-ubicacion">León, Guanajuato • Ahora</p>
                                    </div>
                                    <span className="sesion-badge">Actual</span>
                                </div>

                                <div className="sesion-item">
                                    <div className="sesion-icono">📱</div>
                                    <div className="sesion-info">
                                        <p className="sesion-dispositivo">Safari en iPhone</p>
                                        <p className="sesion-ubicacion">León, Guanajuato • Hace 2 horas</p>
                                    </div>
                                    <button className="btn-cerrar-sesion">Cerrar</button>
                                </div>

                                <div className="card-actions">
                                    <button className="btn-secundario">
                                        Cerrar todas las sesiones
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Outlet />
        </main>
    );
};