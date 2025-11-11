
import React, { useState } from 'react';
import Header from "../../components/layout/Header";
import './Galeria.css'

export const Galeria = () => {
    const [categoriaActiva, setCategoriaActiva] = useState('TODO');

    const categorias = ['TODO', 'CAFÉ', 'COMIDA', 'BAR', 'ESPECIALES'];

    // Datos de ejemplo para las imágenes de la galería
    const imagenesGaleria = [
        { id: 1, categoria: 'CAFÉ', titulo: 'Cappuccino Artesanal', imagen: '' },
        { id: 2, categoria: 'COMIDA', titulo: 'Croissant Francés', imagen: '' },
        { id: 3, categoria: 'BAR', titulo: 'Cóctel Signature', imagen: '' },
        { id: 4, categoria: 'ESPECIALES', titulo: 'Postre del Chef', imagen: '' },
        { id: 5, categoria: 'CAFÉ', titulo: 'Espresso Doble', imagen: '' },
        { id: 6, categoria: 'COMIDA', titulo: 'Sandwich Gourmet', imagen: '' },
        { id: 7, categoria: 'BAR', titulo: 'Martini Clásico', imagen: '' },
        { id: 8, categoria: 'ESPECIALES', titulo: 'Brunch Especial', imagen: '' },
    ];

    const imagenesFiltradas = categoriaActiva === 'TODO' 
        ? imagenesGaleria 
        : imagenesGaleria.filter(img => img.categoria === categoriaActiva);

    return (
        <div className="galeria-container">
            <Header />
            
            {/* Hero Section */}
            <div className="galeria-hero">
                <h1 className="galeria-titulo">GALERÍA</h1>
                <p className="galeria-subtitulo">¡Momentos que inspiran!</p>
                <p className="galeria-descripcion">
                    Explora nuestra colección visual y descubre<br />
                    la experiencia única que ofrecemos
                </p>
            </div>

            {/* Filtros de Categorías */}
            <div className="galeria-filtros-wrapper">
                <div className="galeria-filtros">
                    {categorias.map((categoria) => (
                        <button
                            key={categoria}
                            className={`filtro-btn ${categoriaActiva === categoria ? 'filtro-activo' : ''}`}
                            onClick={() => setCategoriaActiva(categoria)}
                        >
                            {categoria}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid de Imágenes */}
            <div className="galeria-grid">
                {imagenesFiltradas.map((item) => (
                    <div key={item.id} className="galeria-item">
                        <div className="galeria-imagen">
                            {/* Placeholder para imagen */}
                        </div>
                        <div className="galeria-overlay">
                            <p className="galeria-item-titulo">{item.titulo}</p>
                            <span className="galeria-item-categoria">{item.categoria}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}