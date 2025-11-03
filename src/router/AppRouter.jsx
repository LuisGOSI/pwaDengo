import { Route, Routes } from "react-router-dom";
import { Menu } from "../pages/Menu/Menu.jsx";
import { Sucursales } from "../pages/Sucursales/Sucursales.jsx";

export const AppRouter = () => {
	return (
		<Routes>
			<Route path="/" element={<h1>Raiz</h1>} ></Route>
			<Route path="/login" element={<h1>Inicio de sesion</h1>} ></Route>
            // TODO: Agregar las demas rutas
			<Route path="/menu" element={<Menu />} />
			<Route path="/sucursales" element={<Sucursales />} />

            //* Ruta para manejar errores 404
            <Route path="/*" element={<h1>404 - Not Found</h1>} ></Route>
		</Routes>
	);
};
