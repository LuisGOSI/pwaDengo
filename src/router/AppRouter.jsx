import { Route, Routes } from "react-router-dom";
import { Sucursales } from "../pages/admin/Sucursales/Sucursales.jsx";
import { ProtectedRoute } from "../components/common/ProtectedRoute.jsx";
import NoAutorizado from "../pages/NoAutorizado/NoAutorizado.jsx";
import Login from "../pages/Login/Login.jsx";
import {Productos} from "../pages/admin/Productos/Productos.jsx"
import { Inicio } from "../pages/Inicio";
import { Menu } from "../pages/Menu/Menu";
import { Nosotros } from "../pages/Nosotros/Nosotros";

export const AppRouter = () => {
	return (
		<Routes>
			{/* Rutas públicas */}
			<Route path="/" element={<Inicio />} />
			<Route path="/login" element={<Login />} />
			<Route path="/menu" element={<Menu />} />

			{/* Rutas protegidas */}
			<Route
				path="/admin/productos"
				element={
					<ProtectedRoute allowedRoles={[1]}>
						<Productos />
					</ProtectedRoute>
				}
			/>

			<Route
				path="/admin/sucursales"
				element={
					<ProtectedRoute allowedRoles={[1]}>
						<Sucursales />
					</ProtectedRoute>
				}
			/>

			{/* Rutas especiales */}
			<Route path="/no-autorizado" element={<NoAutorizado />} />
			<Route path="/*" element={<h1>404 - Not Found</h1>} />
		</Routes>
	);
};
