import React, { useState, useEffect } from "react";
import "./Ingredientes.css";
import Sidebar from "../../../components/layout/Sidebar";
import { useSidebar } from "../../../context/SidebarContext";
import { Outlet } from "react-router-dom";
import { conf } from "../../../conf";

// Imports para feedback visual
import { useToast } from "../../../context/MensajeContext";
import { useConfirm } from "../../../components/common/Mensaje/ConfirmModal";

const API_URL = `${conf.BACKEND_URL}/api/ingredientes`;

const ESTADO_INICIAL_FORM = {
  nombre: "",
  descripcion: "",
  tipo: "",
  activo: true,
};

export const Ingredientes = () => {
  const { isOpen } = useSidebar();
  const { showToast } = useToast();
  const { showConfirm } = useConfirm();

  // Estados de datos y UI
  const [ingredientes, setIngredientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(null);
  
  // Estado del formulario
  const [formData, setFormData] = useState(ESTADO_INICIAL_FORM);

  // Estado de filtros
  const [filtros, setFiltros] = useState({
    busqueda: "",
    tipo: "",
    estado: "",
  });

  const tipos = [
    "base",
    "endulzante",
    "leche",
    "topping",
    "extra",
    "saborizante"
  ];

  useEffect(() => {
    cargarIngredientes();
  }, []);

  // ========== API CALLS ==========
  const cargarIngredientes = async () => {
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      // Ajusta esto según cómo devuelva los datos tu backend (res.data o directo)
      if (result.data) {
        setIngredientes(result.data);
      } else {
        setIngredientes(result); // Fallback si devuelve array directo
      }
    } catch (err) {
      console.error("Error cargando ingredientes:", err);
      showToast("error", "Error de conexión", "No se pudieron cargar los ingredientes");
    }
  };

  // ========== VALIDACIONES ==========
  const validarFormulario = () => {
    // 1. Nombre
    if (!formData.nombre.trim()) {
      showToast("warning", "Campo requerido", "El nombre del ingrediente es obligatorio.");
      return false;
    }

    if (formData.nombre.length < 3) {
      showToast("warning", "Nombre muy corto", "El nombre debe tener al menos 3 caracteres.");
      return false;
    }

    // 2. Tipo
    if (!formData.tipo) {
      showToast("warning", "Campo requerido", "Debes seleccionar un tipo de ingrediente.");
      return false;
    }

    // 3. Descripción (Opcional, pero si se pone, que tenga sentido)
    if (formData.descripcion && formData.descripcion.length > 100) {
      showToast("warning", "Texto muy largo", "La descripción no debe exceder 100 caracteres.");
      return false;
    }

    return true;
  };

  // ========== HANDLERS FORMULARIO ==========
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    setLoading(true);
    try {
      const url = editando ? `${API_URL}/${editando}` : API_URL;
      const method = editando ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) { // O result.success, dependiendo de tu backend
        await cargarIngredientes();
        resetForm();
        
        showToast(
          "success",
          editando ? "Ingrediente Actualizado" : "Ingrediente Creado",
          editando 
            ? "Los cambios se guardaron correctamente." 
            : "El ingrediente se registró exitosamente."
        );
      } else {
        showToast("error", "Error al guardar", result.message || "Ocurrió un error inesperado.");
      }
    } catch (err) {
      console.error(err);
      showToast("error", "Error del servidor", "No se pudo procesar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    const confirmed = await showConfirm({
      title: "¿Eliminar ingrediente?",
      message: "Esta acción no se puede deshacer. El ingrediente será eliminado permanentemente.",
      confirmText: "Sí, eliminar",
      cancelText: "Cancelar",
      type: "danger",
    });

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      
      if (response.ok) {
        await cargarIngredientes();
        showToast("success", "Eliminado", "El ingrediente ha sido eliminado.");
      } else {
        showToast("error", "Error", "No se pudo eliminar el ingrediente.");
      }
    } catch (err) {
      showToast("error", "Error", "Ocurrió un problema al conectar con el servidor.");
    }
  };

  const handleCancelar = async () => {
    // Verificar si hay datos escritos para preguntar antes de cerrar
    const hayDatos = formData.nombre || formData.descripcion || formData.tipo;

    if (hayDatos && !editando) { // Si estamos creando y hay datos
      const confirmed = await showConfirm({
        title: "¿Descartar cambios?",
        message: "Los datos ingresados se perderán.",
        confirmText: "Sí, descartar",
        cancelText: "Seguir editando",
        type: "warning"
      });
      if (!confirmed) return;
    }
    
    resetForm();
    if(hayDatos) showToast("info", "Cancelado", "Operación cancelada.");
  };

  // ========== UTILS & UI HELPERS ==========
  const handleEdit = (ingrediente) => {
    setEditando(ingrediente.id);
    setFormData({
      nombre: ingrediente.nombre,
      descripcion: ingrediente.descripcion || "",
      tipo: ingrediente.tipo,
      activo: ingrediente.activo,
    });
    setMostrarFormulario(true);
  };

  const resetForm = () => {
    setFormData(ESTADO_INICIAL_FORM);
    setMostrarFormulario(false);
    setEditando(null);
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getIniciales = (nombre) => {
    if (!nombre) return "IN";
    return nombre
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Filtrado
  const ingredientesFiltrados = ingredientes.filter((ing) => {
    const matchBusqueda =
      ing.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      (ing.descripcion && ing.descripcion.toLowerCase().includes(filtros.busqueda.toLowerCase()));
    const matchTipo = !filtros.tipo || ing.tipo === filtros.tipo;
    const matchEstado =
      !filtros.estado ||
      (filtros.estado === "activo" && ing.activo) ||
      (filtros.estado === "inactivo" && !ing.activo);

    return matchBusqueda && matchTipo && matchEstado;
  });

  return (
    <main className={`main-content ${!isOpen ? "sidebar-closed" : ""}`}>
      <div className="ingredientes-container">
        <Sidebar />
        
        <div className="ingredientes-header">
          <div className="ingredientes-header-left">
            <h1 className="ingredientes-titulo">Ingredientes</h1>
            <p className="ingredientes-breadcrumb">Productos / Ingredientes</p>
          </div>
          <button
            className="btn-nuevo-ingrediente"
            onClick={() => {
              if(!mostrarFormulario) resetForm();
              setMostrarFormulario(!mostrarFormulario);
            }}
            disabled={loading}
          >
            <span className="btn-icono">{mostrarFormulario ? '-' : '+'}</span>
            {mostrarFormulario ? 'Cerrar Formulario' : 'Nuevo Ingrediente'}
          </button>
        </div>

        {/* ========== FORMULARIO INLINE (Igual que Eventos) ========== */}
        {mostrarFormulario && (
          <div className="formulario-container">
             <h3 className="formulario-title">
              {editando ? 'Editar Ingrediente' : 'Registrar Nuevo Ingrediente'}
            </h3>
            
            <form onSubmit={handleSubmit} className="formulario-evento"> {/* Reusando clase formulario-evento o crear formulario-ingrediente */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre del Ingrediente</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ej: Jarabe de Vainilla"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="tipo">Tipo</label>
                  <select
                    id="tipo"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    required
                    className="filtro-select"
                    disabled={loading}
                  >
                    <option value="">Selecciona un tipo</option>
                    {tipos.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  placeholder="Breve descripción del ingrediente..."
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
                  <span>Disponible (Activo)</span>
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
                  {loading ? 'Guardando...' : (editando ? 'Actualizar' : 'Guardar')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filtros */}
        <div className="ingredientes-filtros">
          <div className="filtros-grid">
            <div className="filtro-group">
              <label>Buscar ingrediente</label>
              <input
                type="text"
                className="filtro-input"
                placeholder="Nombre o descripción..."
                name="busqueda"
                value={filtros.busqueda}
                onChange={handleFiltroChange}
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
                <option value="">Todos los tipos</option>
                {tipos.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
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
                <option value="">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            <div className="filtro-group" style={{ alignSelf: "flex-end" }}>
              <button
                className="btn-filtrar"
                onClick={() =>
                  setFiltros({ busqueda: "", tipo: "", estado: "" })
                }
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Ingredientes */}
        <div className="tabla-container">
          <div className="lista-header">
            <h2 className="lista-titulo">Lista de Ingredientes</h2>
            <p className="lista-subtitulo">
              Mostrando {ingredientesFiltrados.length} de {ingredientes.length}{" "}
              ingredientes
            </p>
          </div>
          <table className="ingredientes-tabla">
            <thead>
              <tr>
                <th>Ingrediente</th>
                <th>Descripción</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ingredientesFiltrados.map((ingrediente) => (
                <tr key={ingrediente.id}>
                  <td>
                    <div className="ingrediente-info">
                      <div className="ingrediente-avatar">
                        {getIniciales(ingrediente.nombre)}
                      </div>
                      <div className="ingrediente-datos">
                        <p className="ingrediente-nombre">
                          {ingrediente.nombre}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="ingrediente-descripcion">
                      {ingrediente.descripcion || "Sin descripción"}
                    </span>
                  </td>
                  <td>
                    <span className={`tipo-badge tipo-${ingrediente.tipo.toLowerCase()}`}>
                      {ingrediente.tipo}
                    </span>
                  </td>
                  <td>
                    <span className={`estado-badge ${ingrediente.activo ? "estado-activo" : "estado-inactivo"}`}>
                      {ingrediente.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td>
                    <div className="acciones-container">
                      <button
                        onClick={() => handleEdit(ingrediente)}
                        className="btn-accion btn-editar"
                        title="Editar ingrediente"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleEliminar(ingrediente.id)}
                        className="btn-accion btn-eliminar"
                        title="Eliminar ingrediente"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {ingredientesFiltrados.length === 0 && (
            <div className="tabla-vacia">
              <p>No se encontraron ingredientes con los filtros aplicados</p>
            </div>
          )}
        </div>
      </div>
      <Outlet />
    </main>
  );
};