import { Footer } from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import "./Nosotros.css";

export const Nosotros = () => {

    const teamMembers = [
        {
            name: "Johan Antonio Lino Moreno",
            role: "Head Barista",
            description: "Certificado en alta escuela de especialidad con más de 8 años de experiencia. Su pasión por el café es contagiosa."
        },
        {
            name: "Armando Daniel Rodríguez Fajardo",
            role: "Gerente",
            description: "Formado en alta cocina europea, combina técnicas clásicas con sabores contemporáneos mexicanos."
        },
        {
            name: "José Alejandro Salas Ibarra",
            role: "Mixólogo",
            description: "Formado en alta cocina europea, domina técnicas clásicas con sabores contemporáneos mexicanos."
        },
        {
            name: "Carlos Alberto Ramírez Tovar",
            role: "Barista",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        },
        {
            name: "Luis Ignacio González Silva",
            role: "Mixólogo",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        }
    ];

    return (
        <div>
            <Header />
            <div className="menu-section">
                <h2>NOSOTROS</h2>
                <p>
                    Más que una cafetería convencional, somos un espacio donde convergen el buen café, la gastronomía auténtica y momentos inolvidables
                </p>
            </div>

            {/* Sección Historia */}
            <section className="historia-section">
                <div className="historia-content">
                    <div className="historia-image-box">
                        
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
                    <div className="filosofia-image-box"></div>
                </div>
            </section>

            {/* Sección Visión, Misión y Valores */}
            <section className="vision-section">
                <h2>NUESTRA VISIÓN, MISIÓN Y VALORES</h2>
                <div className="vision-cards">
                    <div className="vision-card">
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                            irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                            pariatur.
                        </p>
                    </div>
                    <div className="vision-card">
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                            irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                            pariatur.
                        </p>
                    </div>
                    <div className="vision-card">
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                            irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                            pariatur.
                        </p>
                    </div>
                </div>
            </section>

            {/* Sección Equipo */}
            <section className="equipo-section">
                <h2>NUESTRO EQUIPO</h2>
                <div className="equipo-grid">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="team-member">
                            <div className="member-image">
                                <div className="placeholder-image"></div>
                            </div>
                            <h3>{member.name}</h3>
                            <h4>{member.role}</h4>
                            <p>{member.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}