import React, { useState } from 'react';
import './Ingredientes.css';
import Sidebar from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../context/SidebarContext';
import { Outlet } from 'react-router-dom';

export const Ingredientes = () => {
  const { isOpen } = useSidebar();
  const [ingredientes, setIngredientes] = useState([
    {
      id: 1,
      nombre: 'Café Arábica',
      descripcion: 'Granos de café premium de origen colombiano',
      tipo: 'Café',
      activo: true
    },
    {
      id: 2,
      nombre: 'Leche Entera',
      descripcion: 'Leche fresca pasteurizada para bebidas',
      tipo: 'Lácteo',
      activo: true
    },
    {
      id: 3,
      nombre: 'Jarabe de Vainilla',
      descripcion: 'Jarabe natural de vainilla Madagascar',
      tipo: 'Endulzante',
      activo: true
    },
    {
      id: 4,
      nombre: 'Chocolate en Polvo',
      descripcion: 'Cacao puro en polvo sin azúcar añadido',
      tipo: 'Chocolate',
      activo: false
    },
    {
      id: 5,
      nombre: 'Crema Batida',
      descripcion: 'Crema para batir 35% grasa',
      tipo: 'Lácteo',
      activo: true
    },
    {
      id: 6,
      nombre: 'Canela en Polvo',
      descripcion: 'Canela molida de Ceilán',
      tipo: 'Especia',
      activo: true
    }
  ]);

  const [filtros, setFiltros] = useState({
    busqueda: '',
    tipo: '',
    estado: ''
  });

  const tipos = ['Café', 'Lácteo', 'Endulzante', 'Chocolate', 'Especia', 'Otro'];

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const ingredientesFiltrados = ingredientes.filter(ing => {
    const matchBusqueda = ing.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      ing.descripcion.toLowerCase().includes(filtros.busqueda.toLowerCase());
    const matchTipo = !filtros.tipo || ing.tipo === filtros.tipo;
    const matchEstado = !filtros.estado ||
      (filtros.estado === 'activo' && ing.activo) ||
      (filtros.estado === 'inactivo' && !ing.activo);

    return matchBusqueda && matchTipo && matchEstado;
  });

  const toggleActivo = (id) => {
    setIngredientes(prev => prev.map(ing =>
      ing.id === id ? { ...ing, activo: !ing.activo } : ing
    ));
  };

  const getIniciales = (nombre) => {
    return nombre
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <main className={`main-content ${!isOpen ? 'sidebar-closed' : ''}`}>
      <div className="ingredientes-container">
        <Sidebar />
        <div className="ingredientes-header">
          <div className="ingredientes-header-left">
            <h1 className="ingredientes-titulo">Ingredientes</h1>
            <p className="ingredientes-breadcrumb">Productos / Ingredientes</p>
          </div>
          <button className="btn-nuevo-ingrediente">
            <span className="btn-icono">+</span>
            Nuevo Ingrediente
          </button>
        </div>

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
                {tipos.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
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

            <div className="filtro-group" style={{ alignSelf: 'flex-end' }}>
              <button
                className="btn-filtrar"
                onClick={() => setFiltros({ busqueda: '', tipo: '', estado: '' })}
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
              Mostrando {ingredientesFiltrados.length} de {ingredientes.length} ingredientes
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
                {ingredientesFiltrados.map(ingrediente => (
                  <tr key={ingrediente.id}>
                    <td>
                      <div className="ingrediente-info">
                        <div className="ingrediente-avatar">
                          {getIniciales(ingrediente.nombre)}
                        </div>
                        <div className="ingrediente-datos">
                          <p className="ingrediente-nombre">{ingrediente.nombre}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="ingrediente-descripcion">
                        {ingrediente.descripcion}
                      </span>
                    </td>
                    <td>
                      <span className={`tipo-badge tipo-${ingrediente.tipo.toLowerCase()}`}>
                        {ingrediente.tipo}
                      </span>
                    </td>
                    <td>
                      <span className={`estado-badge ${ingrediente.activo ? 'estado-activo' : 'estado-inactivo'}`}>
                        {ingrediente.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div className="acciones-container">
                        <button
                          className="btn-accion btn-editar"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-accion btn-toggle"
                          onClick={() => toggleActivo(ingrediente.id)}
                          title={ingrediente.activo ? 'Desactivar' : 'Activar'}
                        >
                          {ingrediente.activo ? '🔓' : '🔒'}
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


