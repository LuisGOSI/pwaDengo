import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import './Promociones.css';
import Sidebar from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../context/SidebarContext';
import { Outlet } from 'react-router-dom';
import { useToast } from '../../../context/MensajeContext';
import { useConfirm } from '../../../components/common/Mensaje/ConfirmModal';

export const Promociones = () => {
    const { isOpen } = useSidebar();
    const { showToast } = useToast();
    const { showConfirm } = useConfirm();

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editando, setEditando] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [setLoading] = useState(false);
    const [filtros, setFiltros] = useState({
        tipo: '',
        estado: '',
        nivel: ''
    });
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        tipo_promocion: '',
        porcentaje_descuento: '',
        monto_descuento: '',
        inicia_en: '',
        termina_en: '',
        nivel_objetivo_id: ''
    });

    const [promociones, setPromociones] = useState([]);

    const API_URL = 'https://dengo-back.onrender.com/api/promociones';

    // Función para obtener el ID del usuario autenticado
    const getUserId = () => {
        const authData = localStorage.getItem('sb-shhqnshtevgwqguwjrci-auth-token');
        if (authData) {
            try {
                const parsed = JSON.parse(authData);
                return parsed.user?.id;
            } catch (err) {
                console.error('Error al parsear datos de usuario:', err);
                return null;
            }
        }
        return null;
    };

    useEffect(() => {
        cargarPromociones();
    }, []);

    const cargarPromociones = async () => {
        try {
            const response = await fetch(API_URL);
            const result = await response.json();

            if (result.success) {
                setPromociones(result.data);
            }
        } catch (err) {
            console.error('Error al cargar promociones:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validarPromocion = () => {
        // Título
        if (!formData.titulo.trim()) {
            showToast("warning", "Campo requerido", "El título de la promoción es obligatorio.");
            return false;
        }

        // Descripción
        if (!formData.descripcion.trim()) {
            showToast("warning", "Campo requerido", "La descripción es obligatoria.");
            return false;
        }

        // Tipo de promoción
        if (!formData.tipo_promocion.trim()) {
            showToast("warning", "Campo requerido", "Debes seleccionar un tipo de promoción.");
            return false;
        }

        // Validación de descuentos
        const tienePorcentaje = formData.porcentaje_descuento !== "";
        const tieneMonto = formData.monto_descuento !== "";

        // Debe tener al menos uno
        if (!tienePorcentaje && !tieneMonto) {
            showToast(
                "warning",
                "Descuento requerido",
                "Debes ingresar porcentaje de descuento o monto fijo."
            );
            return false;
        }

        // Si tiene porcentaje debe ser válido
        if (tienePorcentaje) {
            const porcentaje = parseFloat(formData.porcentaje_descuento);
            if (isNaN(porcentaje) || porcentaje <= 0 || porcentaje > 100) {
                showToast(
                    "warning",
                    "Porcentaje inválido",
                    "El porcentaje debe ser mayor a 0 y máximo 100."
                );
                return false;
            }
        }

        // Si tiene monto debe ser válido
        if (tieneMonto) {
            const monto = parseFloat(formData.monto_descuento);
            if (isNaN(monto) || monto <= 0) {
                showToast(
                    "warning",
                    "Monto inválido",
                    "El monto fijo debe ser mayor a 0."
                );
                return false;
            }
        }

        // Fechas
        if (!formData.inicia_en || !formData.termina_en) {
            showToast(
                "warning",
                "Fechas requeridas",
                "Debes seleccionar fecha de inicio y fecha de fin."
            );
            return false;
        }

        if (formData.inicia_en >= formData.termina_en) {
            showToast(
                "warning",
                "Rango de fechas inválido",
                "La fecha de inicio debe ser menor a la fecha de fin."
            );
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
        if (!validarPromocion()) return;

        try {
            const url = editando ? `${API_URL}/${editando}` : API_URL;
            const method = editando ? 'PUT' : 'POST';

            const userId = getUserId();
            if (!userId) {
                showToast("error", "Usuario no autenticado", "Debes iniciar sesión nuevamente.");
                return;
            }

            const payload = {
                titulo: formData.titulo.trim(),
                descripcion: formData.descripcion.trim(),
                tipo_promocion: formData.tipo_promocion,
                inicia_en: formData.inicia_en,
                termina_en: formData.termina_en,
                nivel_objetivo_id: formData.nivel_objetivo_id || null,
                creada_por: userId
            };

            if (formData.porcentaje_descuento) {
                payload.porcentaje_descuento = parseFloat(formData.porcentaje_descuento);
            }
            if (formData.monto_descuento) {
                payload.monto_descuento = parseFloat(formData.monto_descuento);
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.success) {
                await cargarPromociones();
                resetForm();

                showToast(
                    "success",
                    editando ? "Promoción Actualizada" : "Promoción Registrada",
                    editando
                        ? "Los cambios se han guardado correctamente."
                        : "La promoción ha sido creada exitosamente."
                );
            } else {
                showToast("error", "Error al Guardar", result.message || "Ocurrió un error inesperado.");
            }
        } catch (err) {
            console.error("Error al guardar promoción:", err);
            showToast("error", "Error del Servidor", "Hubo un problema al guardar la promoción.");
        }
    };

    const handleEditar = (promocion) => {
        setEditando(promocion.id);
        setFormData({
            titulo: promocion.titulo,
            descripcion: promocion.descripcion || '',
            tipo_promocion: promocion.tipo_promocion || '',
            porcentaje_descuento: promocion.porcentaje_descuento || '',
            monto_descuento: promocion.monto_descuento || '',
            inicia_en: promocion.inicia_en ? promocion.inicia_en.substring(0, 16) : '',
            termina_en: promocion.termina_en ? promocion.termina_en.substring(0, 16) : '',
            nivel_objetivo_id: promocion.nivel_objetivo_id || ''
        });
        setMostrarFormulario(true);
    };

    const handleToggleActiva = async (id, activaActual) => {
        const confirmed = await showConfirm({
            title: '¿Desactivar esta promoción?',
            message: 'Esta acción no se puede deshacer. La promoción se desactivará.',
            confirmText: 'Sí, desactivar',
            cancelText: 'Cancelar',
            type: 'danger'
        });

        if (!confirmed) return;
        setLoading(true);

        try {
            const method = activaActual ? 'DELETE' : 'PATCH';
            const url = activaActual ? `${API_URL}/${id}` : `${API_URL}/${id}/habilitar`;

            const response = await fetch(url, { method });
            const result = await response.json();

            if (result.success) {
                await cargarPromociones();

                showToast(
                    "success",
                    activaActual ? "Promoción Desactivada" : "Promoción Activada",
                    activaActual
                        ? "La promoción ahora está inactiva."
                        : "La promoción ha sido activada."
                );
            }
        } catch (err) {
            console.error("Error al cambiar estado:", err);
            showToast("error", "Error al cambiar estado", "No se pudo actualizar la promoción.");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            titulo: '',
            descripcion: '',
            tipo_promocion: '',
            porcentaje_descuento: '',
            monto_descuento: '',
            inicia_en: '',
            termina_en: '',
            nivel_objetivo_id: ''
        });
        setMostrarFormulario(false);
        setEditando(null);
    };

    const handleCancelar = async () => {
        const hayDatos = formData.titulo || formData.descripcion || formData.sucursal_id;

        if (hayDatos) {
            const confirmed = await showConfirm({
                title: '¿Descartar cambios?',
                message: 'Los datos que ingresaste se perderán si no los guardas.',
                confirmText: 'Sí, descartar',
                cancelText: 'Continuar editando',
                type: 'warning'
            });

            if (confirmed) {
                resetForm();
                showToast('warning', 'Acción Cancelada', 'Se han descartado los cambios');
            }
        } else {
            resetForm();
        }
    };

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros({
            ...filtros,
            [name]: value
        });
    };

    const limpiarFiltros = () => {
        setFiltros({
            tipo: '',
            estado: '',
            nivel: ''
        });
        setSearchTerm('');
    };

    const filteredPromociones = promociones.filter(promocion => {
        const matchesSearch = promocion.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (promocion.descripcion && promocion.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesTipo = !filtros.tipo || promocion.tipo_promocion === filtros.tipo;

        const matchesEstado = !filtros.estado ||
            (filtros.estado === 'activa' && promocion.activa) ||
            (filtros.estado === 'inactiva' && !promocion.activa);

        const matchesNivel = !filtros.nivel ||
            (filtros.nivel === 'todos' && !promocion.nivel_objetivo_id) ||
            promocion.nivel_objetivo_id?.toString() === filtros.nivel;

        return matchesSearch && matchesTipo && matchesEstado && matchesNivel;
    });

    const getColorForIndex = (index) => {
        const colors = ['#FF6B35', '#4ECDC4', '#95E1D3', '#F38181', '#FFB6C1', '#9B59B6'];
        return colors[index % colors.length];
    };

    const formatFecha = (fecha) => {
        if (!fecha) return '';
        const date = new Date(fecha);
        return date.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit' });
    };

    return (
        <main className={`main-content ${!isOpen ? 'sidebar-closed' : ''}`}>
            <div className="promociones-container">
                <Sidebar />
                <div className="promociones-header">
                    <div className="promociones-header-left">
                        <h1 className="promociones-titulo">Catálogo de Promociones</h1>
                        <p className="promociones-breadcrumb">Marketing | Promociones</p>
                    </div>
                    <button
                        className="btn-nueva-promocion"
                        onClick={() => {
                            if (!mostrarFormulario) {
                                resetForm();
                            }
                            setMostrarFormulario(!mostrarFormulario);
                        }}
                    >
                        <Plus size={20} className="btn-icono" />
                        <span>Nueva Promoción</span>
                    </button>
                </div>

                {mostrarFormulario && (
                    <div className="formulario-container">
                        <h3 className="formulario-title">
                            {editando ? 'Editar Promoción' : 'Nueva Promoción'}
                        </h3>
                        <form onSubmit={handleSubmit} className="formulario-promocion">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="titulo">Título</label>
                                    <input
                                        type="text"
                                        id="titulo"
                                        name="titulo"
                                        value={formData.titulo}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Ej: Descuento de Bienvenida"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="tipo_promocion">Tipo</label>
                                    <select
                                        id="tipo_promocion"
                                        name="tipo_promocion"
                                        value={formData.tipo_promocion}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Seleccionar tipo</option>
                                        <option value="descuento">Descuento</option>
                                        <option value="combo">Combo</option>
                                        <option value="puntos">Puntos</option>
                                        <option value="personalizado">Personalizado</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="descripcion">Descripción</label>
                                <input
                                    type="text"
                                    id="descripcion"
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Ej: 10% de descuento para nuevos clientes"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="porcentaje_descuento">Porcentaje (%)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        id="porcentaje_descuento"
                                        name="porcentaje_descuento"
                                        value={formData.porcentaje_descuento}
                                        onChange={handleInputChange}
                                        placeholder="Ej: 10"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="monto_descuento">Monto Fijo ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        id="monto_descuento"
                                        name="monto_descuento"
                                        value={formData.monto_descuento}
                                        onChange={handleInputChange}
                                        placeholder="Ej: 50"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="nivel_objetivo_id">Nivel Objetivo</label>
                                    <select
                                        id="nivel_objetivo_id"
                                        name="nivel_objetivo_id"
                                        value={formData.nivel_objetivo_id}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Todos los niveles</option>
                                        <option value="1">Bronce</option>
                                        <option value="2">Plata</option>
                                        <option value="3">Oro</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="inicia_en">Fecha Inicio</label>
                                    <input
                                        type="datetime-local"
                                        id="inicia_en"
                                        name="inicia_en"
                                        value={formData.inicia_en}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="termina_en">Fecha Fin</label>
                                    <input
                                        type="datetime-local"
                                        id="termina_en"
                                        name="termina_en"
                                        value={formData.termina_en}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn-cancelar" onClick={handleCancelar}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-guardar">
                                    {editando ? 'Actualizar Promoción' : 'Guardar Promoción'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="promociones-filtros">
                    <div className="filtros-grid">
                        <div className="filtro-group">
                            <label>Buscar</label>
                            <input
                                type="text"
                                className="filtro-input"
                                placeholder="Buscar promoción..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="filtro-group">
                            <label>Tipo</label>
                            <select
                                className="filtro-select"
                                name="tipo"
                                value={filtros.tipo}
                                onChange={handleFiltroChange}
                            >
                                <option value="">Todos</option>
                                <option value="descuento">Descuento</option>
                                <option value="combo">Combo</option>
                                <option value="puntos">Puntos</option>
                                <option value="personalizado">Personalizado</option>
                            </select>
                        </div>
                        <div className="filtro-group">
                            <label>Estado</label>
                            <select
                                className="filtro-select"
                                name="estado"
                                value={filtros.estado}
                                onChange={handleFiltroChange}
                            >
                                <option value="">Todos</option>
                                <option value="activa">Activa</option>
                                <option value="inactiva">Inactiva</option>
                            </select>
                        </div>
                        <div className="filtro-group">
                            <label>Nivel</label>
                            <select
                                className="filtro-select"
                                name="nivel"
                                value={filtros.nivel}
                                onChange={handleFiltroChange}
                            >
                                <option value="">Todos</option>
                                <option value="todos">Sin nivel específico</option>
                                <option value="1">Bronce</option>
                                <option value="2">Plata</option>
                                <option value="3">Oro</option>
                            </select>
                        </div>
                    </div>
                    <button className="btn-limpiar-filtros" onClick={limpiarFiltros}>
                        Limpiar Filtros
                    </button>
                </div>

                {/* Lista de Promociones */}
                <div className="promociones-lista">
                    <div className="lista-header">
                        <h2 className="lista-titulo">Lista de Promociones</h2>
                        <p className="lista-subtitulo">Total: {filteredPromociones.length} promociones</p>
                    </div>

                    <div className="tabla-container">
                        <table className="promociones-tabla">
                            <thead>
                                <tr>
                                    <th>PROMOCIÓN</th>
                                    <th>TIPO</th>
                                    <th>NIVEL</th>
                                    <th>DESCUENTO</th>
                                    <th>VIGENCIA</th>
                                    <th>ESTADO</th>
                                    <th>ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPromociones.map((promocion, index) => (
                                    <tr key={promocion.id}>
                                        <td>
                                            <div className="promocion-info">
                                                <div
                                                    className="promocion-avatar"
                                                    style={{ backgroundColor: getColorForIndex(index) }}
                                                >
                                                    {promocion.titulo.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div className="promocion-datos">
                                                    <p className="promocion-nombre">{promocion.titulo}</p>
                                                    <p className="promocion-descripcion">{promocion.descripcion}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`tipo-badge tipo-${promocion.tipo_promocion}`}>
                                                {promocion.tipo_promocion}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="promocion-nivel">
                                                {promocion.niveles_cuenta?.codigo_nivel || 'Todos'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="promocion-descuento">
                                                {promocion.porcentaje_descuento ? `${promocion.porcentaje_descuento}%` : `$${promocion.monto_descuento}`}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="promocion-vigencia">
                                                {formatFecha(promocion.inicia_en)} - {formatFecha(promocion.termina_en)}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`estado-badge ${promocion.activa ? 'estado-activo' : 'estado-inactivo'}`}>
                                                {promocion.activa ? 'Activa' : 'Inactiva'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="promocion-acciones">
                                                <button
                                                    onClick={() => handleEditar(promocion)}
                                                    className="btn-accion btn-editar"
                                                    title="Editar"
                                                >
                                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleToggleActiva(promocion.id, promocion.activa)}
                                                    className={`btn-accion ${promocion.activa ? 'btn-desactivar' : 'btn-activar'}`}
                                                    title={promocion.activa ? 'Desactivar' : 'Activar'}
                                                >
                                                    {promocion.activa ? (
                                                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                        </svg>
                                                    ) : (
                                                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredPromociones.length === 0 && (
                        <div className="no-results">
                            No se encontraron promociones
                        </div>
                    )}
                </div>
            </div>
            <Outlet />
        </main>
    );
};