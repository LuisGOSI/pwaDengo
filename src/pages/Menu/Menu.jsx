import { useState } from "react";
import { Footer } from "../../components/layout/Footer";
import  Header  from "../../components/layout/Header";
import "./Menu.css";

export const Menu = () => {
  const [activeTab, setActiveTab] = useState("cafe");

  const menuData = {
    cafe: {
      title: "CAFÉ",
      subtitle: "Granos selectos, preparaciones artesanales",
      items: [
        {
          name: "Espresso",
          badge: "Clásico",
          description: "Shot doble de espresso intenso con notas de chocolate y caramelo",
          size: "60mL",
          price: "$45.00"
        }
      ]
    },
    comida: {
      title: "COMIDA",
      subtitle: "Platillos frescos y deliciosos",
      items: [
        {
          name: "Ensalada César",
          badge: "Fresco",
          description: "Lechuga romana, crutones artesanales y aderezo césar casero",
          size: "Porción completa",
          price: "$120.00"
        }
      ]
    },
    postre: {
      title: "POSTRE",
      subtitle: "Dulces tentaciones artesanales",
      items: [
        {
          name: "Cheesecake",
          badge: "Popular",
          description: "Cremoso cheesecake de Nueva York con base de galleta",
          size: "1 rebanada",
          price: "$85.00"
        }
      ]
    },
    comunidad: {
      title: "COMUNIDAD",
      subtitle: "Eventos y promociones especiales",
      items: [
        {
          name: "Membresía VIP",
          badge: "Exclusivo",
          description: "Acceso a eventos privados y descuentos especiales",
          size: "Membresía anual",
          price: "$500.00"
        }
      ]
    }
  };

  return (
    <div>
      <Header />
      <div className="menu-section">
        <h2>MENÚ</h2>
        <p>
          ¡Sabores que inspiran! <br />
          Explora nuestra cartelera para deleitarte con nuestras super promos y lo que tenemos por ofrecerte
        </p>
      </div>
      <div className="menu-tabs">
        <button 
          className={`menu-tab ${activeTab === "cafe" ? "active" : ""}`}
          onClick={() => setActiveTab("cafe")}
        >
          Café
        </button>
        <button 
          className={`menu-tab ${activeTab === "comida" ? "active" : ""}`}
          onClick={() => setActiveTab("comida")}
        >
          Comida
        </button>
        <button 
          className={`menu-tab ${activeTab === "postre" ? "active" : ""}`}
          onClick={() => setActiveTab("postre")}
        >
          Postre
        </button>
        <button 
          className={`menu-tab ${activeTab === "comunidad" ? "active" : ""}`}
          onClick={() => setActiveTab("comunidad")}
        >
          Comunidad
        </button>
      </div>
      <div className="category-section">
        <div className="category-header">
          <h3>{menuData[activeTab].title}</h3>
          <p>{menuData[activeTab].subtitle}</p>
        </div>

        <div className="menu-items">
          {menuData[activeTab].items.map((item, index) => (
            <div key={index} className="menu-item">
              <div className="item-header">
                <div className="item-title">
                  <h4>{item.name}</h4>
                  <span className="item-badge">{item.badge}</span>
                </div>
                <div className="item-price">{item.price}</div>
              </div>
              <p className="item-description">{item.description}</p>
              <p className="item-size">{item.size}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};