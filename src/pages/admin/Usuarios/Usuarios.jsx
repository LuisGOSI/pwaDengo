import React, { useState } from 'react';
import './Usuarios.css';
import Header from '../../../components/layout/Header';

export const Usuarios = () => {
    const [busqueda, setBusqueda] = useState('');
    const [rol, setRol] = useState('');
    const [estado, setEstado] = useState('');
    const [sucursal, setSucursal] = useState('');

    const usuarios = [
        {
            id: 1,
            nombre: 'Admin Master',
            email: 'admin@dango.com',
            rol: 'Administrador',
            sucursal: 'Todas',
            telefono: '(477) 123-4567',
            iniciales: 'AM',
            colorRol: 'administrador'
        },
        {
            id: 2,
            nombre: 'María González',
            email: 'maria.gonzalez@dango.com',
            rol: 'Gerente',
            sucursal: 'Centro',
            telefono: '(477) 234-5678',
            iniciales: 'MG',
            colorRol: 'gerente'
        },
        {
            id: 3,
            nombre: 'Juan Pérez',
            email: 'juan.perez@dango.com',
            rol: 'Barista',
            sucursal: 'Centro',
            telefono: '(477) 345-6789',
            iniciales: 'JP',
            colorRol: 'barista'
        },
        {
            id: 4,
            nombre: 'Ana López',
            email: 'ana.lopez@dango.com',
            rol: 'Barista',
            sucursal: 'Norte',
            telefono: '(477) 456-7890',
            iniciales: 'AL',
            colorRol: 'barista'
        },
        {
            id: 5,
            nombre: 'Carlos Martínez',
            email: 'carlos.martinez@dango.com',
            rol: 'Caja',
            sucursal: 'Centro',
            telefono: '(477) 567-8901',
            iniciales: 'CM',
            colorRol: 'caja'
        },
        {
            id: 6,
            nombre: 'Luis Fernández',
            email: 'luis.fernandez@dango.com',
            rol: 'Gerente',
            sucursal: 'Sur',
            telefono: '(477) 678-9012',
            iniciales: 'LF',
            colorRol: 'gerente'
        }
    ];

    const handleFiltrar = () => {
        console.log('Filtrando usuarios...', { busqueda, rol, estado, sucursal });
    };

    return (
        <div className="usuarios-container">
            <div className="usuarios-header">
                <div className="usuarios-header-left">
                    <h1 className="usuarios-titulo">Catálogo de Usuarios</h1>
                    <p className="usuarios-breadcrumb">Clientes | Usuarios</p>
                </div>
                <button className="btn-nuevo-usuario">
                    <span className="btn-icono">+</span>
                    Nuevo Evento
                </button>
            </div>

            {/* Filtros */}
            <div className="usuarios-filtros">
                <div className="filtros-grid">
                    <div className="filtro-group">
                        <label>Buscar</label>
                        <input
                            type="text"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="filtro-input"
                        />
                    </div>

                    <div className="filtro-group">
                        <label>Rol</label>
                        <select
                            value={rol}
                            onChange={(e) => setRol(e.target.value)}
                            className="filtro-select"
                        >
                            <option value=""></option>
                            <option value="administrador">Administrador</option>
                            <option value="gerente">Gerente</option>
                            <option value="barista">Barista</option>
                            <option value="caja">Caja</option>
                        </select>
                    </div>

                    <div className="filtro-group">
                        <label>Estado</label>
                        <select
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                            className="filtro-select"
                        >
                            <option value=""></option>
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                    </div>

                    <div className="filtro-group">
                        <label>Sucursal</label>
                        <select
                            value={sucursal}
                            onChange={(e) => setSucursal(e.target.value)}
                            className="filtro-select"
                        >
                            <option value=""></option>
                            <option value="todas">Todas</option>
                            <option value="centro">Centro</option>
                            <option value="norte">Norte</option>
                            <option value="sur">Sur</option>
                        </select>
                    </div>
                </div>

                <button onClick={handleFiltrar} className="btn-filtrar">
                    Filtrar
                </button>
            </div>

            {/* Lista de Usuarios */}
            <div className="usuarios-lista">
                <div className="lista-header">
                    <h2 className="lista-titulo">Lista de Usuarios</h2>
                    <p className="lista-subtitulo">Total: {usuarios.length} usuarios</p>
                </div>

                <div className="tabla-container">
                    <table className="usuarios-tabla">
                        <thead>
                            <tr>
                                <th>USUARIO</th>
                                <th>ROL</th>
                                <th>SUCURSAL</th>
                                <th>TELÉFONO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id}>
                                    <td>
                                        <div className="usuario-info">
                                            <div className="usuario-avatar">
                                                {usuario.iniciales}
                                            </div>
                                            <div className="usuario-datos">
                                                <p className="usuario-nombre">{usuario.nombre}</p>
                                                <p className="usuario-email">{usuario.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`rol-badge rol-${usuario.colorRol}`}>
                                            {usuario.rol}
                                        </span>
                                    </td>
                                    <td className="usuario-sucursal">{usuario.sucursal}</td>
                                    <td className="usuario-telefono">{usuario.telefono}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}