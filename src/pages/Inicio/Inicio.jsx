import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import './Inicio.css';
import coffeInicio from "../../assets/images/coffe-inicio.png";
import coffeSplash from "../../assets/images/coffe-splash.png";

export default function InicioPage() {
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
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">DESCUBRE EL ARTE DE UN CAFÉ PERFECTO</h1>

                        <p className="hero-description">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        </p>

                        <p className="hero-description">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        </p>

                        <button className="hero-btn">
                            ORDENA AHORA
                        </button>
                    </div>

                    <div className="hero-image">
                        <img src={coffeInicio}
                            alt="Café splash"
                            className="coffee-splash"
                        />
                        <img
                            src={coffeSplash}
                            alt="Salpicadura de café"
                            className="coffee-liquid"
                        />
                    </div>
                </div>
            </section>

            {/* Menu CTA */}
            <section className="menu-cta">
                <p className="menu-cta-text">¡Revisa nuestro menú para deleitarte de finitas sabores!</p>
                <button className="menu-cta-btn">IR A MENÚ</button>
            </section>

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
                    <a href="#" className="app-link">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Android_robot.svg"
                            alt="Android"
                            className="app-icon"
                        />
                    </a>
                    <a href="#" className="app-link">
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