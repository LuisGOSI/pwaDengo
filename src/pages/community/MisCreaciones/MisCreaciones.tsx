import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAPI } from "../../../utils/UseAPI.js";
import { useAuth } from "../../../services/AuthContext.tsx";
import { useToast } from "../../../context/MensajeContext.jsx";
import Modal from "../../../components/common/Modal.jsx";
import { conf } from "../../../conf.js";
import "./MisCreaciones.css";

interface MyCreation {
  id: number;
  usuario_id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  estado: string;
  comentario_administrador: string | null;
  creado_en: string;
  actualizado_en: string;
}

export default function MisCreaciones() {
  const { get, post } = useAPI(`${conf.BACKEND_URL}/api/`);
  const { user, signOut } = useAuth(); // 👈 Traemos signOut
  const { showToast } = useToast();
  const [myCreations, setMyCreations] = useState<MyCreation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCreation, setSelectedCreation] = useState<MyCreation | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const navigate = useNavigate();

  // 👇 Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      showToast(
        "error",
        "Error al cerrar sesión",
        "No se pudo cerrar sesión correctamente."
      );
    }
  };

  const loadMyCreations = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await get(`comunidad/usuario/${user.id}`);
      if (response.success) {
        setMyCreations(response.data);
      }
    } catch (error) {
      console.error("Error loading my creations:", error);
      showToast(
        "error",
        "Error al cargar creaciones",
        "No se pudieron cargar tus creaciones. Intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyCreations();
  }, [user]);

  const filteredCreations = myCreations.filter((creation) =>
    creation.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creation.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (creation: MyCreation) => {
    setSelectedCreation(creation);
    setIsDeleteModalOpen(true);
  };

  const handleViewDetails = (creation: MyCreation) => {
    setSelectedCreation(creation);
    setIsDetailModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCreation) return;

    try {
      const response = await post("comunidad/eliminar/", { id: selectedCreation.id });

      if (response.success) {
        setMyCreations((prev) =>
          prev.filter((creation) => creation.id !== selectedCreation.id)
        );

        setIsDeleteModalOpen(false);
        setSelectedCreation(null);

        showToast(
          "success",
          "Creación eliminada",
          "Tu creación ha sido eliminada exitosamente"
        );
      } else {
        console.error("Error deleting creation:", response.message);
        showToast(
          "error",
          "Error al eliminar",
          "No se pudo eliminar la creación. Intenta nuevamente."
        );
      }
    } catch (error) {
      console.error("Error deleting creation:", error);
      showToast(
        "error",
        "Error al eliminar",
        "Ocurrió un error al eliminar la creación. Intenta nuevamente."
      );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mis-creaciones-container">
      <header className="mis-creaciones-header">
        <div className="mis-creaciones-header-left">
          <h1 className="mis-creaciones-titulo">Mis Creaciones</h1>
          <p className="mis-creaciones-breadcrumb">Comunidad | Mis Publicaciones</p>
        </div>

        <div className="mis-creaciones-header-actions">
          <button className="btn-volver-feed" onClick={() => navigate("/community/feed")}>
            ← Volver al Feed
          </button>

          <button
            className="btn-nueva-creacion"
            onClick={() => navigate("/community/nueva-creacion")}
          >
            <span className="btn-icono">+</span>
            Nueva Creación
          </button>

          {/* 👇 Botón de cerrar sesión */}
          <button className="btn-cerrar-sesion" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="mis-creaciones-filters">
        <div className="search-section">
          <input
            type="text"
            placeholder="Buscar en mis creaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="stats-section">
          <span className="stats-text">
            {filteredCreations.length} de {myCreations.length} creaciones
          </span>
        </div>
      </div>

      {loading ? (
        <div className="mis-creaciones-loading">
          <div className="loading-spinner"></div>
          <p>Cargando tus creaciones...</p>
        </div>
      ) : (
        <div className="creaciones-grid">
          {filteredCreations.length === 0 ? (
            <div className="no-creaciones">
              <h3>
                {searchTerm ? "No se encontraron creaciones" : "Aún no tienes creaciones"}
              </h3>
              <p>
                {searchTerm
                  ? "Intenta con otros términos de búsqueda"
                  : "¡Crea tu primera bebida personalizada!"}
              </p>

              {!searchTerm && (
                <button
                  className="btn-crear-primera"
                  onClick={() => navigate("/community/nueva-creacion")}
                >
                  Crear Mi Primera Bebida
                </button>
              )}
            </div>
          ) : (
            filteredCreations.map((creation) => (
              <div key={creation.id} className="creacion-card">
                <div className="creacion-image">
                  <img src={creation.imagen} alt={creation.nombre} />
                  <div className="creacion-status">
                    <span className={`status-badge status-${creation.estado}`}>
                      {creation.estado}
                    </span>
                  </div>
                  <button
                    className="btn-delete-creacion"
                    onClick={() => handleDeleteClick(creation)}
                    title="Eliminar creación"
                  >
                    🗑️
                  </button>
                </div>

                <div className="creacion-content">
                  <h3 className="creacion-title">{creation.nombre}</h3>
                  <p className="creacion-description">{creation.descripcion}</p>

                  <div className="creacion-meta">
                    <span className="creacion-date">{formatDate(creation.creado_en)}</span>
                    <span className="creacion-id">ID: {creation.id}</span>
                  </div>
                </div>

                <div className="creacion-actions">
                  <button className="btn-ver-detalles" onClick={() => handleViewDetails(creation)}>
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal eliminar */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Eliminación"
        size="small"
      >
        {selectedCreation && (
          <div className="delete-modal-content">
            <p>
              ¿Estás seguro de que deseas eliminar la creación{" "}
              <strong>"{selectedCreation.nombre}"</strong>?
            </p>

            <p className="warning-text">Esta acción no se puede deshacer.</p>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setIsDeleteModalOpen(false)}>
                Cancelar
              </button>
              <button className="btn-confirm-delete" onClick={confirmDelete}>
                Eliminar
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal detalles */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedCreation?.nombre || "Detalles de la Creación"}
        size="medium"
      >
        {selectedCreation && (
          <div className="detail-modal-content">
            <img
              src={selectedCreation.imagen}
              alt={selectedCreation.nombre}
              className="modal-image"
            />

            <div className="modal-details">
              <p>
                <strong>ID:</strong> {selectedCreation.id}
              </p>
              <p>
                <strong>Descripción:</strong> {selectedCreation.descripcion}
              </p>
              <p>
                <strong>Estado:</strong> {selectedCreation.estado}
              </p>
              <p>
                <strong>Creado:</strong> {formatDate(selectedCreation.creado_en)}
              </p>
              <p>
                <strong>Actualizado:</strong> {formatDate(selectedCreation.actualizado_en)}
              </p>

              {selectedCreation.comentario_administrador && (
                <p>
                  <strong>Comentario del administrador:</strong>{" "}
                  {selectedCreation.comentario_administrador}
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
