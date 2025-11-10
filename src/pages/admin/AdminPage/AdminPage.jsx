import React from 'react';
import './AdminPage.css';
import Sidebar from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../context/SidebarContext';
import { Outlet } from 'react-router-dom';

export const AdminPage = () => {
    const { isOpen } = useSidebar();
    return (
        <main className={`main-content ${!isOpen ? 'sidebar-closed' : ''}`}>

            <div className="admin-container">
                <Sidebar />
                <section className="hero-section">
                    <div className="hero-content">
                        <h1 className="hero-title">Transformando ideas en realidad digital</h1>
                        <p className="hero-subtitle">
                            Somos una empresa comprometida con la excelencia, la innovación y el crecimiento
                            sostenible de nuestros clientes.
                        </p>
                    </div>
                </section>

                {/* Main Content */}
                <div className="content-wrapper">
                    {/* About Cards */}
                    <section className="cards-section">
                        <div className="card card-large">
                            <div className="card-content">
                                <h2 className="card-title">Nuestra Filosofía</h2>
                                <p className="card-text">
                                    Creemos en el poder de la tecnología para crear experiencias
                                    significativas. Cada proyecto es una oportunidad para superar
                                    expectativas y construir soluciones que realmente importen.
                                </p>
                            </div>
                        </div>

                        <div className="card card-medium">
                            <div className="card-content">
                                <span className="card-icon">💼</span>
                                <h3 className="card-subtitle">Experiencia</h3>
                                <p className="card-text">
                                    Más de una década dedicados a perfeccionar nuestro craft y
                                    entregar resultados excepcionales.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Commitment Section */}
                    <section className="commitment-section">
                        <div className="commitment-header">
                            <h2 className="section-title">Nuestro Compromiso</h2>
                            <p className="section-description">
                                Trabajamos con pasión y dedicación para garantizar el éxito de cada proyecto
                            </p>
                        </div>

                        <div className="commitment-grid">
                            <div className="commitment-card">
                                <div className="commitment-icon">✨</div>
                                <h4 className="commitment-title">Calidad</h4>
                                <p className="commitment-text">
                                    Estándares elevados en cada detalle, sin compromisos ni atajos.
                                </p>
                            </div>

                            <div className="commitment-card">
                                <div className="commitment-icon">🚀</div>
                                <h4 className="commitment-title">Innovación</h4>
                                <p className="commitment-text">
                                    Adoptamos nuevas tecnologías y metodologías para estar a la vanguardia.
                                </p>
                            </div>

                            <div className="commitment-card">
                                <div className="commitment-icon">🤝</div>
                                <h4 className="commitment-title">Colaboración</h4>
                                <p className="commitment-text">
                                    Trabajamos de la mano con nuestros clientes como verdaderos partners.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Values Section */}
                    <section className="values-section">
                        <div className="value-item">
                            <div className="value-number">01</div>
                            <div className="value-content">
                                <h3 className="value-title">Transparencia Total</h3>
                                <p className="value-description">
                                    Comunicación clara y honesta en cada etapa del proceso. Sin sorpresas,
                                    solo resultados tangibles y medibles.
                                </p>
                            </div>
                        </div>

                        <div className="value-item">
                            <div className="value-number">02</div>
                            <div className="value-content">
                                <h3 className="value-title">Orientación a Resultados</h3>
                                <p className="value-description">
                                    Nos enfocamos en lo que realmente importa: generar valor y alcanzar
                                    los objetivos de negocio de nuestros clientes.
                                </p>
                            </div>
                        </div>

                        <div className="value-item">
                            <div className="value-number">03</div>
                            <div className="value-content">
                                <h3 className="value-title">Mejora Continua</h3>
                                <p className="value-description">
                                    Aprendemos de cada proyecto para evolucionar constantemente y
                                    ofrecer soluciones cada vez mejores.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <Outlet />
        </main>
    );
}