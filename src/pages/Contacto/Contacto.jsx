import React, { useState } from 'react';
import Header from "../../components/layout/Header";
import './Contacto.css';

export const Contacto = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        asunto: '',
        mensaje: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        alert('Mensaje enviado correctamente');
        setFormData({
            nombre: '',
            email: '',
            telefono: '',
            asunto: '',
            mensaje: ''
        });
    };

    return (
        <div className="contacto-container">
            <Header />

            {/* Hero Section */}
            <div className="contacto-hero">
                <h1 className="contacto-titulo-hero">CONTACTO</h1>
                <p className="contacto-subtitulo-hero">¡Estamos para ti!</p>
                <p className="contacto-descripcion-hero">
                    Estamos aquí para ayudarte. Ya sea que tengas preguntas, comentarios o simplemente<br />
                    quieras saludar, no dudes en ponerte en contacto con nosotros a través del<br />
                    siguiente formulario o mediante nuestros datos de contacto
                </p>
            </div>

            <div className="contacto-grid">
                {/* Formulario de Contacto */}
                <div className="contacto-card">
                    <h2 className="contacto-titulo">Envíanos un Mensaje</h2>
                    <p className="contacto-subtitulo">
                        ¿Tienes alguna pregunta o comentario? Completa el formulario y te responderemos lo antes posible.
                    </p>

                    <div className="contacto-form">
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre:</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Tu nombre completo"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Correo Electrónico:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="tu@email.com"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="telefono">Teléfono:</label>
                            <input
                                type="tel"
                                id="telefono"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                placeholder="(477) 123-4567"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="asunto">Asunto:</label>
                            <input
                                type="text"
                                id="asunto"
                                name="asunto"
                                value={formData.asunto}
                                onChange={handleChange}
                                placeholder="¿De qué se trata tu mensaje?"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="mensaje">Mensaje:</label>
                            <textarea
                                id="mensaje"
                                name="mensaje"
                                rows={4}
                                value={formData.mensaje}
                                onChange={handleChange}
                                placeholder="Escribe tu mensaje aquí..."
                            ></textarea>
                        </div>

                        <button onClick={handleSubmit} className="btn-enviar">
                            Enviar Mensaje
                        </button>
                    </div>
                </div>

                {/* Información de Contacto */}
                <div className="contacto-info-grid">
                    {/* Ubicación */}
                    <div className="info-card">
                        <h3 className="info-titulo">UBICACIÓN</h3>
                        <p className="info-texto">
                            Blvd. Adolfo López Mateos 1234<br />
                            Col. Centro<br />
                            León de los Aldama, Guanajuato<br />
                            C.P. 37000, México
                        </p>
                    </div>

                    {/* Teléfono */}
                    <div className="info-card">
                        <h3 className="info-titulo">TELÉFONO</h3>
                        <a href="tel:+524771234567" className="info-link">
                            +52 (477) 123-4567
                        </a>
                        <a href="tel:+524777654321" className="info-link">
                            +52 (477) 765-4321
                        </a>
                    </div>

                    {/* Email */}
                    <div className="info-card">
                        <h3 className="info-titulo">EMAIL</h3>
                        <a href="mailto:contactodengo@dengo.com" className="info-link">
                            contactodengo@dengo.com
                        </a>
                        <a href="mailto:info@dengo.com" className="info-link">
                            info@dengo.com
                        </a>
                    </div>
                </div>
            </div>

            {/* Mapa */}
            <div className="mapa-section">
                <div className="mapa-wrapper">
                    <h2 className="mapa-titulo">ENCUÉNTRANOS</h2>
                    <div className="mapa-container">
                        <div className="mapa-placeholder">
                            <div className="mapa-icono">📍</div>
                            <p className="mapa-texto">Mapa de ubicación</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}