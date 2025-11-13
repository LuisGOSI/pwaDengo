import { useEffect, useState } from "react";
import { useAPI } from "../../../utils/UseAPI";
import { useForm } from "../../../utils/UseForm";

export const FormIngredientes = ({ initialData, onClose }) => {
  const { formData, handleInputChange, resetForm, setFormData } = useForm({
    nombre: "",
    descripcion: "",
    tipo: "",
    activo: "",
    creado_por: "b46d3602-5244-49b5-a0d6-d17233e28aa4",
  });

  const { post, put, loading, error } = useAPI("http://localhost:3000/api/");

  const handleSubmit = async () => {
    let result;

    // Si hay initialData → EDITAR
    if (initialData) {
      result = await put(`ingredientes/${initialData.id}`, formData);
    } else {
      // Si no → AGREGAR
      result = await post("ingredientes", formData);
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
            <label className="label">Nombre del ingrediente *</label>
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
            <label className="label">Tipo *</label>
            <select name="tipo" className="select" value={formData.tipo} onChange={handleInputChange}>
              <option value="">Selecciona una categoría</option>
              <option value="Base">Base</option>
              <option value="Endulzante">Endulzante</option>
              <option value="Lacteo">Lacteo</option>
            </select>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="buttonGroup">
          <button type="button" onClick={onClose} className="cancelButton">
            Cancelar
          </button>
          <button type="submit" onClick={handleSubmit} className="submitButton">
            Guardar ingrediente
          </button>
        </div>
      </div>
    </div>
  );
};
