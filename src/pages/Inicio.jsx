import Header from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import InicioPage from '../pages/Inicio/Inicio';

export function Inicio() {
    return (
        <>
            <div>
                <Header />
                <InicioPage />
                <Footer />
            </div>
        </>
    );
}
