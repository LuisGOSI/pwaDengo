import React, { useState } from 'react';
import './Productos.css';
import { useSidebar } from '../../../context/SidebarContext';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../../components/layout/Sidebar';

export const Productos = () => {
    const { isOpen } = useSidebar();
    const [busqueda, setBusqueda] = useState('');
    const [categoria, setCategoria] = useState('');
    const [estado, setEstado] = useState('');
    const [sucursal, setSucursal] = useState('');

    const productos = [
        {
            id: 1,
            nombre: 'Cappuccino Especial',
            descripcion: 'Café espresso con espuma',
            categoria: 'Café',
            sucursal: 'Todas',
            precio: '$65.00',
            iniciales: 'CE',
            colorCategoria: 'cafe'
        },
        {
            id: 2,
            nombre: 'Croissant Francés',
            descripcion: 'Recién horneado',
            categoria: 'Panadería',
            sucursal: 'Centro',
            precio: '$45.00',
            iniciales: 'CF',
            colorCategoria: 'panaderia'
        },
        {
            id: 3,
            nombre: 'Espresso Doble',
            descripcion: 'Shot doble intenso',
            categoria: 'Café',
            sucursal: 'Centro',
            precio: '$50.00',
            iniciales: 'ED',
            colorCategoria: 'cafe'
        },
        {
            id: 4,
            nombre: 'Sandwich Club',
            descripcion: 'Triple piso con pollo',
            categoria: 'Comida',
            sucursal: 'Norte',
            precio: '$95.00',
            iniciales: 'SC',
            colorCategoria: 'comida'
        },
        {
            id: 5,
            nombre: 'Jugo Natural',
            descripcion: 'Naranja fresca',
            categoria: 'Bebidas',
            sucursal: 'Centro',
            precio: '$40.00',
            iniciales: 'JN',
            colorCategoria: 'bebidas'
        },
        {
            id: 6,
            nombre: 'Pastel de Chocolate',
            descripcion: 'Rebanada generosa',
            categoria: 'Postres',
            sucursal: 'Sur',
            precio: '$55.00',
            iniciales: 'PC',
            colorCategoria: 'postres'
        }
    ];

    const handleFiltrar = () => {
        console.log('Filtrando productos...', { busqueda, categoria, estado, sucursal });
    };

    return (
        <main className={`main-content ${!isOpen ? 'sidebar-closed' : ''}`}>
            <div className="productos-container">
                <Sidebar />
                <div className="productos-header">
                    <div className="productos-header-left">
                        <h1 className="productos-titulo">Catálogo de Productos</h1>
                        <p className="productos-breadcrumb">Clientes | Productos</p>
                    </div>
                    <button className="btn-nuevo-producto">
                        <span className="btn-icono">+</span>
                        Nuevo Producto
                    </button>
                </div>

                {/* Filtros */}
                <div className="productos-filtros">
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
                            <label>Categoría</label>
                            <select
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                                className="filtro-select"
                            >
                                <option value=""></option>
                                <option value="cafe">Café</option>
                                <option value="panaderia">Panadería</option>
                                <option value="comida">Comida</option>
                                <option value="bebidas">Bebidas</option>
                                <option value="postres">Postres</option>
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
                                <option value="disponible">Disponible</option>
                                <option value="agotado">Agotado</option>
                                <option value="descontinuado">Descontinuado</option>
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

                {/* Lista de Productos */}
                <div className="productos-lista">
                    <div className="lista-header">
                        <h2 className="lista-titulo">Lista de Productos</h2>
                        <p className="lista-subtitulo">Total: {productos.length} productos</p>
                    </div>

                    <div className="tabla-container">
                        <table className="productos-tabla">
                            <thead>
                                <tr>
                                    <th>PRODUCTO</th>
                                    <th>CATEGORÍA</th>
                                    <th>SUCURSAL</th>
                                    <th>PRECIO</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map((producto) => (
                                    <tr key={producto.id}>
                                        <td>
                                            <div className="producto-info">
                                                <div className="producto-avatar">
                                                    {producto.iniciales}
                                                </div>
                                                <div className="producto-datos">
                                                    <p className="producto-nombre">{producto.nombre}</p>
                                                    <p className="producto-descripcion">{producto.descripcion}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`categoria-badge categoria-${producto.colorCategoria}`}>
                                                {producto.categoria}
                                            </span>
                                        </td>
                                        <td className="producto-sucursal">{producto.sucursal}</td>
                                        <td className="producto-precio">{producto.precio}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}