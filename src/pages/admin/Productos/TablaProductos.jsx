
import { useState } from "react"


const products = [
  {
    id: "1",
    nombre: "Café Espresso",
    email: "cafe@dengo.com",
    categoria: "Bebidas",
    precio: 35.0,
    sucursal: "Centro",
  },
  {
    id: "2",
    nombre: "Cappuccino",
    email: "cappuccino@dengo.com",
    categoria: "Bebidas",
    precio: 45.0,
    sucursal: "Centro",
  },
  {
    id: "3",
    nombre: "Pastél de Chocolate",
    email: "pastel@dengo.com",
    categoria: "Postres",
    precio: 50.0,
    sucursal: "Norte",
  },
  {
    id: "4",
    nombre: "Sándwich de Jamón",
    email: "sandwich@dengo.com",
    categoria: "Comida",
    precio: 85.0,
    sucursal: "Sur",
  },
  {
    id: "5",
    nombre: "Té Matcha",
    email: "matcha@dengo.com",
    categoria: "Bebidas",
    precio: 55.0,
    sucursal: "Centro",
  },
  {
    id: "6",
    nombre: "Croissant",
    email: "croissant@dengo.com",
    categoria: "Panadería",
    precio: 40.0,
    sucursal: "Centro",
  },
]

const getCategoryColor = (categoria) => {
  const colors = {
    Bebidas: { bg: "#e3f2fd", text: "#1976d2" },
    Postres: { bg: "#fce4ec", text: "#c2185b" },
    Comida: { bg: "#fff3e0", text: "#f57c00" },
    Panadería: { bg: "#fffde7", text: "#f9a825" },
  }
  return colors[categoria] || { bg: "#f5f5f5", text: "#666" }
}

export const TablaProductos = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !categoryFilter || product.categoria === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(products.map((p) => p.categoria))]

  return (
    <div className="catalogContainer">
      {/* Filters */}
      <div className="filterSection">
        <h2 className="filterTitle">Filtros</h2>
        <div className="filterGrid">
          <div>
            <label className="label">Buscar</label>
            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="label">Categoría</label>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="select">
              <option value="">Todas</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Sucursal</label>
            <select className="select">
              <option>Todas</option>
              <option>Centro</option>
              <option>Norte</option>
              <option>Sur</option>
            </select>
          </div>
        </div>
        <button className="filterButton">Filtrar</button>
      </div>

      {/* Product List */}
      <div className="tableWrapper">
        <table className="table">
          <thead>
            <tr>
              <th>PRODUCTO</th>
              <th>CATEGORÍA</th>
              <th>SUCURSAL</th>
              <th>PRECIO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, idx) => {
              const colors = getCategoryColor(product.categoria)
              return (
                <tr key={idx}>
                  <td>
                    <div className="productInfo">
                      <div className="productCircle">{product.nombre.charAt(0)}</div>
                      <div>
                        <p className="productName">{product.nombre}</p>
                        <p className="productEmail">{product.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="categoryBadge" style={{ backgroundColor: colors.bg, color: colors.text }}>
                      {product.categoria}
                    </span>
                  </td>
                  <td>{product.sucursal}</td>
                  <td className="price">${product.precio.toFixed(2)}</td>
                  <td>
                    <button className="editButton">Editar</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="footer">Total: {filteredProducts.length} productos</div>
    </div>
  )
}
