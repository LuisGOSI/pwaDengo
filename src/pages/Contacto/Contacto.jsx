import React, { useState, useEffect } from 'react';
import Header from "../../components/layout/Header";
import './Contacto.css';
import { useConfirm } from '../../components/common/Mensaje/ConfirmModal';

export const Contacto = () => {
    const { showConfirm } = useConfirm();

    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        asunto: '',
        mensaje: ''
    });

    const [errors, setErrors] = useState({
        nombre: '',
        email: '',
        telefono: '',
        asunto: '',
        mensaje: ''
    });

    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [mapInstance, setMapInstance] = useState(null);

    const API_URL = 'https://dengo-back.onrender.com/api';

    const centerLocation = {
        lat: 21.1161,
        lng: -101.6862
    };

    useEffect(() => {
        fetchBranches();
        loadLeafletScript();
    }, []);

    const loadLeafletScript = () => {
        if (window.L) {
            setMapLoaded(true);
            return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.onload = () => setMapLoaded(true);
        document.head.appendChild(script);
    };

    const fetchBranches = async () => {
        try {
            const response = await fetch(`${API_URL}/sucursales`);
            const result = await response.json();

            if (result.success) {
                const activeBranches = result.data.filter(branch => branch.activa);
                setBranches(activeBranches);
            } else {
                console.error('Error:', result.error);
            }
        } catch (error) {
            console.error('Error al obtener sucursales:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (mapLoaded && branches.length > 0 && !mapInstance) {
            initMap();
        }

        return () => {
            if (mapInstance) {
                mapInstance.remove();
                setMapInstance(null);
            }
        };
    }, [mapLoaded, branches]);

    const initMap = () => {
        const mapElement = document.getElementById('leaflet-map');
        if (!mapElement || !window.L) return;

        if (mapInstance) {
            mapInstance.remove();
        }

        if (mapElement._leaflet_id) {
            delete mapElement._leaflet_id;
        }

        const map = window.L.map('leaflet-map').setView([centerLocation.lat, centerLocation.lng], 12);
        setMapInstance(map);

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);

        const customIcon = window.L.icon({
            iconUrl: 'data:image/svg+xml;base64,' + btoa(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
                    <path fill="#78350F" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
            `),
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });

        branches.forEach(branch => {
            const marker = window.L.marker(
                [Number(branch.latitud), Number(branch.longitud)],
                { icon: customIcon }
            ).addTo(map);

            const popupContent = `
                <div style="padding: 8px; min-width: 200px;">
                    <h3 style="margin: 0 0 8px 0; color: #78350F; font-size: 16px; font-weight: 600;">
                        ${branch.nombre}
                    </h3>
                    <p style="margin: 4px 0; font-size: 13px; color: #666;">📍 ${branch.direccion}</p>
                    <p style="margin: 4px 0; font-size: 13px; color: #666;">📞 ${branch.telefono}</p>
                    <p style="margin: 4px 0; font-size: 13px; color: #666;">🕐 ${branch.horario_apertura}</p>
                    <a 
                        href="https://www.google.com/maps/dir/?api=1&destination=${branch.latitud},${branch.longitud}" 
                        target="_blank"
                        style="display: inline-block; margin-top: 8px; padding: 6px 12px; background-color: #78350F; color: white; text-decoration: none; border-radius: 6px; font-size: 12px;"
                    >
                        Cómo llegar
                    </a>
                </div>
            `;

            marker.bindPopup(popupContent);
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        } else if (formData.nombre.trim().length < 3) {
            newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'El correo electrónico es requerido';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Ingresa un correo electrónico válido';
        }

        const phoneRegex = /^[0-9]{10}$/;
        const cleanPhone = formData.telefono.replace(/\D/g, '');
        if (!formData.telefono.trim()) {
            newErrors.telefono = 'El teléfono es requerido';
        } else if (!phoneRegex.test(cleanPhone)) {
            newErrors.telefono = 'Ingresa un teléfono válido de 10 dígitos';
        }

        if (!formData.asunto.trim()) {
            newErrors.asunto = 'El asunto es requerido';
        } else if (formData.asunto.trim().length < 5) {
            newErrors.asunto = 'El asunto debe tener al menos 5 caracteres';
        }

        if (!formData.mensaje.trim()) {
            newErrors.mensaje = 'El mensaje es requerido';
        } else if (formData.mensaje.trim().length < 10) {
            newErrors.mensaje = 'El mensaje debe tener al menos 10 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            console.error('Formulario con errores');
            return;
        }

        const confirmed = await showConfirm({
            title: '¿Enviar Mensaje?',
            message: '¿Estás seguro de que deseas enviar este mensaje?',
            confirmText: 'Sí, Enviar',
            cancelText: 'Cancelar',
            type: 'info'
        });

        if (!confirmed) return;

        try {
            console.log('Form submitted:', formData);

            setFormData({
                nombre: '',
                email: '',
                telefono: '',
                asunto: '',
                mensaje: ''
            });

            setErrors({
                nombre: '',
                email: '',
                telefono: '',
                asunto: '',
                mensaje: ''
            });

        } catch (error) {
            alert('Error al enviar el mensaje.' + error.message);
        }
    };

    return (
        <div className="contacto-container">
            <Header />

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
                {/* FORMULARIO */}
                <div className="contacto-card">
                    <h2 className="contacto-titulo">Envíanos un Mensaje</h2>
                    <p className="contacto-subtitulo">
                        ¿Tienes alguna pregunta o comentario? Completa el formulario y te responderemos lo antes posible.
                    </p>

                    <div className="contacto-form">
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre: *</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Tu nombre completo"
                                className={errors.nombre ? 'input-error' : ''}
                            />
                            {errors.nombre && <span className="error-message">{errors.nombre}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Correo Electrónico: *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="tu@email.com"
                                className={errors.email ? 'input-error' : ''}
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="telefono">Teléfono: *</label>
                            <input
                                type="tel"
                                id="telefono"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                placeholder="4771234567"
                                maxLength="10"
                                className={errors.telefono ? 'input-error' : ''}
                            />
                            {errors.telefono && <span className="error-message">{errors.telefono}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="asunto">Asunto: *</label>
                            <input
                                type="text"
                                id="asunto"
                                name="asunto"
                                value={formData.asunto}
                                onChange={handleChange}
                                placeholder="¿De qué se trata tu mensaje?"
                                className={errors.asunto ? 'input-error' : ''}
                            />
                            {errors.asunto && <span className="error-message">{errors.asunto}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="mensaje">Mensaje: *</label>
                            <textarea
                                id="mensaje"
                                name="mensaje"
                                rows={4}
                                value={formData.mensaje}
                                onChange={handleChange}
                                placeholder="Escribe tu mensaje aquí..."
                                className={errors.mensaje ? 'input-error' : ''}
                            ></textarea>
                            {errors.mensaje && <span className="error-message">{errors.mensaje}</span>}
                        </div>

                        <button onClick={handleSubmit} className="btn-enviar">
                            Enviar Mensaje
                        </button>
                    </div>
                </div>

                <div className="col-md-4 d-flex flex-column gap-4">

                    <div className="contacto-card">
                        <h3 className="info-titulo">Contactanos por Correo</h3>
                        <div className="contacto-info">
                            <a href="mailto:contactodengo@dengo.com" className="info-link">
                                contactodengo@dengo.com
                            </a>
                            <a href="mailto:info@dengo.com" className="info-link">
                                info@dengo.com
                            </a>
                        </div>
                    </div>


                </div>
            </div>

            <div className="mapa-section">
                <div className="mapa-wrapper">
                    <h2 className="mapa-titulo">ENCUÉNTRANOS</h2>

                    <div className="mapa-container">
                        {loading ? (
                            <div className="mapa-placeholder">
                                <div className="mapa-icono">⏳</div>
                                <p className="mapa-texto">Cargando mapa...</p>
                            </div>
                        ) : (
                            <div
                                id="leaflet-map"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    minHeight: '400px',
                                    borderRadius: '12px'
                                }}
                            ></div>
                        )}
                    </div>

                    {branches.length > 0 && (
                        <div className="sucursales-lista" style={{
                            marginTop: '24px',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '16px'
                        }}>
                            {branches.map(branch => (
                                <div key={branch.id} style={{
                                    padding: '16px',
                                    backgroundColor: '#FEF3C7',
                                    borderRadius: '12px',
                                    border: '1px solid #F59E0B'
                                }}>
                                    <h4 style={{
                                        margin: '0 0 8px 0',
                                        color: '#78350F',
                                        fontSize: '16px',
                                        fontWeight: '600'
                                    }}>
                                        {branch.nombre}
                                    </h4>
                                    <p style={{ margin: '4px 0', fontSize: '14px', color: '#92400E' }}>
                                        📍 {branch.direccion}
                                    </p>
                                    <p style={{ margin: '4px 0', fontSize: '14px', color: '#92400E' }}>
                                        📞 {branch.telefono}
                                    </p>
                                    <p style={{ margin: '4px 0', fontSize: '14px', color: '#92400E' }}>
                                        🕐 {branch.horario_apertura}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
