import React, { useEffect, useRef, useState } from 'react';
import './Usuarios.css';
import { useSidebar } from '../../../context/SidebarContext';
import { useToast } from '../../../context/MensajeContext';
import { useConfirm } from '../../../components/common/Mensaje/ConfirmModal';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../../components/layout/Sidebar';

// Constantes
const API_URL = 'http://localhost:3000/api/usuarios';
const SUCURSALES_API_URL = 'http://localhost:3000/api/sucursales';

const ESTADO_INICIAL_FORM = {
  id: 0,
  nombre: '',
  apellidos: '',
  email: '',
  password: '',
  fecha_nacimiento: '',
  genero: '',
  telefono: '',
  rol_id: '',
  sucursal_personal_id: ''
};

export const Usuarios = () => {
  const { isOpen } = useSidebar();
  const { showToast } = useToast();
  const { showConfirm } = useConfirm();
  
  // Estados
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [rolFiltro, setRolFiltro] = useState('');
  const [sucursalFiltro, setSucursalFiltro] = useState('');
  const [formData, setFormData] = useState(ESTADO_INICIAL_FORM);
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
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
    cargarRoles(); // Carga roles de forma síncrona (son estáticos)
    await Promise.all([cargarUsuarios(), cargarSucursales()]);
    setLoadingInicial(false);
  };

  const cargarUsuarios = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      if (result.success) {
        setUsuarios(result.data);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      if (usuarios.length === 0 && hasCargadoInicial.current) {
        showToast('error', 'Error de Conexión', 'No se pudieron cargar los usuarios');
      }
    }
  };

  const cargarRoles = async () => {
    // Roles fijos basados en la estructura de la API
    setRoles([
      { id: 1, nombre: 'Admin' },
      { id: 2, nombre: 'Gerente' },
      { id: 3, nombre: 'Barista' },
      { id: 4, nombre: 'Caja' }
    ]);
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
    if (!formData.nombre.trim()) {
      showToast('warning', 'Campo Requerido', 'El nombre es obligatorio');
      return false;
    }

    if (!formData.apellidos.trim()) {
      showToast('warning', 'Campo Requerido', 'Los apellidos son obligatorios');
      return false;
    }

    if (!formData.email.trim()) {
      showToast('warning', 'Campo Requerido', 'El email es obligatorio');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast('warning', 'Email Inválido', 'Ingresa un email válido');
      return false;
    }

    if (!editando && !formData.password) {
      showToast('warning', 'Campo Requerido', 'La contraseña es obligatoria');
      return false;
    }

    if (formData.password && formData.password.length < 6) {
      showToast('warning', 'Contraseña Débil', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (!formData.rol_id) {
      showToast('warning', 'Campo Requerido', 'Debes seleccionar un rol');
      return false;
    }

    if (!formData.sucursal_personal_id) {
      showToast('warning', 'Campo Requerido', 'Debes seleccionar una sucursal');
      return false;
    }

    return true;
  };

  // ========== HANDLERS ==========
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setLoading(true);
    try {
      const url = editando ? `${API_URL}/${editando}` : API_URL;
      const method = editando ? 'PUT' : 'POST';

      const userData = {
        nombre: formData.nombre || null,
        apellidos: formData.apellidos || null,
        email: formData.email,
        fecha_nacimiento: formData.fecha_nacimiento || null,
        genero: formData.genero || null,
        telefono: formData.telefono || null,
        rol_id: parseInt(formData.rol_id),
        sucursal_personal_id: parseInt(formData.sucursal_personal_id)
      };

      // Solo incluir password si hay uno nuevo
      if (formData.password) {
        userData.password = formData.password;
      }

      if (editando) userData.id = editando; // Usar el ID original del estado

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const result = await response.json();

      if (result.success) {
        await cargarUsuarios();
        resetForm();
        showToast(
          'success',
          editando ? 'Usuario Actualizado' : 'Usuario Creado',
          editando ? 'Los cambios se han guardado correctamente' : 'El usuario se ha registrado exitosamente'
        );
      } else {
        showToast('error', 'Error al Guardar', result.message || 'No se pudo completar la operación');
      }
    } catch (err) {
      console.error('Error al guardar usuario:', err);
      showToast('error', 'Error del Servidor', 'Ocurrió un problema al procesar tu solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (usuario) => {
    setEditando(usuario.id);
    setFormData({
      id: usuario.id,
      nombre: usuario.nombre || '',
      apellidos: usuario.apellidos || '',
      email: usuario.email || '',
      password: '', // No mostramos la contraseña
      fecha_nacimiento: usuario.fecha_nacimiento ? usuario.fecha_nacimiento.slice(0, 10) : '',
      genero: usuario.genero || '',
      telefono: usuario.telefono || '',
      rol_id: usuario.rol_id || '',
      sucursal_personal_id: usuario.sucursal_personal_id || ''
    });
    setMostrarFormulario(true);
  };

  const handleEliminar = async (id) => {
    const confirmed = await showConfirm({
      title: '¿Eliminar usuario?',
      message: 'Esta acción no se puede deshacer. El usuario será eliminado permanentemente.',
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
        await cargarUsuarios();
        showToast('success', 'Usuario Eliminado', 'El usuario ha sido eliminado permanentemente');
      } else {
        showToast('error', 'Error al Eliminar', 'No se pudo eliminar el usuario');
      }
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      showToast('error', 'Error del Servidor', 'No se pudo eliminar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async () => {
    const hayDatos = formData.nombre || formData.email || formData.rol_id;

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
    setBusqueda('');
    setRolFiltro('');
    setSucursalFiltro('');
  };

  // ========== UTILIDADES ==========
  const getIniciales = (nombre, apellidos) => {
    const inicialNombre = nombre ? nombre.charAt(0).toUpperCase() : '';
    const inicialApellido = apellidos ? apellidos.charAt(0).toUpperCase() : '';
    return inicialNombre + inicialApellido || '?';
  };

  const getRolColor = (rolNombre) => {
    const colores = {
      'admin': 'administrador',
      'gerente': 'gerente',
      'barista': 'barista',
      'caja': 'caja'
    };
    return colores[rolNombre?.toLowerCase()] || 'default';
  };
  // ========== DATOS CALCULADOS ==========
  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = 
      (usuario.nombre?.toLowerCase() || '').includes(busqueda.toLowerCase()) ||
      (usuario.apellidos?.toLowerCase() || '').includes(busqueda.toLowerCase()) ||
      (usuario.email?.toLowerCase() || '').includes(busqueda.toLowerCase());
    
    const matchesRol = !rolFiltro || usuario.rol_id === parseInt(rolFiltro);
    const matchesSucursal = !sucursalFiltro || usuario.sucursal_personal_id === parseInt(sucursalFiltro);
    
    return matchesSearch && matchesRol && matchesSucursal;
  });

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
      <div className="usuarios-container">
        <Sidebar />
        
        {/* Overlay de carga para operaciones */}
        {loading && <Loader />}
        
        {/* Header */}
        <div className="usuarios-header">
          <div className="usuarios-header-left">
            <h1 className="usuarios-titulo">Catálogo de Usuarios</h1>
            <p className="usuarios-breadcrumb">Clientes | Usuarios</p>
          </div>
          <button 
            className="btn-nuevo-usuario"
            onClick={() => {
              if (!mostrarFormulario) resetForm();
              setMostrarFormulario(!mostrarFormulario);
            }}
            disabled={loading}
          >
            <span className="btn-icono">+</span>
            Nuevo Usuario
          </button>
        </div>

        {/* Formulario */}
        {mostrarFormulario && (
          <div className="formulario-container">
            <h3 className="formulario-title">
              {editando ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h3>
            <form onSubmit={handleSubmit} className="formulario-evento">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: Juan"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="apellidos">Apellidos</label>
                  <input
                    type="text"
                    id="apellidos"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: Pérez López"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="usuario@dango.com"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    Contraseña {editando && '(dejar vacío para no cambiar)'}
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editando}
                    placeholder="Mínimo 6 caracteres"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    id="fecha_nacimiento"
                    name="fecha_nacimiento"
                    value={formData.fecha_nacimiento}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="genero">Género</label>
                  <select
                    id="genero"
                    name="genero"
                    value={formData.genero}
                    onChange={handleInputChange}
                    className="filtro-select"
                    disabled={loading}
                  >
                    <option value="">Selecciona un género</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                    <option value="Prefiero no decir">Prefiero no decir</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="telefono">Teléfono</label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="(477) 123-4567"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="rol_id">Rol</label>
                  <select
                    id="rol_id"
                    name="rol_id"
                    value={formData.rol_id}
                    onChange={handleInputChange}
                    required
                    className="filtro-select"
                    disabled={loading}
                  >
                    <option value="">Selecciona un rol</option>
                    {roles.map(rol => (
                      <option key={rol.id} value={rol.id}>
                        {rol.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="sucursal_personal_id">Sucursal</label>
                  <select
                    id="sucursal_personal_id"
                    name="sucursal_personal_id"
                    value={formData.sucursal_personal_id}
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
                  {loading ? 'Guardando...' : (editando ? 'Actualizar Usuario' : 'Guardar Usuario')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filtros */}
        <div className="usuarios-filtros">
          <div className="filtros-grid">
            <div className="filtro-group">
              <label>Buscar</label>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="filtro-input"
                placeholder="Nombre, apellidos o email..."
                disabled={loading}
              />
            </div>

            <div className="filtro-group">
              <label>Rol</label>
              <select
                value={rolFiltro}
                onChange={(e) => setRolFiltro(e.target.value)}
                className="filtro-select"
                disabled={loading}
              >
                <option value="">Todos los roles</option>
                {roles.map(rol => (
                  <option key={rol.id} value={rol.id}>
                    {rol.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="filtro-group">
              <label>Sucursal</label>
              <select
                value={sucursalFiltro}
                onChange={(e) => setSucursalFiltro(e.target.value)}
                className="filtro-select"
                disabled={loading}
              >
                <option value="">Todas las sucursales</option>
                {sucursales.map(sucursal => (
                  <option key={sucursal.id} value={sucursal.id}>
                    {sucursal.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button 
            onClick={limpiarFiltros} 
            className="btn-filtrar"
            disabled={loading}
          >
            Limpiar Filtros
          </button>
        </div>

        {/* Lista de Usuarios */}
        <div className="usuarios-lista">
          <div className="lista-header">
            <h2 className="lista-titulo">Lista de Usuarios</h2>
            <p className="lista-subtitulo">Total: {filteredUsuarios.length} usuarios</p>
          </div>

          <div className="tabla-container">
            <table className="usuarios-tabla">
              <thead>
                <tr>
                  <th>USUARIO</th>
                  <th>ROL</th>
                  <th>SUCURSAL</th>
                  <th>TELÉFONO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsuarios.length > 0 ? (
                  filteredUsuarios.map((usuario) => (
                    <tr key={usuario.id}>
                      <td>
                        <div className="usuario-info">
                          <div className="usuario-avatar">
                            {getIniciales(usuario.nombre, usuario.apellidos)}
                          </div>
                          <div className="usuario-datos">
                            <p className="usuario-nombre">
                              {usuario.nombre || 'Sin nombre'} {usuario.apellidos || ''}
                            </p>
                            <p className="usuario-email">{usuario.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`rol-badge rol-${getRolColor(usuario.roles?.rol)}`}>
                          {usuario.roles?.rol || 'Sin rol'}
                        </span>
                      </td>
                      <td className="usuario-sucursal">
                        {usuario.sucursales?.nombre || 'Sin sucursal'}
                      </td>
                      <td className="usuario-telefono">{usuario.telefono || 'N/A'}</td>
                      <td>
                        <div className="acciones-tabla">
                          <button
                            className="btn-accion-tabla btn-editar-tabla"
                            onClick={() => handleEditar(usuario)}
                            disabled={loading}
                            title="Editar usuario"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-accion-tabla btn-eliminar-tabla"
                            onClick={() => handleEliminar(usuario.id)}
                            disabled={loading}
                            title="Eliminar usuario"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-results">
                      No se encontraron usuarios
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Outlet />
    </main>
  );
};