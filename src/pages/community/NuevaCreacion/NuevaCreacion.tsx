import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAPI } from "../../../utils/UseAPI.js";
import { useAuth } from "../../../services/AuthContext.tsx";
import { useToast } from "../../../context/MensajeContext.jsx";
import Modal from "../../../components/common/Modal.jsx";
import { conf } from "../../../conf.js";
import "./NuevaCreacion.css";

interface Ingrediente {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  activo: boolean;
  creado_en: string;
  id_categoria: number;
}

interface IngredientesPorTipo {
  [tipo: string]: Ingrediente[];
}

interface Selecciones {
  base: string;
  leche: string;
  saborizante: string;
  endulzante: string;
  topping: string[];
  extras: string;
  temperatura: string;
  tamaño: string;
}

const TEMPERATURA_OPTIONS = [
  { id: "1", nombre: "Bebidas Frías", categoria: "1" },
  { id: "2", nombre: "Bebidas Calientes", categoria: "2" },
];

const TAMAÑO_OPTIONS = [
  { id: "pequeño", nombre: "Pequeño (8oz)" },
  { id: "mediano", nombre: "Mediano (12oz)" },
  { id: "grande", nombre: "Grande (16oz)" },
];

export default function NuevaCreacion() {
  const navigate = useNavigate();
  const { get, post } = useAPI(`${conf.BACKEND_URL}/api/`);
  const { user } = useAuth();
  const { showToast } = useToast();
  const [ingredientes, setIngredientes] = useState<IngredientesPorTipo>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdDrinkName, setCreatedDrinkName] = useState("");
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState(1); // Categoria por defecto
  
  const [selecciones, setSelecciones] = useState<Selecciones>({
    base: "",
    leche: "",
    saborizante: "",
    endulzante: "",
    topping: [],
    extras: "",
    temperatura: "",
    tamaño: "",
  });

  const loadIngredientes = async (categoria: string) => {
    try {
      setLoading(true);
      setCategoria(parseInt(categoria));
      const response = await get(`ingredientes/categoria/${categoria}`);
      if (response.success) {
        // Normalizar keys a lowercase
        const normalizedData: IngredientesPorTipo = {};
        Object.entries(response.data).forEach(([key, value]) => {
          normalizedData[key.toLowerCase()] = value as Ingrediente[];
        });
        setIngredientes(normalizedData);
      }
    } catch (error) {
      console.error("Error loading ingredientes:", error);
      showToast('error', 'Error al cargar ingredientes', 'No se pudieron cargar los ingredientes. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // No cargamos ingredientes automáticamente, esperamos selección de temperatura
  }, []);

  const handleSeleccion = (seccion: string, id: string) => {
    if (seccion === "temperatura") {
      // Cuando cambia la temperatura, resetear ingredientes y cargar nuevos
      const newTemperatura = (selecciones as any)[seccion] === id ? "" : id;
      
      setSelecciones((prev) => ({
        ...prev,
        temperatura: newTemperatura,
        // Resetear selecciones de ingredientes cuando cambia la temperatura
        base: "",
        leche: "",
        saborizante: "",
        endulzante: "",
        topping: [],
        extras: "",
      }));

      // Cargar ingredientes según la nueva categoría seleccionada
      if (newTemperatura) {
        const categoriaSeleccionada = TEMPERATURA_OPTIONS.find(opt => opt.id === newTemperatura)?.categoria;
        if (categoriaSeleccionada) {
          loadIngredientes(categoriaSeleccionada);
        }
      } else {
        // Si no hay temperatura seleccionada, limpiar ingredientes
        setIngredientes({});
      }
    } else if (seccion === "topping") {
      if (selecciones.topping.includes(id)) {
        setSelecciones((prev) => ({
          ...prev,
          topping: prev.topping.filter((t) => t !== id),
        }));
      } else {
        if (selecciones.topping.length < 2) {
          setSelecciones((prev) => ({
            ...prev,
            topping: [...prev.topping, id],
          }));
        }
      }
    } else {
      setSelecciones((prev) => ({
        ...prev,
        [seccion]: (prev as any)[seccion] === id ? "" : id,
      }));
    }
  };

  const getTipoIngredientes = (tipo: string) => {
    return ingredientes[tipo] || [];
  };

  const getNombreSeleccion = (tipo: string, id: string) => {
    if (tipo === "temperatura") {
      return TEMPERATURA_OPTIONS.find(opt => opt.id === id)?.nombre || id;
    }
    if (tipo === "tamaño") {
      return TAMAÑO_OPTIONS.find(opt => opt.id === id)?.nombre || id;
    }
    
    const ingredientesDelTipo = getTipoIngredientes(tipo.toLowerCase());
    return ingredientesDelTipo.find(ing => ing.id.toString() === id)?.nombre || id;
  };

  const generateDescripcion = () => {
    const seleccionesTexto = [];
    
    if (selecciones.temperatura) {
      seleccionesTexto.push(`Tipo: ${getNombreSeleccion("temperatura", selecciones.temperatura)}`);
    }
    if (selecciones.base) {
      seleccionesTexto.push(`Base: ${getNombreSeleccion("base", selecciones.base)}`);
    }
    if (selecciones.leche) {
      seleccionesTexto.push(`Leche: ${getNombreSeleccion("leche", selecciones.leche)}`);
    }
    if (selecciones.saborizante) {
      seleccionesTexto.push(`Saborizante: ${getNombreSeleccion("saborizante", selecciones.saborizante)}`);
    }
    if (selecciones.endulzante) {
      seleccionesTexto.push(`Endulzante: ${getNombreSeleccion("endulzante", selecciones.endulzante)}`);
    }
    if (selecciones.topping.length > 0) {
      const toppingsNombres = selecciones.topping.map(t => getNombreSeleccion("topping", t)).join(", ");
      seleccionesTexto.push(`Topping: ${toppingsNombres}`);
    }
    if (selecciones.extras) {
      seleccionesTexto.push(`Extras: ${getNombreSeleccion("extras", selecciones.extras)}`);
    }
    if (selecciones.tamaño) {
      seleccionesTexto.push(`Tamaño: ${getNombreSeleccion("tamaño", selecciones.tamaño)}`);
    }
    
    return seleccionesTexto.join(", ");
  };

  const hasSelections = () => {
    return (
      selecciones.base ||
      selecciones.leche ||
      selecciones.saborizante ||
      selecciones.endulzante ||
      selecciones.topping.length > 0 ||
      selecciones.extras ||
      selecciones.temperatura ||
      selecciones.tamaño
    );
  };

  const canCreate = () => {
    return nombre.trim() && hasSelections();
  };

  const handleSubmit = async () => {
    if (!canCreate() || !user?.id) return;

    try {
      setSubmitting(true);
      
      const creationData = {
        usuario_id: user.id,
        nombre: nombre.trim(),
        descripcion: generateDescripcion(),
        imagen: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?ixlib=rb-4.0.3", // URL por defecto
        tamano: selecciones.tamaño,
        categoria_id: categoria
      };

      const response = await post("comunidad", creationData);
      
      if (response && response.success) {
        // Guardar el nombre de la creación antes de limpiar
        setCreatedDrinkName(response.data.nombre);
        
        // Limpiar el formulario
        setNombre("");
        setSelecciones({
          base: "",
          leche: "",
          saborizante: "",
          endulzante: "",
          topping: [],
          extras: "",
          temperatura: "",
          tamaño: "",
        });
        
        // Limpiar ingredientes también
        setIngredientes({});
        
        // Mostrar modal de éxito
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("Error creating:", error);
      showToast('error', 'Error al crear bebida', 'No se pudo crear la bebida. Intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/community/mis-creaciones');
  };

  const renderSeccion = (titulo: string, tipo: string) => {
    // Manejar temperatura como sección estática (primera selección)
    if (tipo === "Temperatura") {
      return renderSeccionEstatica(titulo, "temperatura", TEMPERATURA_OPTIONS);
    }
    
    const ingredientesDelTipo = getTipoIngredientes(tipo.toLowerCase());
    
    // No mostrar sección si no hay ingredientes disponibles
    if (ingredientesDelTipo.length === 0) {
      return null;
    }

    return (
      <div key={tipo} className="creacion-seccion">
        <h3 className="seccion-titulo">{titulo}</h3>
        <div className="seccion-opciones">
          {ingredientesDelTipo.map((ingrediente) => (
            <button
              key={ingrediente.id}
              className={`opcion-btn ${
                tipo === "Topping"
                  ? selecciones.topping.includes(ingrediente.id.toString())
                    ? "seleccionado"
                    : ""
                  : (selecciones as any)[tipo.toLowerCase()] === ingrediente.id.toString()
                    ? "seleccionado"
                    : ""
              }`}
              onClick={() => handleSeleccion(tipo.toLowerCase(), ingrediente.id.toString())}
            >
              <span className="opcion-nombre">{ingrediente.nombre}</span>
            </button>
          ))}
        </div>
        {tipo === "Topping" && <p className="seccion-nota">Máximo 2 selecciones</p>}
      </div>
    );
  };

  const renderSeccionEstatica = (titulo: string, tipo: string, opciones: any[]) => {
    return (
      <div key={tipo} className="creacion-seccion">
        <h3 className="seccion-titulo">{titulo}</h3>
        <div className="seccion-opciones">
          {opciones.map((opcion) => (
            <button
              key={opcion.id}
              className={`opcion-btn ${
                (selecciones as any)[tipo] === opcion.id ? "seleccionado" : ""
              }`}
              onClick={() => handleSeleccion(tipo, opcion.id)}
            >
              <span className="opcion-nombre">{opcion.nombre}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="nueva-creacion-container">
        <div className="nueva-creacion-loading">
          <div className="loading-spinner"></div>
          <p>Cargando ingredientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="nueva-creacion-container">
      <header className="nueva-creacion-header">
        <div className="nueva-creacion-header-left">
          <h1 className="nueva-creacion-titulo">Crear Nueva Bebida</h1>
          <p className="nueva-creacion-breadcrumb">Comunidad | Nueva Creación</p>
        </div>
        <div className="nueva-creacion-header-actions">
          <button className="btn-volver" onClick={() => navigate('/community/mis-creaciones')}>
            ← Mis Creaciones
          </button>
          <button className="btn-feed" onClick={() => navigate('/community/feed')}>
            Ver Feed
          </button>
        </div>
      </header>

      <div className="nueva-creacion-layout">
        <div className="creacion-form">
          <div className="form-basic-info">
            <h2>Información Básica</h2>
            <div className="input-group">
              <label htmlFor="nombre">Nombre de la Bebida *</label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Mi Café Especial"
                className="form-input"
                maxLength={50}
              />
            </div>
            <div className="descripcion-auto">
              <p><strong>Descripción generada automáticamente:</strong></p>
              <p className="descripcion-preview">{generateDescripcion() || "Selecciona ingredientes para generar la descripción..."}</p>
            </div>
          </div>

          <div className="form-ingredientes">
            <h2>Personaliza tu Bebida</h2>
            <div className="ingredientes-grid">
              {renderSeccion("Tipo de Bebida", "Temperatura")}
              {selecciones.temperatura && (
                <>
                  {renderSeccion("Base", "Base")}
                  {renderSeccion("Leche", "Leche")}
                  {renderSeccion("Saborizante", "Saborizante")}
                  {renderSeccion("Endulzante", "Endulzante")}
                  {renderSeccion("Topping", "Topping")}
                  {renderSeccion("Extras", "Extra")}
                  {renderSeccionEstatica("Tamaño", "tamaño", TAMAÑO_OPTIONS)}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="creacion-preview">
          <div className="preview-card">
            <h3>Vista Previa</h3>
            <div className="preview-content">
              <div className="preview-image">
                <img 
                  src="https://images.unsplash.com/photo-1572442388796-11668a67e53d?ixlib=rb-4.0.3" 
                  alt="Preview"
                />
              </div>
              <div className="preview-info">
                <h4>{nombre || "Nombre de la bebida"}</h4>
                <p>{generateDescripcion() || "Descripción generada automáticamente..."}</p>
                
                {hasSelections() && (
                  <div className="preview-selections">
                    <h5>Selecciones:</h5>
                    <ul>
                      {selecciones.temperatura && <li>Tipo: {getNombreSeleccion("temperatura", selecciones.temperatura)}</li>}
                      {selecciones.base && <li>Base: {getNombreSeleccion("base", selecciones.base)}</li>}
                      {selecciones.leche && <li>Leche: {getNombreSeleccion("leche", selecciones.leche)}</li>}
                      {selecciones.saborizante && <li>Saborizante: {getNombreSeleccion("saborizante", selecciones.saborizante)}</li>}
                      {selecciones.endulzante && <li>Endulzante: {getNombreSeleccion("endulzante", selecciones.endulzante)}</li>}
                      {selecciones.topping.length > 0 && <li>Topping: {selecciones.topping.map(t => getNombreSeleccion("topping", t)).join(", ")}</li>}
                      {selecciones.extras && <li>Extras: {getNombreSeleccion("extras", selecciones.extras)}</li>}
                      {selecciones.tamaño && <li>Tamaño: {getNombreSeleccion("tamaño", selecciones.tamaño)}</li>}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            <div className="preview-actions">
              <button
                className={`btn-publicar ${canCreate() ? "" : "disabled"}`}
                onClick={handleSubmit}
                disabled={!canCreate() || submitting}
              >
                {submitting ? "Publicando..." : "Publicar Creación"}
              </button>
              {!canCreate() && (
                <p className="validation-message">
                  Completa el nombre y al menos una selección para publicar
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de éxito */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="¡Creación Publicada!"
        size="medium"
      >
        <div className="success-modal-content">
          <div className="success-icon">✅</div>
          <p>Tu bebida <strong>"{createdDrinkName}"</strong> ha sido publicada exitosamente.</p>
          <p>Podrás verla en tu sección de "Mis Creaciones" y estará pendiente de aprobación para aparecer en el feed público.</p>
          <div className="success-actions">
            <button className="btn-ir-mis-creaciones" onClick={handleSuccessModalClose}>
              Ver Mis Creaciones
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}