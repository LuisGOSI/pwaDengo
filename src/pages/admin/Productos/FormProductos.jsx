import { useState } from "react"

export const FormProductos =({ onClose })=> {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    categoria: "",
    descripcion: "",
    precio: 0,
    sucursal: "",
    stock: 0,
    disponible: true,
  })

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? e.target.checked : type === "number" ? Number.parseFloat(value) : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Producto añadido:", formData)
    onClose()
  }

  return (
    <div className="formContainer">
      <div className="formHeader">
        <h2 className="formTitle">Agregar Nuevo Producto</h2>
        <button onClick={onClose} className="closeButton">
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="formGrid">
          <div>
            <label className="label">Nombre del Producto *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Café Espresso"
              required
              className="input"
            />
          </div>

          <div>
            <label className="label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="producto@dengo.com"
              className="input"
            />
          </div>

          <div>
            <label className="label">Categoría *</label>
            <select name="categoria" value={formData.categoria} onChange={handleChange} required className="select">
              <option value="">Selecciona una categoría</option>
              <option value="Bebidas">Bebidas</option>
              <option value="Postres">Postres</option>
              <option value="Comida">Comida</option>
              <option value="Panadería">Panadería</option>
            </select>
          </div>

          <div>
            <label className="label">Precio *</label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
              className="input"
            />
          </div>

          <div>
            <label className="label">Sucursal *</label>
            <select name="sucursal" value={formData.sucursal} onChange={handleChange} required className="select">
              <option value="">Selecciona una sucursal</option>
              <option value="Centro">Centro</option>
              <option value="Norte">Norte</option>
              <option value="Sur">Sur</option>
            </select>
          </div>

          <div>
            <label className="label">Stock Disponible</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="input"
            />
          </div>
        </div>

        <div>
          <label className="label">Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Describe el producto..."
            rows="4"
            className="textarea"
          />
        </div>

        <div className="checkboxContainer">
          <input
            type="checkbox"
            name="disponible"
            checked={formData.disponible}
            onChange={handleChange}
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
          <button type="submit" className="submitButton">
            Guardar Producto
          </button>
        </div>
      </form>
    </div>
  )
}
