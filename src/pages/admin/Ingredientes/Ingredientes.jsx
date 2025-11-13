import React, { useState,useEffect } from "react";
import "./Productos.css";
import { useAPI } from "../../../utils/UseAPI";
import { useShowContent } from "../../../utils/UseShowContent";


export const Productos = () => {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [estado, setEstado] = useState("");
  const [sucursal, setSucursal] = useState("");

  const { get, loading, error } = useAPI("http://localhost:3000/api/");
  const [ingredientes, setIngredientes] = useState([]);
  const { objEdit, handleAdd, handleCloseForm, handleEdit } = useShowContent();

  const loadIngredientes = () => {
    get("ingredientes").then((res) => {
      setIngredientes(res.data);
    });
  };

  useEffect(() => {
    loadIngredientes();
  }, []);

  const handleFiltrar = () => {
    console.log("Filtrando productos...", {
      busqueda,
      categoria,
      estado,
      sucursal,
    });
  };

  return (
    <main className={`main-content ${!isOpen ? "sidebar-closed" : ""}`}>
      <div className="productos-container">
        <Sidebar />
        <div className="productos-header">
          <div className="productos-header-left">
            <h1 className="productos-titulo">Catálogo de Productos</h1>
            <p className="productos-breadcrumb">Clientes | Productos</p>
          </div>
          <button
            onClick={showForm ? handleFormClose : handleAdd}
            className="btn-nuevo-producto"
          >
            <span className="btn-icono">+</span>
            Nuevo Producto
          </button>
        </div>

        {showForm && (
          <FormProductos initialData={objEdit} onClose={handleFormClose} />
        )}

        {/* Filtros */}
        <div className="productos-filtros">
          <div className="filtros-grid">
            <div className="filtro-group">
              <label>Buscar</label>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="filtro-input"
              />
            </div>

            <div className="filtro-group">
              <label>Categoría</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="filtro-select"
              >
                <option value=""></option>
                <option value="cafe">Café</option>
                <option value="panaderia">Panadería</option>
                <option value="comida">Comida</option>
                <option value="bebidas">Bebidas</option>
                <option value="postres">Postres</option>
              </select>
            </div>

            <div className="filtro-group">
              <label>Estado</label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="filtro-select"
              >
                <option value=""></option>
                <option value="disponible">Disponible</option>
                <option value="agotado">Agotado</option>
                <option value="descontinuado">Descontinuado</option>
              </select>
            </div>

            <div className="filtro-group">
              <label>Sucursal</label>
              <select
                value={sucursal}
                onChange={(e) => setSucursal(e.target.value)}
                className="filtro-select"
              >
                <option value=""></option>
                <option value="todas">Todas</option>
                <option value="centro">Centro</option>
                <option value="norte">Norte</option>
                <option value="sur">Sur</option>
              </select>
            </div>
          </div>

          <button onClick={handleFiltrar} className="btn-filtrar">
            Filtrar
          </button>
        </div>

        {ingredientes.length === 0 ? (
          <p className="sin-productos">No hay productos disponibles.</p>
        ) : (
          <div className="productos-lista">
            <div className="lista-header">
              <h2 className="lista-titulo">Lista de Productos</h2>
              <p className="lista-subtitulo">
                Total: {ingredientes.length} productos
              </p>
            </div>

            <div className="tabla-container">
              <table className="productos-tabla">
                <thead>
                  <tr>
                    <th>NOMBRE</th>
                    <th>CATEGORÍA</th>
                    <th>PRECIO</th>
                    <th>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {ingredientes.map((ingrediente) => (
                    <tr key={ingrediente.id}>
                      <td>
                        <div className="producto-info">
                          <div className="producto-avatar">
                            {ingrediente.nombre.charAt(0) +
                              ingrediente.nombre.charAt(1)}
                          </div>
                          <div className="producto-datos">
                            <p className="producto-nombre">{ingrediente.nombre}</p>
                            <p className="producto-descripcion">
                              {ingrediente.descripcion}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`categoria-badge categoria-${ingrediente.tipo}`}
                        >
                          {producto.categoria_id}
                        </span>
                      </td>
                      <td className="producto-precio">${ingrediente.activo}</td>
                      <td>
                        <div className="acciones-container">
                          <button
                            onClick={() => handleEditClick(ingrediente)}
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
                            onClick={() => handleDelete(producto.id)}
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
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
