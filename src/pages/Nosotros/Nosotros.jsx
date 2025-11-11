import { Footer } from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import Card from "../../components/common/Card";
import "./Nosotros.css";
import johanImg from "../../assets/images/team/johan.jpg";
import armandoImg from "../../assets/images/team/armando.jpg";
import salasImg from "../../assets/images/team/salas.jpg";
import charlyImg from "../../assets/images/team/charly.jpg";
import nachoImg from "../../assets/images/team/nacho.jpg";
import local from "../../assets/images/dengo_local.jpg";
import product from '../../assets/images/products.png';

export const Nosotros = () => {

    const teamMembers = [
        {
            image: johanImg,
            name: "Johan Antonio Lino Moreno",
            role: "Head Barista",
            description: "Hola soy Johan, Head Barista en Dengo. Apasionado por el café de especialidad y la creación de experiencias únicas para nuestros clientes. Soy una persona que busca cumplir con sus metas y sueños. Hoy estoy aqui en Dengo para compartir mi pasión por el café contigo."
        },
        {
            image: armandoImg,
            name: "Armando Daniel Rodríguez Fajardo",
            role: "Gerente",
            description: "Hola Papu :V yo soy Armando, Gerente en Dengo. Me apasiona brindar un servicio excepcional y crear un ambiente acogedor para nuestros clientes. Creo firmemente en el trabajo en equipo y en la importancia de cada detalle para ofrecer una experiencia inolvidable."
        },
        {
            image: salasImg,
            name: "José Alejandro Salas Ibarra",
            role: "Subgerente y Mixólogo",
            description: "Hola soy Alejandro, Subgerente y Mixólogo en Dengo. Me encanta tanto el café como me encanta One Piece que me hace amar lo que hago. Mi objetivo es asegurarme de que cada visita a Dengo sea una experiencia memorable, llena de sabor y buen ambiente."
        },
        {
            image: charlyImg,
            name: "Carlos Alberto Ramírez Tovar",
            role: "Barista",
            description: "Hola, yo soy Carlos o Charly para las minitas. Comencé en este trabajo porque me apasiona el olor al café, preparar bebidas y ver la sonrisa en los clientes cuando prueban nuestras creaciones. En Dengo, cada taza que sirvo es una oportunidad para compartir mi amor por el café y hacer que cada visita sea especial."
        },
        {
            image: nachoImg,
            name: "Luis Ignacio González Silva",
            role: "Cajero y Atención a Clientes Dengo",
            description: "Hola, soy Ignacio o Nachito para los reales. Me encanta interactuar con los clientes y asegurarme de que tengan una experiencia agradable en Dengo. Disfruto creando un ambiente amigable y acogedor, donde cada persona se sienta valorada y bien atendida."
        }
    ];

    return (
        <div className="nosotros-container">
            <Header />
            
            {/* Hero Section */}
            <div className="nosotros-hero">
                <h1 className="nosotros-titulo">NOSOTROS</h1>
                <p className="nosotros-subtitulo">¡Pasión que inspira!</p>
                <p className="nosotros-descripcion">
                    Más que una cafetería convencional, somos un espacio donde convergen<br />
                    el buen café, la gastronomía auténtica y momentos inolvidables
                </p>
            </div>

            {/* Sección Historia */}
            <section className="historia-section">
                <div className="historia-content">
                    <div className="historia-image-box">
                        <img className="historia-img" src={ local } />
                    </div>
                    <div className="historia-text">
                        <h2>NUESTRA HISTORIA</h2>
                        <p>
                            Dengo nació en 2022 con una visión clara: crear un espacio donde la calidad del café
                            y la comida se encuentren con una atmósfera acogedora y contemporánea.
                        </p>
                        <p>
                            En León, Guanajuato, comenzamos como una pequeña cafetería con grandes sueños. Hoy,
                            somos un restaurante bar que combina lo mejor de tres mundos: café artesanal de
                            especialidad, gastronomía creativa y mixología innovadora.
                        </p>
                        <p>
                            Cada detalle en Dengo ha sido pensado para ofrecer una experiencia completa, desde la
                            selección de nuestros granos de café hasta la presentación de cada platillo.
                        </p>
                    </div>
                </div>
            </section>

            {/* Sección Filosofía */}
            <section className="filosofia-section">
                <div className="filosofia-content">
                    <div className="filosofia-text">
                        <h2>NUESTRA FILOSOFÍA</h2>
                        <p>
                            Creemos que la buena comida y el buen café tienen el poder de unir personas y crear
                            momentos especiales. Por eso, trabajamos cada día para ofrecer productos de la más
                            alta calidad.
                        </p>
                        <p>
                            Nos apasiona la sostenibilidad y el trabajo directo con productores locales. Cada
                            ingrediente es seleccionado cuidadosamente, priorizando la frescura y el origen
                            responsable.
                        </p>
                        <p>
                            En Dengo, no solo servimos alimentos y bebidas, creamos experiencias que permanecen
                            en la memoria de nuestros clientes.
                        </p>
                    </div>
                    <div className="filosofia-image-box">
                        <img className="historia-img" src={ product } alt="producto" />
                    </div>
                </div>
            </section>

            {/* Sección Visión, Misión y Valores */}
            <section className="vision-section">
                <h2>VISIÓN, MISIÓN Y VALORES</h2>
                <div className="vision-cards">
                    <div className="vision-card">
                        <h3>VISIÓN</h3>
                        <p>
                            Tenemos la visión de ser reconocidos como un referente en la industria de la hospitalidad,
                            destacándonos por nuestra calidad, innovación y compromiso con la comunidad.
                        </p>
                    </div>
                    <div className="vision-card">
                        <h3>MISIÓN</h3>
                        <p>
                            Nuestra misión es ofrecer una experiencia excepcional a través de productos de alta calidad,
                            un servicio cálido y un ambiente acogedor que invite a nuestros clientes a regresar.
                        </p>
                    </div>
                    <div className="vision-card">
                        <h3>VALORES</h3>
                        <p>
                            Calidad, Sostenibilidad, Innovación, Comunidad, Pasión por el servicio.
                        </p>
                    </div>
                </div>
            </section>

            {/* Sección Equipo - AHORA USA EL COMPONENTE CARD */}
            <section className="equipo-section">
                <h2>NUESTRO EQUIPO</h2>
                <div className="equipo-grid">
                    {teamMembers.map((member, index) => (
                        <Card 
                            key={index}
                            name={member.name}
                            role={member.role}
                            description={member.description}
                            image={member.image}
                        />
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}