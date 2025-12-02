import React, { useState, useEffect } from "react";
import "./Productos.css";
import { useSidebar } from "../../../context/SidebarContext";
import { Outlet } from "react-router-dom";
import Sidebar from "../../../components/layout/Sidebar";
import { useAPI } from "../../../utils/UseAPI";
import { useShowContent } from "../../../utils/UseShowContent";
import { FormProductos } from "./FormProductos";
import { conf } from "../../../conf";

export const Productos = () => {
  const { isOpen } = useSidebar();
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [estado, setEstado] = useState("");

  //[CAMBIOS NUEVOS]

  const { get, del } = useAPI(`${conf.BACKEND_URL}/api/`); //Se pasas la URL base como parametro
  const [productos, setProductos] = useState([]); //Estado para almacenar los productos
  const [productosFiltrados, setProductosFiltrados] = useState([]); //Estado para productos filtrados
  const [categorias, setCategorias] = useState([]); //Estado para categorías
  const { objEdit, showForm, handleAdd, handleEdit, handleCloseForm } = useShowContent();

  useEffect(() => {
    loadProductos();
    loadCategorias();
  }, []);

  const loadProductos = () => {
    get("productos").then((res) => {
      setProductos(res.data);
      setProductosFiltrados(res.data); // Inicializar productos filtrados
    });
  };

  const loadCategorias = () => {
    get("categorias").then((res) => {
      setCategorias(res.data);
    });
  };

  const handleFiltrar = () => {
    let productosFiltro = [...productos];

    // Filtrar por nombre
    if (busqueda.trim() !== "") {
      productosFiltro = productosFiltro.filter(producto =>
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (categoria !== "") {
      productosFiltro = productosFiltro.filter(producto =>
        producto.categoria_id.toString() === categoria
      );
    }

    // Filtrar por estado
    if (estado !== "") {
      const esActivo = estado === "activo";
      productosFiltro = productosFiltro.filter(producto =>
        producto.activo === esActivo
      );
    }

    setProductosFiltrados(productosFiltro);
  };

  // Aplicar filtros automáticamente cuando cambien los valores
  useEffect(() => {
    handleFiltrar();
  }, [busqueda, categoria, estado, productos]);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      const result = await del(`productos/${id}`);
      if (result) loadProductos();
    }
  };

  const handleEditClick = (producto) => {
    handleEdit(producto);
  };

  const handleFormClose = () => {
    handleCloseForm();
    loadProductos();
  };

  return (
    <main className={`main-content ${!isOpen ? "sidebar-closed" : ""}`}>
      <div className="productos-container">
        <Sidebar />

        {/* Header */}
        <div className="productos-header">
          <div className="productos-header-left">
            <h1 className="productos-titulo">Catálogo de Productos</h1>
            <p className="productos-breadcrumb">Productos | Catálogo</p>
          </div>
          <button
            onClick={showForm ? handleFormClose : handleAdd}
            className="btn-nuevo-producto"
          >
            <span className="btn-icono">+</span>
            Nuevo Producto
          </button>
        </div>

        {/* Formulario */}
        {showForm && (
          <FormProductos initialData={objEdit} onClose={handleFormClose} />
        )}

        {/* Filtros */}
        <div className="productos-filtros">
          <h1 className="productos-titulo">Filtros de búsqueda</h1>
          <div className="filtros-grid">
            <div className="filtro-group">
              <label>Buscar</label>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="filtro-input"
                placeholder="Buscar por nombre..."
              />
            </div>

            <div className="filtro-group">
              <label>Categoría</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="filtro-select"
              >
                <option value="">Todas las categorías</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="filtro-group">
              <label>Estado</label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="filtro-select"
              >
                <option value="">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

          </div>

          <button onClick={() => {
            setBusqueda("");
            setCategoria("");
            setEstado("");
          }} className="btn-filtrar">
            Limpiar Filtros
          </button>
        </div>

        {productosFiltrados.length === 0 ? (
          <p className="sin-productos">No hay productos que coincidan con los filtros.</p>
        ) : (
          <div className="productos-lista">
            <div className="lista-header">
              <h2 className="lista-titulo">Lista de Productos</h2>
              <p className="lista-subtitulo">
                Mostrando: {productosFiltrados.length} de {productos.length} productos
              </p>
            </div>

            <div className="tabla-container">
              <table className="productos-tabla">
                <thead>
                  <tr>
                    <th>NOMBRE</th>
                    <th>CATEGORÍA</th>
                    <th>PRECIO</th>
                    <th>ESTADO</th>
                    <th>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.map((producto) => (
                    <tr key={producto.id}>
                      <td>
                        <div className="producto-info">
                          <div className="producto-avatar">
                            {producto.nombre.charAt(0).toUpperCase() +
                              (producto.nombre.charAt(1)?.toUpperCase() || "")}
                          </div>
                          <div className="producto-datos">
                            <p className="producto-nombre">{producto.nombre}</p>
                            <p className="producto-descripcion">
                              {producto.descripcion}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`categoria-badge categoria-${producto.categoria_id}`}
                        >
                          {producto.categorias.nombre}
                        </span>
                      </td>
                      <td className="producto-precio">${producto.precio}</td>
                      <td>
                        <span className={`estado-badge ${producto.activo ? 'estado-activo' : 'estado-inactivo'}`}>
                          {producto.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>
                        <div className="acciones-container">
                          <button
                            onClick={() => handleEditClick(producto)}
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

      <Outlet />
    </main>
  );
};
