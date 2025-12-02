import React, { useEffect, useState } from 'react';
import './ProductosComunidad.css';
import Sidebar from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../context/SidebarContext';
import { Outlet } from 'react-router-dom';
import { useAPI } from '../../../utils/UseAPI';
import { conf } from '../../../conf';
import Modal from '../../../components/common/Modal';
import { useToast } from '../../../context/MensajeContext';

export const ProductosComunidad = () => {
    const { isOpen } = useSidebar();
    const [recetas, setRecetas] = useState([]);
    const [loading, setLoading] = useState(false);
    const { get, post } = useAPI(`${conf.BACKEND_URL}/api/`);
    const { showToast } = useToast();

    // Estados para modales
    const [modalAprobar, setModalAprobar] = useState({ isOpen: false, receta: null });
    const [modalRechazar, setModalRechazar] = useState({ isOpen: false, receta: null });

    const [filtros, setFiltros] = useState({
        busqueda: ''
    });

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Cargar recetas pendientes
    const cargarRecetas = async () => {
        setLoading(true);
        try {
            const response = await get('comunidad/pendientes');
            if (response.success) {
                setRecetas(response.data);
            } else {
                console.error('Error al cargar recetas:', response);
                showToast('error', 'Error de carga', 'No se pudieron cargar las recetas pendientes');
            }
        } catch (error) {
            console.error('Error al cargar recetas:', error);
            showToast('error', 'Error de conexión', 'No se pudo conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarRecetas();
    }, []);

    // Filtrar recetas
    const recetasFiltradas = recetas.filter(receta => {
        const matchBusqueda = receta.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
            receta.descripcion.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
            receta.usuarios.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase());

        return matchBusqueda;
    });

    const limpiarFiltros = () => {
        setFiltros({
            busqueda: ''
        });
    };

    const getIniciales = (nombre) => {
        return nombre
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    // Manejar aprobación de receta
    const handleAprobar = (receta) => {
        setModalAprobar({ isOpen: true, receta });
    };

    const confirmarAprobacion = async () => {
        if (!modalAprobar.receta) return;
        
        setLoading(true);
        try {
            const response = await post('comunidad/aprobar', { id: modalAprobar.receta.id });
            if (response.success || response.data) {
                showToast('success', 'Receta aprobada', `La receta "${modalAprobar.receta.nombre}" ha sido aprobada exitosamente`);
                await cargarRecetas(); // Recargar la lista
            } else {
                console.error('Error al aprobar receta:', response);
                showToast('error', 'Error al aprobar', 'No se pudo aprobar la receta');
            }
        } catch (error) {
            console.error('Error al aprobar receta:', error);
            showToast('error', 'Error de conexión', 'No se pudo procesar la aprobación');
        } finally {
            setLoading(false);
            setModalAprobar({ isOpen: false, receta: null });
        }
    };

    // Manejar rechazo de receta
    const handleRechazar = (receta) => {
        setModalRechazar({ isOpen: true, receta });
    };

    const confirmarRechazo = async () => {
        if (!modalRechazar.receta) return;
        
        setLoading(true);
        try {
            const response = await post('comunidad/rechazar', { id: modalRechazar.receta.id });
            if (response.success || response.data) {
                showToast('success', 'Receta rechazada', `La receta "${modalRechazar.receta.nombre}" ha sido rechazada`);
                await cargarRecetas(); // Recargar la lista
            } else {
                console.error('Error al rechazar receta:', response);
                showToast('error', 'Error al rechazar', 'No se pudo rechazar la receta');
            }
        } catch (error) {
            console.error('Error al rechazar receta:', error);
            showToast('error', 'Error de conexión', 'No se pudo procesar el rechazo');
        } finally {
            setLoading(false);
            setModalRechazar({ isOpen: false, receta: null });
        }
    };

    return (
        <main className={`main-content ${!isOpen ? 'sidebar-closed' : ''}`}>
            <div className="productos-container">
                <Sidebar />
                
                {/* Header */}
                <div className="productos-header">
                    <div className="productos-header-left">
                        <h1 className="productos-titulo">Recetas de la Comunidad</h1>
                        <p className="productos-breadcrumb">Administración / Recetas Comunidad</p>
                    </div>
                </div>

                {/* Filtros */}
                <div className="productos-filtros">
                    <div className="filtros-grid">
                        <div className="filtro-group">
                            <label>Buscar receta</label>
                            <input
                                type="text"
                                className="filtro-input"
                                placeholder="Nombre de receta, descripción o creador..."
                                name="busqueda"
                                value={filtros.busqueda}
                                onChange={handleFiltroChange}
                            />
                        </div>

                        <div className="filtro-group" style={{ alignSelf: 'flex-end' }}>
                            <button
                                className="btn-filtrar"
                                onClick={limpiarFiltros}
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lista de Recetas */}
                <div className="productos-lista">
                    <div className="lista-header">
                        <h2 className="lista-titulo">Recetas Pendientes de Aprobación</h2>
                        <p className="lista-subtitulo">
                            {loading ? 'Cargando...' : `Mostrando ${recetasFiltradas.length} de ${recetas.length} recetas pendientes`}
                        </p>
                    </div>

                    <div className="tabla-container">
                        <table className="productos-tabla">
                            <thead>
                                <tr>
                                    <th>Receta</th>
                                    <th>Creador</th>
                                    <th>Descripción</th>
                                    <th>Fecha de Creación</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recetasFiltradas.map(receta => (
                                    <tr key={receta.id}>
                                        <td>
                                            <div className="producto-info">
                                                <div className="producto-avatar">
                                                    {getIniciales(receta.nombre)}
                                                </div>
                                                <div className="producto-datos">
                                                    <p className="producto-nombre">{receta.nombre}</p>
                                                    <p className="producto-tipo">Creación de la Comunidad</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="creador-info">
                                                <p className="creador-nombre">{receta.usuarios.nombre}</p>
                                                <p className="creador-id">ID: {receta.usuario_id.substring(0, 8)}...</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="descripcion-receta">
                                                <p className="descripcion-texto">
                                                    {receta.descripcion.length > 100 
                                                        ? `${receta.descripcion.substring(0, 100)}...` 
                                                        : receta.descripcion
                                                    }
                                                </p>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="fecha-info">
                                                <p className="fecha-creacion">
                                                    {new Date(receta.creado_en).toLocaleDateString('es-MX', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                                <p className="hora-creacion">
                                                    {new Date(receta.creado_en).toLocaleTimeString('es-MX', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="acciones-container">
                                                <button
                                                    className="btn-accion btn-aprobar"
                                                    title="Aprobar receta"
                                                    onClick={() => handleAprobar(receta)}
                                                    disabled={loading}
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    className="btn-accion btn-rechazar"
                                                    title="Rechazar receta"
                                                    onClick={() => handleRechazar(receta)}
                                                    disabled={loading}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {recetasFiltradas.length === 0 && !loading && (
                            <div className="tabla-vacia">
                                <p>{recetas.length === 0 ? 'No hay recetas pendientes de aprobación' : 'No se encontraron recetas con los filtros aplicados'}</p>
                            </div>
                        )}

                        {loading && (
                            <div className="tabla-vacia">
                                <p>Cargando recetas...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modales de confirmación */}
                <Modal
                    title="Aprobar Receta"
                    isOpen={modalAprobar.isOpen}
                    onClose={() => setModalAprobar({ isOpen: false, receta: null })}
                    size="medium"
                >
                    {modalAprobar.receta && (
                        <div style={{ padding: '20px 0' }}>
                            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    backgroundColor: '#10b981',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    margin: '0 auto 15px'
                                }}>
                                    {getIniciales(modalAprobar.receta.nombre)}
                                </div>
                                <h3 style={{ margin: '0 0 8px', fontSize: '18px', color: '#1a202c' }}>
                                    {modalAprobar.receta.nombre}
                                </h3>
                                <p style={{ margin: '0', color: '#718096', fontSize: '14px' }}>
                                    Creada por: {modalAprobar.receta.usuarios.nombre}
                                </p>
                            </div>

                            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f7fafc', borderRadius: '8px' }}>
                                <p style={{ margin: '0', fontSize: '14px', color: '#4a5568', lineHeight: '1.5' }}>
                                    <strong>Descripción:</strong><br />
                                    {modalAprobar.receta.descripcion}
                                </p>
                            </div>

                            <p style={{ textAlign: 'center', margin: '0 0 20px', color: '#4a5568' }}>
                                ¿Estás seguro de que deseas <strong style={{ color: '#10b981' }}>aprobar</strong> esta receta? 
                                Una vez aprobada, estará disponible en el feed de la comunidad.
                            </p>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => setModalAprobar({ isOpen: false, receta: null })}
                                    style={{
                                        padding: '10px 20px',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '6px',
                                        backgroundColor: 'white',
                                        color: '#4a5568',
                                        cursor: 'pointer'
                                    }}
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmarAprobacion}
                                    style={{
                                        padding: '10px 20px',
                                        border: 'none',
                                        borderRadius: '6px',
                                        backgroundColor: '#10b981',
                                        color: 'white',
                                        cursor: 'pointer',
                                        opacity: loading ? 0.7 : 1
                                    }}
                                    disabled={loading}
                                >
                                    {loading ? 'Aprobando...' : 'Aprobar Receta'}
                                </button>
                            </div>
                        </div>
                    )}
                </Modal>

                <Modal
                    title="Rechazar Receta"
                    isOpen={modalRechazar.isOpen}
                    onClose={() => setModalRechazar({ isOpen: false, receta: null })}
                    size="medium"
                >
                    {modalRechazar.receta && (
                        <div style={{ padding: '20px 0' }}>
                            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    backgroundColor: '#ef4444',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    margin: '0 auto 15px'
                                }}>
                                    {getIniciales(modalRechazar.receta.nombre)}
                                </div>
                                <h3 style={{ margin: '0 0 8px', fontSize: '18px', color: '#1a202c' }}>
                                    {modalRechazar.receta.nombre}
                                </h3>
                                <p style={{ margin: '0', color: '#718096', fontSize: '14px' }}>
                                    Creada por: {modalRechazar.receta.usuarios.nombre}
                                </p>
                            </div>

                            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f7fafc', borderRadius: '8px' }}>
                                <p style={{ margin: '0', fontSize: '14px', color: '#4a5568', lineHeight: '1.5' }}>
                                    <strong>Descripción:</strong><br />
                                    {modalRechazar.receta.descripcion}
                                </p>
                            </div>

                            <p style={{ textAlign: 'center', margin: '0 0 20px', color: '#4a5568' }}>
                                ¿Estás seguro de que deseas <strong style={{ color: '#ef4444' }}>rechazar</strong> esta receta? 
                                Esta acción no se puede deshacer.
                            </p>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => setModalRechazar({ isOpen: false, receta: null })}
                                    style={{
                                        padding: '10px 20px',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '6px',
                                        backgroundColor: 'white',
                                        color: '#4a5568',
                                        cursor: 'pointer'
                                    }}
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmarRechazo}
                                    style={{
                                        padding: '10px 20px',
                                        border: 'none',
                                        borderRadius: '6px',
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        cursor: 'pointer',
                                        opacity: loading ? 0.7 : 1
                                    }}
                                    disabled={loading}
                                >
                                    {loading ? 'Rechazando...' : 'Rechazar Receta'}
                                </button>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
            <Outlet />
        </main>
    );
};