import { useState, useEffect } from 'react';
import Header from "../../components/layout/Header";
import './Menu.css';

export const Menu = () => {
    const [categoriaActiva, setCategoriaActiva] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [productos, setProductos] = useState([]);

    const API_URL = 'https://dengo-back.onrender.com/api';

    useEffect(() => {
        cargarCategorias();
    }, []);

    useEffect(() => {
        if (categoriaActiva) {
            cargarProductosByCategoria();
        }
    }, [categoriaActiva]);

    const cargarCategorias = async () => {
        try {
            const response = await fetch(`${API_URL}/productos`);
            const result = await response.json();
            if (result.success) {
                // Extraer categorías únicas de los productos
                const categoriasUnicas = [];
                const categoriasMap = new Map();
                
                result.data.forEach(producto => {
                    if (producto.categorias && !categoriasMap.has(producto.categorias.id)) {
                        categoriasMap.set(producto.categorias.id, producto.categorias);
                        categoriasUnicas.push(producto.categorias);
                    }
                });
                
                setCategorias(categoriasUnicas);
                if (categoriasUnicas.length > 0) {
                    setCategoriaActiva(categoriasUnicas[0].id);
                }
            }
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    };

    const cargarProductosByCategoria = async () => {
        try {
            const response = await fetch(`${API_URL}/productos`);
            const result = await response.json();
            if (result.success) {
                const productosFiltrados = result.data.filter(p => p.categoria_id === categoriaActiva);
                setProductos(productosFiltrados);
            }
        } catch (error) {
            console.error('Error al cargar productos:', error);
            setProductos([]);
        }
    };

    const categoriaActual = categorias.find(c => c.id === categoriaActiva);
    const categoriaNombre = categoriaActual?.nombre || '';

    return (
        <div className="menu-container">
        <Header />
            {/* Hero Section */}
            <div className="menu-hero">
                <h1 className="menu-titulo">MENÚ</h1>
                <p className="menu-subtitulo">¡Sabores que inspiran!</p>
                <p className="menu-descripcion">
                    Explora nuestra cartelera para deleitarte con nuestras súper promos y lo<br />
                    que tenemos por ofrecerte
                </p>
            </div>

            {/* Categorías */}
            <div className="menu-categorias-wrapper">
                <div className="menu-categorias">
                    {categorias.map((categoria) => (
                        <button
                            key={categoria.id}
                            className={`categoria-btn ${categoriaActiva === categoria.id ? 'categoria-activa' : ''}`}
                            onClick={() => setCategoriaActiva(categoria.id)}
                        >
                            {categoria.nombre.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sección de Productos */}
            <div className="menu-seccion">
                <h2 className="seccion-titulo">{categoriaNombre.toUpperCase()}</h2>
                <p className="seccion-subtitulo">Granos selectos, preparaciones artesanales</p>

                <div className="menu-items">
                    {productos.map((producto) => (
                        <div key={producto.id} className="menu-item-card">
                            <div className="item-header">
                                <h3 className="item-nombre">{producto.nombre}</h3>
                                <span className="item-badge">{producto.categorias.nombre}</span>
                            </div>
                            <div className="card-content">
                                <p className="item-descripcion">{producto.descripcion} {producto.url_imagen && (
                                    <img 
                                        src={producto.url_imagen} 
                                        alt={producto.nombre}
                                        className="item-imagen"
                                    />
                                )}</p>
                                
                            </div>
                            <div className="item-footer">
                                <span className="item-precio">${parseFloat(producto.precio).toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}