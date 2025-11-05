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
            <div className="contacto-grid">
                {/* Formulario de Contacto */}
                <div className="contacto-card">
                    <h2 className="contacto-titulo">Envíanos un Mensaje</h2>
                    <p className="contacto-subtitulo">
                        ¿Tienes alguna pregunta o comentario?<br />
                        Completa el formulario y te<br />
                        responderemos lo antes posible.
                    </p>

                    <div className="contacto-form">
                        <div className="form-group">
                            <label htmlFor="nombre">NOMBRE:</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">CORREO ELECTRÓNICO:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="telefono">TELÉFONO:</label>
                            <input
                                type="tel"
                                id="telefono"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="asunto">ASUNTO:</label>
                            <input
                                type="text"
                                id="asunto"
                                name="asunto"
                                value={formData.asunto}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="mensaje">MENSAJE:</label>
                            <textarea
                                id="mensaje"
                                name="mensaje"
                                rows={4}
                                value={formData.mensaje}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <button onClick={handleSubmit} className="btn-enviar">
                            ENVIAR MENSAJE
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
                    </div>
                </div>
            </div>

            {/* Mapa */}
            <div className="mapa-section">
                <h2 className="mapa-titulo">ENCUÉNTRANOS</h2>
                <div className="mapa-container">
                    <div className="mapa-placeholder">
                        <div className="mapa-icono">📍</div>
                        <p className="mapa-texto">Mapa de ubicación</p>
                    </div>
                </div>
            </div>
        </div>
    );
}