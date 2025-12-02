import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import './Inicio.css';
import coffeInicio from "../../assets/images/coffe-inicio.png";
import coffeSplash from "../../assets/images/granos-splash.png";
import ButtonAndroid from '../../components/common/ButtonAndroid';
import ButtonIOS from '../../components/common/ButtonIOS';
import { useNavigate } from 'react-router-dom';

export default function InicioPage() {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);

    const coffeeItems = [
        {
            name: 'Frappuccino de Oreo',
            image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&h=300&fit=crop'
        },
        {
            name: 'Café espresso',
            image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=300&h=300&fit=crop'
        },
        {
            name: 'Capuccino',
            image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&h=300&fit=crop'
        }
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % coffeeItems.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + coffeeItems.length) % coffeeItems.length);
    };

    return (
        <div className="inicio-page">
            {/* Hero Section */}
            <section className="hero-section">
                <section className="hero-section">
                    {/* Elementos de fondo decorativos */}
                    <div className="bg-gradient-orb"></div>
                    <div className="bg-grid-lines"></div>

                    <div className="hero-container">

                        {/* COLUMNA DE CONTENIDO */}
                        <div className="hero-content-wrapper">
                            <div className="brand-badge">EST. 2025 — SELECCIÓN PREMIER DE CAFÉ</div>

                            {/* TU TÍTULO ORIGINAL */}
                            <h1 className="hero-title">DESCUBRE EL ARTE DE UN CAFÉ EXCEPCIONAL</h1>

                            <div className="hero-divider"></div>

                            <p className="hero-subtitle">
                                No es solo cafeína, es artesanía. Experimenta la fusión perfecta entre
                                granos de origen único y una preparación meticulosa diseñada para
                                los paladares más exigentes.
                            </p>

                            <div className="cta-group">
                                <button className="btn-primary" onClick={() => navigate('/menu')}>
                                    Ver Menú
                                </button>
                                <button className="btn-link" onClick={() => navigate('/contacto')}>
                                    Encuéntranos
                                </button>
                            </div>

                            <div className="stats-row">
                                <div className="stat-item">
                                    <span className="stat-number">100%</span>
                                    <span className="stat-label">Mexicano</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">24h</span>
                                    <span className="stat-label">Completamente fresco</span>
                                </div>
                            </div>
                        </div>

                        {/* COLUMNA VISUAL */}
                        <div className="hero-visual-wrapper">
                            <div className="visual-circle-backdrop"></div>
                            <div className="floating-composition">
                                {/* Ajusta el z-index para que el splash quede detrás o delante según tu imagen */}
                                <img src={coffeSplash} alt="Aroma y textura" className="img-splash" />
                                <img src={coffeInicio} alt="Nuestra taza insignia" className="img-cup" />
                            </div>
                        </div>

                    </div>
                </section>
                );
            </section>

            {/* Menu CTA */}
            {/* <section className="menu-cta">
                <p className="menu-cta-text">¡Revisa nuestro menú para deleitarte de finitas sabores!</p>
                <button
                    className="menu-cta-btn"
                    onClick={() => navigate('/menu')}
                >
                    <span>IR A MENÚ</span>
                </button>
            </section> */}

            {/* Services Section */}
            <section className="services-section">
                <h2 className="services-title">Nuestros Servicios</h2>
                <div className="services-divider"></div>

                <div className="services-intro">
                    <h3 className="services-subtitle">¡De los mejores sabores para compartir!</h3>
                    <p className="services-description">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                        pariatur.
                    </p>
                </div>

                {/* Coffee Carousel */}
                <div className="coffee-carousel">
                    <button className="carousel-btn carousel-btn-prev" onClick={prevSlide}>
                        <ChevronLeft size={24} />
                    </button>

                    <div className="carousel-track">
                        {coffeeItems.map((item, index) => {
                            let position = 'carousel-item-hidden';
                            if (index === currentSlide) position = 'carousel-item-active';
                            else if (index === (currentSlide - 1 + coffeeItems.length) % coffeeItems.length) position = 'carousel-item-prev';
                            else if (index === (currentSlide + 1) % coffeeItems.length) position = 'carousel-item-next';

                            return (
                                <div key={index} className={`carousel-item ${position}`}>
                                    <div className="carousel-item-circle">
                                        <img src={item.image} alt={item.name} className="carousel-item-img" />
                                    </div>
                                    <p className="carousel-item-name">{item.name}</p>
                                </div>
                            );
                        })}
                    </div>

                    <button className="carousel-btn carousel-btn-next" onClick={nextSlide}>
                        <ChevronRight size={24} />
                    </button>
                </div>
            </section>

            {/* App Download Section */}
            <section className="app-section">
                <h2 className="app-title">¡Descarga nuestra aplicación móvil para una mejor experiencia!</h2>
                <p className="app-subtitle">Descárgalo ya en Android o IOS</p>

                <div className="app-icons">
                    <a className="app-link">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Android_robot.svg"
                            alt="Android"
                            className="app-icon"
                        />
                    </a>
                    <ButtonAndroid />
                    <ButtonIOS />
                    <a className="app-link">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                            alt="iOS"
                            className="app-icon app-icon-ios"
                        />
                    </a>
                </div>
            </section>
        </div>
    );
}