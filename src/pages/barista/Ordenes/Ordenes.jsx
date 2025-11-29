import "./Ordenes.css";
import { useState, useEffect } from "react";
import { Outlet } from 'react-router-dom';
import Sidebar from "../../../components/layout/Sidebar";
import { useSidebar } from "../../../context/SidebarContext";
import { useAuth } from "../../../services/AuthContext";

export const Ordenes = () => {
  const { isOpen } = useSidebar();
  const [orders, setOrders] = useState([]);
  const { userData } = useAuth();

  const API_URL = 'https://dengo-back.onrender.com/api';

  useEffect(() => {
    cargarPedidos();
    // Establecer el "Polling": Preguntar cada 30 segundos
    const intervalId = setInterval(() => {
      cargarPedidos(true); // Pasamos true para indicar que es una actualización silenciosa
    }, 30000);

    // Limpieza al desmontar el componente
    return () => clearInterval(intervalId);
  }, []);

  const cargarPedidos = async (isPolling = false) => {
    try {
      const response = await fetch(`${API_URL}/pedidos/?por_pagina=50&sucursal_id=${userData.sucursal_personal_id}`);
      if (!response.ok) {
        if (!isPolling) console.error("Error respuesta servidor");
        return;
      }

      const result = await response.json();

      if (result.pedidos) {
        const pedidosArray = Array.isArray(result.pedidos) ? result.pedidos : [result.pedidos];

        const pedidosActivos = pedidosArray.filter(p =>
          p.estado !== 'entregado' && p.estado !== 'cancelado'
        );
        setOrders(pedidosActivos);
      }
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      if (!isPolling) setOrders([]);
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/pedidos/${id}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: newStatus })
      });

      const result = await response.json();
      console.log('Response:', result);

      if (response.ok) {
        setOrders(prevOrders =>
          prevOrders.map((order) =>
            order.id === id ? { ...order, estado: newStatus } : order
          )
        );
        // Opcional: Recargar inmediatamente para asegurar sincronización
        cargarPedidos();
      } else {
        console.error('Error del servidor:', result);
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
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
          {order.usuarios?.nombre} {order.usuarios?.apellidos}
        </span>
        <span className="customer-branch">{order.sucursales?.nombre}</span>
      </div>

      <div className="order-items">
        <h3 className="items-title">Artículos:</h3>
        <ul className="items-list">
          {order.items_pedido?.map((item) => (
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