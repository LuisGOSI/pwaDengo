import { useEffect, useState } from "react";
import { useAPI } from "../../../utils/UseAPI";
import { useForm } from "../../../utils/UseForm";
import "./Productos.css";
import { useAuth } from "../../../services/AuthContext";
import { conf } from "../../../conf";

import { useToast } from "../../../context/MensajeContext";
import { useConfirm } from "../../../components/common/Mensaje/ConfirmModal";

export const FormProductos = ({ initialData, onClose }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { showConfirm } = useConfirm();
  
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  
  const { post, put, get } = useAPI(`${conf.BACKEND_URL}/api/`);

  const { formData, handleInputChange, resetForm, setFormData } = useForm({
    nombre: "",
    descripcion: "",
    precio: "",
    url_imagen: "",
    categoria_id: "",
    disponible: true,
    creado_por: user ? user.id : "",
  });

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await get("categorias");
        if(response && response.data) {
             setCategorias(response.data);
        }
      } catch (error) {
        showToast("error", "Error", "No se pudieron cargar las categorías");
      }
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData, setFormData]);

  // ========== VALIDACIONES ==========
  const validarFormulario = () => {
    // 1. Nombre
    if (!formData.nombre || !formData.nombre.trim()) {
        showToast("warning", "Campo Requerido", "El nombre del producto es obligatorio.");
        return false;
    }

    // 2. Precio
    const precioNum = parseFloat(formData.precio);
    if (!formData.precio || isNaN(precioNum) || precioNum <= 0) {
        showToast("warning", "Precio Inválido", "El precio debe ser un número mayor a 0.");
        return false;
    }

    // 3. URL Imagen
    if (!formData.url_imagen || !formData.url_imagen.trim()) {
        showToast("warning", "Campo Requerido", "La URL de la imagen es obligatoria.");
        return false;
    }

    // 4. Categoría
    if (!formData.categoria_id) {
        showToast("warning", "Campo Requerido", "Debes seleccionar una categoría.");
        return false;
    }

    return true;
  };

  // ========== HANDLERS ==========

  const validatePrice = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
        handleInputChange(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (!validarFormulario()) return;

    setLoading(true);

    try {
      let result;
      const dataToSend = {
          ...formData,
          precio: parseFloat(formData.precio),
          categoria_id: parseInt(formData.categoria_id),
          creado_por: user ? user.id : formData.creado_por
      };

      if (initialData) {
        // EDITAR
        result = await put(`productos/${initialData.id}`, dataToSend);
      } else {
        // CREAR
        result = await post("productos", dataToSend);
      }

      if (result) {
        showToast(
            "success", 
            initialData ? "Producto Actualizado" : "Producto Creado",
            initialData ? "Los cambios se guardaron correctamente." : "El producto se ha registrado exitosamente."
        );
        resetForm();
        onClose(); 
      } else {
         showToast("error", "Error", "No se pudo guardar el producto.");
      }

    } catch (error) {
        console.error(error);
        showToast("error", "Error del Servidor", "Ocurrió un problema al procesar la solicitud.");
    } finally {
        setLoading(false);
    }
  };

  const handleCancelar = async () => {
    const hayDatos = formData.nombre || formData.descripcion || (formData.precio && formData.precio > 0);

    if (hayDatos && !initialData) {
        const confirmed = await showConfirm({
            title: "¿Descartar cambios?",
            message: "Los datos ingresados se perderán si no los guardas.",
            confirmText: "Sí, descartar",
            cancelText: "Seguir editando",
            type: "warning"
        });

        if (!confirmed) return;
    }
    
    resetForm();
    onClose();
  };

  return (
    <div className="formContainer">
      <div className="formHeader">
        <h2 className="formTitle">
            {initialData ? 'Editar Producto' : 'Agregar Nuevo Producto'}
        </h2>
        <button onClick={handleCancelar} className="closeButton" disabled={loading}>
          ×
        </button>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="formGrid">
          <div>
            <label className="label">Nombre del Producto *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Ej: Café Espresso"
              required
              className="input"
              disabled={loading}
            />
          </div>

          <div>
            <label className="label">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Describe el producto..."
              rows="4"
              className="textarea"
              disabled={loading}
            />
          </div>

          <div>
            <label className="label">Precio *</label>
            <input
              type="text" 
              name="precio"
              value={formData.precio}
              onChange={validatePrice}
              placeholder="0.00"
              required
              className="input"
              disabled={loading}
            />
          </div>

          <div>
            <label className="label">URL Imagen *</label>
            <input
              type="text"
              name="url_imagen"
              value={formData.url_imagen}
              onChange={handleInputChange}
              placeholder="http://example.com/imagen.jpg"
              required
              className="input"
              disabled={loading}
            />
          </div>

          <div>
            <label className="label">Categoría *</label>
            <select 
                value={formData.categoria_id} 
                name="categoria_id" 
                className="select" 
                onChange={handleInputChange} 
                required
                disabled={loading}
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="checkboxContainer">
          <input
            type="checkbox"
            name="disponible"
            className="checkbox"
            id="disponible"
            checked={!!formData.disponible}
            onChange={handleInputChange}
            disabled={loading}
          />
          <label htmlFor="disponible" className="checkboxLabel">
            Producto disponible
          </label>
        </div>

        <div className="buttonGroup">
          <button 
            type="button" 
            onClick={handleCancelar} 
            className="cancelButton"
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="submitButton"
            disabled={loading}
          >
            {loading ? 'Guardando...' : (initialData ? 'Actualizar Producto' : 'Guardar Producto')}
          </button>
        </div>
      </form>
    </div>
  );
};