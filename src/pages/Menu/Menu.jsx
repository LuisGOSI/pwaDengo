import React, { useState } from 'react';
import Header from "../../components/layout/Header";
import './Menu.css';

export const Menu = () => {
    const [categoriaActiva, setCategoriaActiva] = useState('CAFÉ');

    const categorias = ['CAFÉ', 'COMIDA', 'POSTRE', 'COMUNIDAD'];

    const menuItems = {
        CAFÉ: [
            {
                id: 1,
                nombre: 'Espresso',
                badge: 'Clásico',
                descripcion: 'Shot doble de espresso intenso con notas de chocolate y caramelo',
                tamano: '60mL',
                precio: '$45.00'
            },
            {
                id: 2,
                nombre: 'Cappuccino',
                badge: 'Popular',
                descripcion: 'Espresso con leche vaporizada y espuma cremosa',
                tamano: '180mL',
                precio: '$55.00'
            },
            {
                id: 3,
                nombre: 'Latte',
                badge: 'Favorito',
                descripcion: 'Café con leche suave y arte latte',
                tamano: '240mL',
                precio: '$60.00'
            }
        ],
        COMIDA: [
            {
                id: 1,
                nombre: 'Croissant',
                badge: 'Fresco',
                descripcion: 'Croissant francés recién horneado con mantequilla',
                tamano: '80g',
                precio: '$45.00'
            },
            {
                id: 2,
                nombre: 'Sandwich Club',
                badge: 'Especial',
                descripcion: 'Triple sandwich con pollo, tocino y vegetales',
                tamano: '250g',
                precio: '$95.00'
            }
        ],
        POSTRE: [
            {
                id: 1,
                nombre: 'Pastel de Chocolate',
                badge: 'Delicioso',
                descripcion: 'Rebanada generosa de pastel de chocolate belga',
                tamano: '120g',
                precio: '$55.00'
            },
            {
                id: 2,
                nombre: 'Cheesecake',
                badge: 'Premium',
                descripcion: 'Cheesecake cremoso con frutos rojos',
                tamano: '150g',
                precio: '$65.00'
            }
        ],
        COMUNIDAD: [
            {
                id: 1,
                nombre: 'Taller Barista',
                badge: 'Nuevo',
                descripcion: 'Aprende técnicas de preparación de café profesional',
                tamano: '2 horas',
                precio: '$350.00'
            }
        ]
    };

    const itemsActuales = menuItems[categoriaActiva] || [];

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
                            key={categoria}
                            className={`categoria-btn ${categoriaActiva === categoria ? 'categoria-activa' : ''}`}
                            onClick={() => setCategoriaActiva(categoria)}
                        >
                            {categoria}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sección de Productos */}
            <div className="menu-seccion">
                <h2 className="seccion-titulo">{categoriaActiva}</h2>
                <p className="seccion-subtitulo">Granos selectos, preparaciones artesanales</p>

                <div className="menu-items">
                    {itemsActuales.map((item) => (
                        <div key={item.id} className="menu-item-card">
                            <div className="item-header">
                                <h3 className="item-nombre">{item.nombre}</h3>
                                <span className="item-badge">{item.badge}</span>
                            </div>
                            <p className="item-descripcion">{item.descripcion}</p>
                            <div className="item-footer">
                                <span className="item-tamano">{item.tamano}</span>
                                <span className="item-precio">{item.precio}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}