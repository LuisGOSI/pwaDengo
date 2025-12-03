import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAPI } from "../../../utils/UseAPI.js";
import { useAuth } from "../../../services/AuthContext.tsx";
import { useToast } from "../../../context/MensajeContext.jsx";
import Modal from "../../../components/common/Modal.jsx";
import { conf } from "../../../conf.js";
import "./Feed.css";

interface CommunityPost {
  id: number;
  usuario_id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  estado: string;
  comentario_administrador: string | null;
  creado_en: string;
  actualizado_en: string;
  usuarios: {
    nombre: string;
  };
}

export default function Feed() {
  const { get } = useAPI(`${conf.BACKEND_URL}/api/`);
  const { user, signOut } = useAuth();
  const { showToast } = useToast();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recientes");
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const loadFeed = async () => {
    try {
      setLoading(true);
      const response = await get("comunidad/feed");
      if (response.success) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error("Error loading feed:", error);
      showToast(
        "error",
        "Error al cargar feed",
        "No se pudo cargar el feed de la comunidad. Intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  const filteredAndSortedPosts = posts
    .filter((post) =>
      post.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.usuarios.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "recientes") {
        return new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime();
      } else if (sortBy === "antiguos") {
        return new Date(a.creado_en).getTime() - new Date(b.creado_en).getTime();
      } else if (sortBy === "alfabetico") {
        return a.nombre.localeCompare(b.nombre);
      }
      return 0;
    });

  const handleOrderClick = (post: CommunityPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // =========================
  // ⭐ NUEVO: Cerrar sesión
  // =========================
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

  return (
    <div className="feed-container">
      <header className="feed-header">
        <div className="feed-header-left">
          <h1 className="feed-titulo">Feed de la Comunidad</h1>
          <p className="feed-breadcrumb">Comunidad | Creaciones Públicas</p>
        </div>

        <div className="feed-header-actions">
          <button className="btn-mis-creaciones" onClick={() => navigate("/")}>
            ← Volver al Inicio
          </button>

          <button
            className="btn-mis-creaciones"
            onClick={() => navigate("/community/mis-creaciones")}
          >
            Ver Mis Creaciones
          </button>

          <button
            className="btn-nueva-creacion"
            onClick={() => navigate("/community/nueva-creacion")}
          >
            <span className="btn-icono">+</span>
            Nueva Creación
          </button>

          {/* ⭐ NUEVO: Botón de cerrar sesión */}
          <button className="btn-cerrar-sesion" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="feed-filters">
        <div className="search-section">
          <input
            type="text"
            placeholder="Buscar creaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="sort-section">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="recientes">Más Recientes</option>
            <option value="antiguos">Más Antiguos</option>
            <option value="alfabetico">Alfabético</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="feed-loading">
          <div className="loading-spinner"></div>
          <p>Cargando creaciones...</p>
        </div>
      ) : (
        <div className="posts-grid">
          {filteredAndSortedPosts.length === 0 ? (
            <div className="no-posts">
              <h3>No se encontraron creaciones</h3>
              <p>
                {searchTerm
                  ? "Intenta con otros términos de búsqueda"
                  : "¡Sé el primero en compartir una creación!"}
              </p>
            </div>
          ) : (
            filteredAndSortedPosts.map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-image">
                  <img src={post.imagen} alt={post.nombre} />
                </div>

                <div className="post-content">
                  <h3 className="post-title">{post.nombre}</h3>
                  <p className="post-description">{post.descripcion}</p>

                  <div className="post-meta">
                    <span className="post-author">Por: {post.usuarios.nombre}</span>
                    <span className="post-date">{formatDate(post.creado_en)}</span>
                  </div>
                </div>

                <div className="post-actions">
                  <button
                    className="btn-ordenar"
                    onClick={() => handleOrderClick(post)}
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedPost?.nombre || "Detalles de la Creación"}
        size="medium"
      >
        {selectedPost && (
          <div className="detail-modal-content">
            <img
              src={selectedPost.imagen}
              alt={selectedPost.nombre}
              className="modal-image"
            />

            <div className="modal-details">
              <p><strong>ID:</strong> {selectedPost.id}</p>
              <p><strong>Descripción:</strong> {selectedPost.descripcion}</p>
              <p><strong>Creador:</strong> {selectedPost.usuarios.nombre}</p>
              <p><strong>Fecha:</strong> {formatDate(selectedPost.creado_en)}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
