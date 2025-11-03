import { Route, Routes } from "react-router-dom";
import { Sucursales } from "../pages/Sucursales/Sucursales.jsx";
import {Productos} from "../pages/admin/Productos/Productos.jsx"
import { Inicio } from "../pages/Inicio";
import { Menu } from "../pages/Menu/Menu";

export const AppRouter = () => {
	return (
		<Routes>
			<Route path="/" element={<h1> { <Inicio /> } </h1>} ></Route>
			<Route path="/login" element={<h1>Inicio de sesion</h1>} ></Route>
			
            // TODO: Agregar las demas rutas
			<Route path="/menu" element={<Menu />} />
			<Route path="/sucursales" element={<Sucursales />} />
			<Route path="/productos" element= {<Productos />}/>

            //* Ruta para manejar errores 404
            <Route path="/*" element={<h1>404 - Not Found</h1>} ></Route>
		</Routes>
	);
};
