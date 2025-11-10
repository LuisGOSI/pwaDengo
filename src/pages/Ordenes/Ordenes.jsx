import "./Ordenes.css";
import { useState } from "react";
import { Outlet } from 'react-router-dom';
import Sidebar from "../../components/layout/Sidebar";
import { useSidebar } from "../../context/SidebarContext";

export const Ordenes = () => {
  const { isOpen } = useSidebar();
  const [orders, setOrders] = useState([
    {
      id: "1",
      numero_pedido: "PED-1730000001-abc123def",
      estado: "recibido",
      items_pedido: [
        {
          id: "1a",
          nombre_item: "Hamburguesa doble",
          cantidad: 2,
          precio_unitario: 8.5,
        },
        {
          id: "1b",
          nombre_item: "Papas fritas",
          cantidad: 2,
          precio_unitario: 3.0,
        },
      ],
      usuario: { nombre: "Juan", apellidos: "Pérez" },
      sucursal: { nombre: "Sucursal Centro" },
      creado_en: "2025-11-06T17:32:00Z",
    },
    {
      id: "2",
      numero_pedido: "PED-1730000002-xyz789abc",
      estado: "preparando",
      items_pedido: [
        {
          id: "2a",
          nombre_item: "Pechuga a la plancha",
          cantidad: 1,
          precio_unitario: 12.0,
        },
        {
          id: "2b",
          nombre_item: "Ensalada verde",
          cantidad: 1,
          precio_unitario: 5.5,
        },
      ],
      usuario: { nombre: "María", apellidos: "González" },
      sucursal: { nombre: "Sucursal Centro" },
      creado_en: "2025-11-06T17:28:00Z",
    },
    {
      id: "3",
      numero_pedido: "PED-1730000003-def456ghi",
      estado: "listo",
      items_pedido: [
        {
          id: "3a",
          nombre_item: "Pizza Margarita Grande",
          cantidad: 1,
          precio_unitario: 15.0,
        },
        {
          id: "3b",
          nombre_item: "Bebida gaseosa",
          cantidad: 1,
          precio_unitario: 2.5,
        },
      ],
      usuario: { nombre: "Carlos", apellidos: "Martínez" },
      sucursal: { nombre: "Sucursal Centro" },
      creado_en: "2025-11-06T17:15:00Z",
      notas: "Sin cebolla en la pizza",
    },
    {
      id: "4",
      numero_pedido: "PED-1730000004-jkl234mno",
      estado: "recibido",
      items_pedido: [
        {
          id: "4a",
          nombre_item: "Tacos al pastor",
          cantidad: 3,
          precio_unitario: 2.5,
        },
        {
          id: "4b",
          nombre_item: "Guacamole",
          cantidad: 1,
          precio_unitario: 3.0,
        },
      ],
      usuario: { nombre: "Laura", apellidos: "Rodríguez" },
      sucursal: { nombre: "Sucursal Centro" },
      creado_en: "2025-11-06T17:45:00Z",
    },
    {
      id: "5",
      numero_pedido: "PED-1730000005-pqr567stu",
      estado: "preparando",
      items_pedido: [
        {
          id: "5a",
          nombre_item: "Ceviche",
          cantidad: 1,
          precio_unitario: 14.0,
        },
        {
          id: "5b",
          nombre_item: "Pan tostado",
          cantidad: 2,
          precio_unitario: 1.5,
        },
      ],
      usuario: { nombre: "Roberto", apellidos: "López" },
      sucursal: { nombre: "Sucursal Centro" },
      creado_en: "2025-11-06T17:40:00Z",
    },
  ]);

  const updateOrderStatus = (id, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, estado: newStatus } : order
      )
    );
  };

  const removeOrder = (id) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  const recibidoOrders = orders.filter((o) => o.estado === "recibido");
  const preparandoOrders = orders.filter((o) => o.estado === "preparando");
  const listoOrders = orders.filter((o) => o.estado === "listo");

  return (
    <main className={`main-content ${!isOpen ? 'sidebar-closed' : ''}`}>
      <div className="kitchen-container">
        <Sidebar />
        <div className="kitchen-main">
          <div className="main-header">
            <h1 className="page-title">Pedidos Pendientes</h1>
            <div className="header-stats">
              <div className="stat-card">
                <span className="stat-label">Recibido</span>
                <span className="stat-value">{recibidoOrders.length}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Preparando</span>
                <span className="stat-value">{preparandoOrders.length}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Listo</span>
                <span className="stat-value">{listoOrders.length}</span>
              </div>
            </div>
          </div>

          <section className="orders-section">
            <div className="section-header">
              <h2 className="section-title">Recibido</h2>
              <span className="section-count">{recibidoOrders.length}</span>
            </div>
            <div className="orders-grid">
              {recibidoOrders.length > 0 ? (
                recibidoOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onStatusChange={updateOrderStatus}
                    onRemove={removeOrder}
                  />
                ))
              ) : (
                <div className="empty-state">No hay pedidos recibidos</div>
              )}
            </div>
          </section>

          <section className="orders-section">
            <div className="section-header">
              <h2 className="section-title">Preparando</h2>
              <span className="section-count">{preparandoOrders.length}</span>
            </div>
            <div className="orders-grid">
              {preparandoOrders.length > 0 ? (
                preparandoOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onStatusChange={updateOrderStatus}
                    onRemove={removeOrder}
                  />
                ))
              ) : (
                <div className="empty-state">No hay pedidos preparándose</div>
              )}
            </div>
          </section>

          <section className="orders-section">
            <div className="section-header">
              <h2 className="section-title">Listo</h2>
              <span className="section-count ready">{listoOrders.length}</span>
            </div>
            <div className="orders-grid">
              {listoOrders.length > 0 ? (
                listoOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onStatusChange={updateOrderStatus}
                    onRemove={removeOrder}
                  />
                ))
              ) : (
                <div className="empty-state">No hay pedidos listos</div>
              )}
            </div>
          </section>
        </div>
      </div>
      <Outlet />
    </main>
  );
};

function OrderCard({ order, onStatusChange }) {
  const getStatusLabel = (status) => {
    const labels = {
      recibido: "Recibido",
      preparando: "Preparando",
      listo: "Listo",
      entregado: "Entregado",
      cancelado: "Cancelado",
    };
    return labels[status] || status;
  };

  const getTimeAgo = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return "Hace poco";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    return `Hace ${diffHours} h`;
  };

  return (
    <div className={`order-card order-card-${order.estado}`}>
      <div className="order-card-header">
        <div className="order-number">{order.numero_pedido}</div>
        <div className={`order-badge badge-${order.estado}`}>
          {getStatusLabel(order.estado)}
        </div>
      </div>

      <div className="order-customer">
        <span className="customer-name">
          {order.usuario?.nombre} {order.usuario?.apellidos}
        </span>
        <span className="customer-branch">{order.sucursal?.nombre}</span>
      </div>

      <div className="order-items">
        <h3 className="items-title">Artículos:</h3>
        <ul className="items-list">
          {order.items_pedido.map((item) => (
            <li key={item.id} className="item">
              <span className="item-quantity">{item.cantidad}x</span>
              <span className="item-name">{item.nombre_item}</span>
              <span className="item-price">
                ${item.precio_unitario.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {order.notas && (
        <div className="order-notes">
          <span className="notes-label">Notas:</span>
          <span className="notes-text">{order.notas}</span>
        </div>
      )}

      <div className="order-time">
        <span className="time-icon">🕐</span>
        <span className="time-text">{getTimeAgo(order.creado_en)}</span>
      </div>

      <div className="order-actions">
        {order.estado === "recibido" && (
          <button
            className="btn btn-primary"
            onClick={() => onStatusChange(order.id, "preparando")}
          >
            Empezar
          </button>
        )}
        {order.estado === "preparando" && (
          <button
            className="btn btn-success"
            onClick={() => onStatusChange(order.id, "listo")}
          >
            Marcar Listo
          </button>
        )}
        {order.estado === "listo" && (
          <button
            className="btn btn-danger"
            onClick={() => onStatusChange(order.id, "entregado")}
          >
            Entregado
          </button>
        )}
        {order.estado === "entregado" && (
          <button className="btn btn-secondary" disabled>
            Completado
          </button>
        )}
      </div>
    </div>
  );
}