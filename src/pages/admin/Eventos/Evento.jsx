import React, { useEffect, useRef, useState } from 'react';
import './Evento.css';
import { Outlet } from 'react-router-dom';
import { useSidebar } from '../../../context/SidebarContext';
import { useToast } from '../../../context/MensajeContext';
import { useConfirm } from '../../../components/common/Mensaje/ConfirmModal';
import Sidebar from '../../../components/layout/Sidebar';

// Constantes
const API_URL = 'http://localhost:3000/api/eventos';
const SUCURSALES_API_URL = 'http://localhost:3000/api/sucursales';
const COLORES_CARDS = ['#FF6B35', '#4ECDC4', '#95E1D3', '#F38181', '#FFB6C1', '#9B59B6'];

const ESTADO_INICIAL_FORM = {
  id: 0,
  titulo: '',
  descripcion: '',
  sucursal_id: '',
  inicia_en: '',
  termina_en: '',
  capacidad: 0,
  activo: true
};

export const Eventos = () => {
  const { isOpen } = useSidebar();
  const { showToast } = useToast();
  const { showConfirm } = useConfirm();
  
  // Estados
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState(ESTADO_INICIAL_FORM);
  const [eventos, setEventos] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingInicial, setLoadingInicial] = useState(true);
  
  // Refs
  const hasCargadoInicial = useRef(false);

  // Cargar datos iniciales
  useEffect(() => {
    if (!hasCargadoInicial.current) {
      hasCargadoInicial.current = true;
      cargarDatosIniciales();
    }
  });

  // ========== API CALLS ==========
  const cargarDatosIniciales = async () => {
    setLoadingInicial(true);
    await Promise.all([cargarEventos(), cargarSucursales()]);
    setLoadingInicial(false);
  };

  const cargarEventos = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      if (result.success) {
        setEventos(result.data);
      }
    } catch (error) {
      console.error('Error al cargar eventos:', error);
      if (eventos.length === 0 && hasCargadoInicial.current) {
        showToast('error', 'Error de Conexión', 'No se pudieron cargar los eventos');
      }
    }
  };

  const cargarSucursales = async () => {
    try {
      const response = await fetch(SUCURSALES_API_URL);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      if (result.success) {
        setSucursales(result.data.filter(s => s.activa));
      }
    } catch (error) {
      console.error('Error al cargar sucursales:', error);
      if (sucursales.length === 0 && hasCargadoInicial.current) {
        showToast('error', 'Error de Conexión', 'No se pudieron cargar las sucursales');
      }
    }
  };

  // ========== VALIDACIONES ==========
  const validarFormulario = () => {
    if (!formData.titulo.trim()) {
      showToast('warning', 'Campo Requerido', 'El título del evento es obligatorio');
      return false;
    }

    if (!formData.sucursal_id) {
      showToast('warning', 'Campo Requerido', 'Debes seleccionar una sucursal');
      return false;
    }

    if (new Date(formData.termina_en) <= new Date(formData.inicia_en)) {
      showToast('warning', 'Fechas Inválidas', 'La fecha de término debe ser posterior al inicio');
      return false;
    }

    return true;
  };

  // ========== HANDLERS ==========
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setLoading(true);
    try {
      const url = editando ? `${API_URL}/${editando}` : API_URL;
      const method = editando ? 'PUT' : 'POST';

      const eventData = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        sucursal_id: parseInt(formData.sucursal_id),
        inicia_en: formData.inicia_en,
        termina_en: formData.termina_en,
        capacidad: parseInt(formData.capacidad),
        activo: formData.activo
      };

      if (editando) eventData.id = parseInt(formData.id);

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });

      const result = await response.json();

      if (result.success) {
        await cargarEventos();
        resetForm();
        showToast(
          'success',
          editando ? 'Evento Actualizado' : 'Evento Creado',
          editando ? 'Los cambios se han guardado correctamente' : 'El evento se ha registrado exitosamente'
        );
      } else {
        showToast('error', 'Error al Guardar', result.message || 'No se pudo completar la operación');
      }
    } catch (err) {
      console.error('Error al guardar evento:', err);
      showToast('error', 'Error del Servidor', 'Ocurrió un problema al procesar tu solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (evento) => {
    setEditando(evento.id);
    setFormData({
      id: evento.id,
      titulo: evento.titulo,
      descripcion: evento.descripcion || '',
      sucursal_id: evento.sucursal_id || '',
      inicia_en: evento.inicia_en ? evento.inicia_en.slice(0, 16) : '',
      termina_en: evento.termina_en ? evento.termina_en.slice(0, 16) : '',
      capacidad: evento.capacidad || 0,
      activo: evento.activo
    });
    setMostrarFormulario(true);
  };

  const handleEliminar = async (id) => {
    const confirmed = await showConfirm({
      title: '¿Eliminar evento?',
      message: 'Esta acción no se puede deshacer. El evento será eliminado permanentemente.',
      confirmText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      type: 'danger'
    });

    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const result = await response.json();

      if (result.success) {
        await cargarEventos();
        showToast('success', 'Evento Eliminado', 'El evento ha sido eliminado permanentemente');
      } else {
        showToast('error', 'Error al Eliminar', 'No se pudo eliminar el evento');
      }
    } catch (err) {
      console.error('Error al eliminar evento:', err);
      showToast('error', 'Error del Servidor', 'No se pudo eliminar el evento');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActivo = async (id, activoActual) => {
    const nuevoEstado = !activoActual;
    const accion = nuevoEstado ? 'activar' : 'desactivar';

    const confirmed = await showConfirm({
      title: `¿${nuevoEstado ? 'Activar' : 'Desactivar'} evento?`,
      message: `El evento será ${accion}do y ${nuevoEstado ? 'estará visible' : 'quedará oculto'}.`,
      confirmText: `Sí, ${accion}`,
      cancelText: 'Cancelar',
      type: nuevoEstado ? 'info' : 'warning'
    });

    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: nuevoEstado })
      });

      const result = await response.json();

      if (result.success) {
        await cargarEventos();
        showToast('success', 'Estado Actualizado', `El evento ha sido ${accion}do correctamente`);
      } else {
        showToast('error', 'Error al Cambiar Estado', 'No se pudo actualizar el estado');
      }
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      showToast('error', 'Error del Servidor', 'Ocurrió un problema al cambiar el estado');
    } finally {
      setLoading(false);
    }
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

  const resetForm = () => {
    setFormData(ESTADO_INICIAL_FORM);
    setMostrarFormulario(false);
    setEditando(null);
  };

  const limpiarFiltros = () => {
    setSearchTerm('');
  };

  // ========== UTILIDADES ==========
  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatearHora = (fecha) => {
    if (!fecha) return '';
    return new Date(fecha).toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getColorForIndex = (index) => COLORES_CARDS[index % COLORES_CARDS.length];

  // ========== DATOS CALCULADOS ==========
  const filteredEventos = eventos.filter(evento => {
    const matchesSearch = evento.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (evento.descripcion && evento.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const eventosActivos = eventos.filter(e => e.activo).length;
  const proximosEventos = eventos.filter(e => new Date(e.inicia_en) > new Date()).length;

  // ========== COMPONENTE LOADER ==========
  const Loader = () => (
    <div className="loading-overlay">
      <div className="loading">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );

  // Si está cargando los datos iniciales, mostrar loader de pantalla completa
  if (loadingInicial) {
    return (
      <main className={`main-content ${!isOpen ? 'sidebar-closed' : ''}`}>
        <Sidebar />
        <Loader />
      </main>
    );
  }

  // ========== RENDER ==========
  return (
    <main className={`main-content ${!isOpen ? 'sidebar-closed' : ''}`}>
      <div className="eventos-container">
        <Sidebar />
        
        {/* Overlay de carga para operaciones */}
        {loading && <Loader />}
        
        {/* Header */}
        <div className="eventos-header">
          <div className="eventos-header-left">
            <h1 className="eventos-titulo">Eventos</h1>
            <p className="eventos-breadcrumb">Marketing | Eventos</p>
          </div>
          <button 
            className="btn-nuevo-evento" 
            onClick={() => {
              if (!mostrarFormulario) resetForm();
              setMostrarFormulario(!mostrarFormulario);
            }}
            disabled={loading}
          >
            <span className="btn-icono">+</span>
            Nuevo Evento
          </button>
        </div>

        {/* Formulario */}
        {mostrarFormulario && (
          <div className="formulario-container">
            <h3 className="formulario-title">
              {editando ? 'Editar Evento' : 'Nuevo Evento'}
            </h3>
            <form onSubmit={handleSubmit} className="formulario-evento">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="titulo">Título del Evento</label>
                  <input
                    type="text"
                    id="titulo"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: Degustación de Vinos"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="sucursal_id">Sucursal</label>
                  <select
                    id="sucursal_id"
                    name="sucursal_id"
                    value={formData.sucursal_id}
                    onChange={handleInputChange}
                    required
                    className="filtro-select"
                    disabled={loading}
                  >
                    <option value="">Selecciona una sucursal</option>
                    {sucursales.map(sucursal => (
                      <option key={sucursal.id} value={sucursal.id}>
                        {sucursal.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="capacidad">Capacidad</label>
                  <input
                    type="number"
                    id="capacidad"
                    name="capacidad"
                    value={formData.capacidad}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: 50"
                    min="1"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="inicia_en">Fecha y Hora de Inicio</label>
                  <input
                    type="datetime-local"
                    id="inicia_en"
                    name="inicia_en"
                    value={formData.inicia_en}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="termina_en">Fecha y Hora de Término</label>
                  <input
                    type="datetime-local"
                    id="termina_en"
                    name="termina_en"
                    value={formData.termina_en}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  required
                  placeholder="Describe el evento..."
                  rows="3"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  <span>Evento Activo</span>
                </label>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-cancelar" 
                  onClick={handleCancelar}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-guardar"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : (editando ? 'Actualizar Evento' : 'Guardar Evento')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats Cards */}
        <div className="eventos-stats">
          <div className="stat-card">
            <p className="stat-label">Total de eventos</p>
            <p className="stat-value">{eventos.length}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Eventos activos</p>
            <p className="stat-value">{eventosActivos}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Próximos</p>
            <p className="stat-value">{proximosEventos}</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="eventos-filtros">
          <div className="filtros-row">
            <div className="filtro-group">
              <label>Buscar evento</label>
              <input
                type="text"
                placeholder="Buscar por título o descripción..."
                className="filtro-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <button 
            className="btn-filtrar" 
            onClick={limpiarFiltros}
            disabled={loading}
          >
            Limpiar Filtros
          </button>
        </div>

        {/* Lista de Eventos */}
        <div className="eventos-lista">
          {filteredEventos.length > 0 ? (
            filteredEventos.map((evento, index) => (
              <div key={evento.id} className="evento-card">
                <div
                  className="evento-imagen"
                  style={{ backgroundColor: getColorForIndex(index) }}
                >
                  <span className="evento-badge">
                    {evento.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="evento-contenido">
                  <h3 className="evento-titulo-card">{evento.titulo}</h3>
                  <p className="evento-descripcion">{evento.descripcion}</p>
                  <div className="evento-detalles">
                    <p className="evento-detalle">
                      📍 {evento.sucursales?.nombre || 'Sin sucursal'}
                    </p>
                    <p className="evento-detalle">
                      📅 Inicia en: {formatearFecha(evento.inicia_en)}
                    </p>
                    <p className="evento-detalle">
                      📅 Termina en: {formatearFecha(evento.termina_en)}
                    </p>
                    <p className="evento-detalle">
                      🕐 En horario de: {formatearHora(evento.inicia_en)} - {formatearHora(evento.termina_en)}
                    </p>
                    <p className="evento-detalle">
                      👥 Capacidad: {evento.capacidad}
                    </p>
                  </div>
                  <div className="evento-acciones">
                    <button
                      className="btn-accion btn-editar"
                      onClick={() => handleEditar(evento)}
                      disabled={loading}
                    >
                      Editar
                    </button>
                    <button
                      className={`btn-accion ${evento.activo ? 'btn-desactivar' : 'btn-activar'}`}
                      onClick={() => handleToggleActivo(evento.id, evento.activo)}
                      disabled={loading}
                    >
                      {evento.activo ? 'Desactivar' : 'Activar'}
                    </button>
                    <button
                      className="btn-accion btn-eliminar"
                      onClick={() => handleEliminar(evento.id)}
                      disabled={loading}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              No se encontraron eventos
            </div>
          )}
        </div>
      </div>
      <Outlet />
    </main>
  );
};