import { Route, Routes } from "react-router-dom";
import { Inicio } from "../pages/Inicio";

export const AppRouter = () => {
	return (
		<Routes>
			<Route path="/" element={<h1> { <Inicio /> } </h1>} ></Route>
			<Route path="/login" element={<h1>Inicio de sesion</h1>} ></Route>
			
            //* Ruta para manejar errores 404
            <Route path="/*" element={<h1>404 - Not Found</h1>} ></Route>
		</Routes>
	);
};
