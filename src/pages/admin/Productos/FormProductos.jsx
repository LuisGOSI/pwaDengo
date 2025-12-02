import { useEffect, useState } from "react";
import { useAPI } from "../../../utils/UseAPI";
import { useForm } from "../../../utils/UseForm";
import "./Productos.css";
import { useAuth } from "../../../services/AuthContext";

export const FormProductos = ({ initialData, onClose }) => {
  const { user } = useAuth();
  const { formData, handleInputChange, resetForm, setFormData } = useForm({
    nombre: "",
    descripcion: "",
    precio: 0,
    url_imagen: "",
    categoria_id: 0,
    creado_por: user ? user.id : "",
  });

  const { post, put, get, loading, error } = useAPI("http://localhost:3000/api/");
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      const response = await get("categorias");
      setCategorias(response.data);
    };

    fetchCategorias();
  }, []);

  const handleSubmit = async () => {
    let result;

    // Si hay initialData → EDITAR
    if (initialData) {
      result = await put(`productos/${initialData.id}`, formData);
    } else {
      // Si no → AGREGAR
      result = await post("productos", formData);
    }

    if (result) {
      resetForm();
      onClose(); // Cerramos el formulario después de guardar
    }
  };

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validatePrice = (e) => {
    const value = e.target.value;
    if (!Number(value)) {
      e.target.value = "";
    }
    if (value.includes("-")) {
      e.target.value = value.replace("-", "");
    }
    handleInputChange(e);
  }

  return (
    <div className="formContainer">
      <div className="formHeader">
        <h2 className="formTitle">Agregar Nuevo Producto</h2>
        <button onClick={onClose} className="closeButton">
          ×
        </button>
      </div>

      <div  className="form">
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
            />
          </div>

          <div>
            <label className="label">Precio</label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={validatePrice}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
              className="input"
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
            />
          </div>

          <div>
            <label className="label">Categoría *</label>
            <select value={formData.categoria_id ?? ''} name="categoria_id" className="select" onChange={handleInputChange} required>
              <option value="" disabled>Selecciona una categoría</option>
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
          />
          <label htmlFor="disponible" className="checkboxLabel">
            Producto disponible
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="buttonGroup">
          <button type="button" onClick={onClose} className="cancelButton">
            Cancelar
          </button>
          <button type="submit" onClick={handleSubmit} className="submitButton">
            Guardar Producto
          </button>
        </div>
      </div>
    </div>
  );
};
