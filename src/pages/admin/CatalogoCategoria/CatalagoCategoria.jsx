import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import './CatalogoCategoria.css';

export const CatalogoCategorias = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const categories = [
    {
      id: 1,
      name: 'Bebidas Calientes',
      type: 'Categoría',
      description: 'Café, té y bebidas calientes',
      count: 12,
      status: 'Activo',
      color: '#FF6B35'
    },
    {
      id: 2,
      name: 'Bebidas Frías',
      type: 'Categoría',
      description: 'Jugos, refrescos y smoothies',
      count: 18,
      status: 'Activo',
      color: '#4ECDC4'
    },
    {
      id: 3,
      name: 'Postres',
      type: 'Categoría',
      description: 'Pasteles, helados y dulces',
      count: 24,
      status: 'Activo',
      color: '#FFB6C1'
    },
    {
      id: 4,
      name: 'Vegano',
      type: 'Etiqueta',
      description: 'Productos sin ingredientes animales',
      count: 8,
      status: 'Activo',
      color: '#95E1D3'
    },
    {
      id: 5,
      name: 'Sin Lactosa',
      type: 'Etiqueta',
      description: 'Productos libres de lactosa',
      count: 15,
      status: 'Activo',
      color: '#F38181'
    },
    {
      id: 6,
      name: 'Sin Gluten',
      type: 'Etiqueta',
      description: 'Productos aptos para celíacos',
      count: 10,
      status: 'Activo',
      color: '#EAFFD0'
    }
  ];

  const filteredCategories = categories.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cat.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || cat.type === typeFilter;
    const matchesStatus = !statusFilter || cat.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="categoria-container">
      {/* Header */}
      <div className="categoria-header">
        <div className="categoria-header-left">
          <h1 className="categoria-titulo">Catálogo de Categorías</h1>
          <p className="categoria-breadcrumb">Productos | Organización</p>
        </div>
        <button className="btn-nueva-categoria">
          <Plus size={20} className="btn-icono-plus" />
          <span>Nueva Categoría</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="categoria-filtros">
        <div className="filtros-grid">
          <div className="filtro-group">
            <label>Buscar</label>
            <input
              type="text"
              className="filtro-input"
              placeholder="Buscar categoría o etiqueta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filtro-group">
            <label>Tipo</label>
            <select
              className="filtro-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="Categoría">Categoría</option>
              <option value="Etiqueta">Etiqueta</option>
            </select>
          </div>

          <div className="filtro-group">
            <label>Estado</label>
            <select
              className="filtro-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <div className="filtro-group filtro-empty">
            {/* Espacio vacío para mantener grid de 4 columnas */}
          </div>
        </div>

        <button className="btn-filtrar">Filtrar</button>
      </div>

      {/* Lista de Categorías */}
      <div className="categoria-lista">
        <div className="lista-header">
          <h2 className="lista-titulo">Lista de Categorías y Etiquetas</h2>
          <p className="lista-subtitulo">Total: {filteredCategories.length} elementos</p>
        </div>

        <div className="tabla-container">
          <table className="categoria-tabla">
            <thead>
              <tr>
                <th>NOMBRE</th>
                <th>TIPO</th>
                <th>DESCRIPCIÓN</th>
                <th>PRODUCTOS</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="categoria-info">
                      <div
                        className="categoria-avatar"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="categoria-datos">
                        <p className="categoria-nombre">{item.name}</p>
                        <p className="categoria-subtipo">{item.type.toLowerCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`tipo-badge tipo-${item.type === 'Categoría' ? 'categoria' : 'etiqueta'}`}>
                      {item.type}
                    </span>
                  </td>
                  <td>
                    <span className="categoria-descripcion">{item.description}</span>
                  </td>
                  <td>
                    <span className="categoria-count">{item.count}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};