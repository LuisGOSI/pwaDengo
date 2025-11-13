import React, { useState, useEffect } from "react";
import "./Ingredientes.css";
import Sidebar from "../../../components/layout/Sidebar";
import { useSidebar } from "../../../context/SidebarContext";
import { Outlet } from "react-router-dom";
import { useAPI } from "../../../utils/UseAPI";
import { useShowContent } from "../../../utils/UseShowContent";
import { FormIngredientes } from "./FormIngredientes";

export const Ingredientes = () => {
  const { isOpen } = useSidebar();
  const [ingredientes, setIngredientes] = useState([]);
  const { get, error, loading } = useAPI("http://localhost:3000/api/");
  const { objEdit, showForm, handleAdd, handleEdit, handleCloseForm } =
    useShowContent();

  useEffect(() => {
    loadIngredientes();
  }, []);

  const loadIngredientes = () => {
    get("ingredientes").then((res) => {
      setIngredientes(res.data);
    });
  };

  const [filtros, setFiltros] = useState({
    busqueda: "",
    tipo: "",
    estado: "",
  });

  const tipos = [
    "Base",
    "Endulzante",
    "Lacteo",
  ];

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const ingredientesFiltrados = ingredientes.filter((ing) => {
    const matchBusqueda =
      ing.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      ing.descripcion.toLowerCase().includes(filtros.busqueda.toLowerCase());
    const matchTipo = !filtros.tipo || ing.tipo === filtros.tipo;
    const matchEstado =
      !filtros.estado ||
      (filtros.estado === "activo" && ing.activo) ||
      (filtros.estado === "inactivo" && !ing.activo);

    return matchBusqueda && matchTipo && matchEstado;
  });

  const toggleActivo = (id) => {
    setIngredientes((prev) =>
      prev.map((ing) => (ing.id === id ? { ...ing, activo: !ing.activo } : ing))
    );
  };

  const getIniciales = (nombre) => {
    return nombre
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

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
            onClick={showForm ? handleCloseForm : handleAdd}
          >
            <span className="btn-icono">+</span>
            Nuevo Ingrediente
          </button>
        </div>

        {showForm && (
          <FormIngredientes initialData={objEdit} onClose={handleCloseForm} />
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
        <div className="ingredientes-lista">
          <div className="lista-header">
            <h2 className="lista-titulo">Lista de Ingredientes</h2>
            <p className="lista-subtitulo">
              Mostrando {ingredientesFiltrados.length} de {ingredientes.length}{" "}
              ingredientes
            </p>
          </div>

          <div className="tabla-container">
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
                        {ingrediente.descripcion}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`tipo-badge tipo-${ingrediente.tipo.toLowerCase()}`}
                      >
                        {ingrediente.tipo}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`estado-badge ${
                          ingrediente.activo
                            ? "estado-activo"
                            : "estado-inactivo"
                        }`}
                      >
                        {ingrediente.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td>
                      <div className="acciones-container">
                        <button
                          onClick={() => handleEdit(ingrediente)}
                          className="btn-accion btn-editar"
                          title="Editar producto"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(ingrediente.id)}
                          className="btn-accion btn-eliminar"
                          title="Eliminar producto"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
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
      </div>
      <Outlet />
    </main>
  );
};
