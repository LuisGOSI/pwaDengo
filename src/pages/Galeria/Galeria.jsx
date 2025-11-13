import React, { useState } from 'react';
import Header from "../../components/layout/Header";
import './Galeria.css'
import cappuccinoArtesanal from './../../assets/images/ImgGaleria/galeria_1.png';
import croissant from './../../assets/images/ImgGaleria/galeria_2.png';
import coctelBaileys from './../../assets/images/ImgGaleria/galeria_4.jpg';
import expresso from '../../assets/images/ImgGaleria/galeria_5.png';
import demo from '../../assets/images/Videos/demos.mp4';
import demo_2 from '../../assets/images/Videos/demos_2.mp4';
import demo_3 from '../../assets/images/Videos/demos_3.mp4';
import sandwich from '../../assets/images/ImgGaleria/galeria_6.jpg';
import cappuccino from '../../assets/images/ImgGaleria/galeria_7.png';


export const Galeria = () => {
    const [categoriaActiva, setCategoriaActiva] = useState('TODO');

    const categorias = ['TODO', 'CAFÉ', 'COMIDA', 'BAR', 'PERSONAL'];

    // Datos de ejemplo para las imágenes de la galería 
    const imagenesGaleria = [
        {
            id: 1,
            categoria: 'CAFÉ',
            titulo: 'Cappuccino Artesanal',
            tipo: 'imagen', // 'imagen' o 'video'
            src: cappuccinoArtesanal
        },
        {
            id: 2,
            categoria: 'COMIDA',
            titulo: 'Croissant Francés',
            tipo: 'imagen',
            src: croissant
        },
        {
            id: 3,
            categoria: 'PERSONAL',
            titulo: 'Servicio Amigable',
            tipo: 'video',
            src: demo_3
        },
        {
            id: 4,
            categoria: 'CAFÉ',
            titulo: 'Cappuccino con Arte Latte',
            tipo: 'imagen',
            src: cappuccino
        },
        {
            id: 5,
            categoria: 'PERSONAL',
            titulo: 'Brunch Especial',
            tipo: 'video',
            src: demo
        },
        {
            id: 6,
            categoria: 'COMIDA',
            titulo: 'Sandwich Gourmet',
            tipo: 'imagen',
            src: sandwich
        },
        {
            id: 7,
            categoria: 'PERSONAL',
            titulo: 'Personal de Dengo',
            tipo: 'video',
            src: demo_2,
        },
        {
            id: 8,
            categoria: 'CAFÉ',
            titulo: 'Espresso',
            tipo: 'imagen',
            src: expresso
        },
        {
            id: 9,
            categoria: 'BAR',
            titulo: 'Cóctel con Baileys Irish Cream',
            tipo: 'imagen',
            src: coctelBaileys,
        },
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
                            {item.tipo === 'imagen' ? (
                                <img
                                    src={item.src}
                                    alt={item.titulo}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <video
                                    src={item.src}
                                    poster={item.poster}
                                    controls
                                    loop
                                    autoPlay
                                    muted
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                >
                                    Tu navegador no soporta el elemento de video.
                                </video>
                            )}
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