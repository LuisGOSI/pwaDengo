import React, { useState } from 'react';
import './ProductosComunidad.css';
import Sidebar from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../context/SidebarContext';
import { Outlet } from 'react-router-dom';

export const ProductosComunidad = () => {
    const { isOpen } = useSidebar();
    const [productos] = useState([
        {
            id: 1,
            receta: 'Cappuccino Clásico',
            ingredientes: ['Café Espresso', 'Leche Entera', 'Espuma de Leche'],
            cantidad: 250
        },
        {
            id: 2,
            receta: 'Latte de Vainilla',
            ingredientes: ['Café Espresso', 'Leche Entera', 'Jarabe de Vainilla'],
            cantidad: 350
        },
        {
            id: 3,
            receta: 'Mocha Chocolate',
            ingredientes: ['Café Espresso', 'Leche Entera', 'Chocolate', 'Crema Batida'],
            cantidad: 400
        },
        {
            id: 4,
            receta: 'Americano',
            ingredientes: ['Café Espresso', 'Agua Caliente'],
            cantidad: 300
        },
        {
            id: 5,
            receta: 'Macchiato Caramelo',
            ingredientes: ['Café Espresso', 'Leche Vaporizada', 'Jarabe de Caramelo', 'Espuma'],
            cantidad: 280
        },
        {
            id: 6,
            receta: 'Frappuccino de Café',
            ingredientes: ['Café Espresso', 'Leche', 'Hielo', 'Jarabe', 'Crema Batida'],
            cantidad: 450
        },
        {
            id: 7,
            receta: 'Flat White',
            ingredientes: ['Café Espresso', 'Leche Microespuma'],
            cantidad: 200
        },
        {
            id: 8,
            receta: 'Té Chai Latte',
            ingredientes: ['Té Chai', 'Leche Entera', 'Canela', 'Especias'],
            cantidad: 350
        }
    ]);

    const [filtros, setFiltros] = useState({
        busqueda: '',
        cantidadMin: '',
        cantidadMax: ''
    });

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const productosFiltrados = productos.filter(prod => {
        const matchBusqueda = prod.receta.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
            prod.ingredientes.some(ing => ing.toLowerCase().includes(filtros.busqueda.toLowerCase()));

        const matchCantidadMin = !filtros.cantidadMin || prod.cantidad >= parseInt(filtros.cantidadMin);
        const matchCantidadMax = !filtros.cantidadMax || prod.cantidad <= parseInt(filtros.cantidadMax);

        return matchBusqueda && matchCantidadMin && matchCantidadMax;
    });

    const limpiarFiltros = () => {
        setFiltros({
            busqueda: '',
            cantidadMin: '',
            cantidadMax: ''
        });
    };

    const getIniciales = (receta) => {
        return receta
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const getCantidadBadgeClass = (cantidad) => {
        if (cantidad >= 400) return 'cantidad-alta';
        if (cantidad >= 250) return 'cantidad-media';
        return 'cantidad-baja';
    };

    return (
        <main className={`main-content ${!isOpen ? 'sidebar-closed' : ''}`}>
            <div className="productos-container">
                <Sidebar />
                <div className="productos-header">
                    <div className="productos-header-left">
                        <h1 className="productos-titulo">Productos de la Comunidad</h1>
                        <p className="productos-breadcrumb">Productos / Productos Comunidad</p>
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
                            <label>Buscar producto</label>
                            <input
                                type="text"
                                className="filtro-input"
                                placeholder="Receta o ingrediente..."
                                name="busqueda"
                                value={filtros.busqueda}
                                onChange={handleFiltroChange}
                            />
                        </div>

                        <div className="filtro-group">
                            <label>Cantidad mínima (ml)</label>
                            <input
                                type="number"
                                className="filtro-input"
                                placeholder="0"
                                name="cantidadMin"
                                value={filtros.cantidadMin}
                                onChange={handleFiltroChange}
                            />
                        </div>

                        <div className="filtro-group">
                            <label>Cantidad máxima (ml)</label>
                            <input
                                type="number"
                                className="filtro-input"
                                placeholder="1000"
                                name="cantidadMax"
                                value={filtros.cantidadMax}
                                onChange={handleFiltroChange}
                            />
                        </div>

                        <div className="filtro-group" style={{ alignSelf: 'flex-end' }}>
                            <button
                                className="btn-filtrar"
                                onClick={limpiarFiltros}
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lista de Productos */}
                <div className="productos-lista">
                    <div className="lista-header">
                        <h2 className="lista-titulo">Lista de Productos</h2>
                        <p className="lista-subtitulo">
                            Mostrando {productosFiltrados.length} de {productos.length} productos
                        </p>
                    </div>

                    <div className="tabla-container">
                        <table className="productos-tabla">
                            <thead>
                                <tr>
                                    <th>Receta</th>
                                    <th>Ingredientes</th>
                                    <th>Cantidad</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productosFiltrados.map(producto => (
                                    <tr key={producto.id}>
                                        <td>
                                            <div className="producto-info">
                                                <div className="producto-avatar">
                                                    {getIniciales(producto.receta)}
                                                </div>
                                                <div className="producto-datos">
                                                    <p className="producto-nombre">{producto.receta}</p>
                                                    <p className="producto-tipo">Bebida Especial</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="ingredientes-lista">
                                                {producto.ingredientes.map((ing, index) => (
                                                    <span key={index} className="ingrediente-tag">
                                                        {ing}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`cantidad-badge ${getCantidadBadgeClass(producto.cantidad)}`}>
                                                {producto.cantidad} ml
                                            </span>
                                        </td>
                                        <td>
                                            <div className="acciones-container">
                                                <button
                                                    className="btn-accion btn-ver"
                                                    title="Ver detalles"
                                                >
                                                    👁️
                                                </button>
                                                <button
                                                    className="btn-accion btn-editar"
                                                    title="Editar"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="btn-accion btn-eliminar"
                                                    title="Eliminar"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {productosFiltrados.length === 0 && (
                            <div className="tabla-vacia">
                                <p>No se encontraron productos con los filtros aplicados</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Estadísticas rápidas */}
                <div className="productos-stats">
                    <div className="stat-card">
                        <div className="stat-icono">📊</div>
                        <div className="stat-info">
                            <p className="stat-valor">{productos.length}</p>
                            <p className="stat-label">Total Productos</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icono">🥤</div>
                        <div className="stat-info">
                            <p className="stat-valor">
                                {Math.round(productos.reduce((sum, p) => sum + p.cantidad, 0) / productos.length)}
                            </p>
                            <p className="stat-label">Promedio ml</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icono">🌿</div>
                        <div className="stat-info">
                            <p className="stat-valor">
                                {[...new Set(productos.flatMap(p => p.ingredientes))].length}
                            </p>
                            <p className="stat-label">Ingredientes Únicos</p>
                        </div>
                    </div>
                </div>
            </div>
            <Outlet />
        </main>
    );
};