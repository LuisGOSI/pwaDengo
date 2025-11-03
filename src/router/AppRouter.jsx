import { Route, Routes } from "react-router-dom";
import { Menu } from "../pages/Menu/Menu.jsx";
import { Sucursales } from "../pages/admin/Sucursales/Sucursales.jsx";
import { ProtectedRoute } from "../components/common/ProtectedRoute.jsx";
import NoAutorizado from "../pages/NoAutorizado/NoAutorizado.jsx";
import Login from "../pages/Login/Login.jsx";

export const AppRouter = () => {
	return (
		<Routes>
			{/* Rutas públicas */}
			<Route path="/" element={<Menu />} />
			<Route path="/login" element={<Login />} />
			<Route path="/menu" element={<Menu />} />

			{/* Rutas protegidas */}
			<Route
				path="/admin/productos"
				element={
					<ProtectedRoute allowedRoles={[1]}>
						<h1>Gestión de Productos</h1>
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
