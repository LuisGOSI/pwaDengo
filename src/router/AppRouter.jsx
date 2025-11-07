import { Route, Routes } from "react-router-dom";
import { Sucursales } from "../pages/admin/Sucursales/Sucursales.jsx";
import { ProtectedRoute } from "../components/common/ProtectedRoute.jsx";
import NoAutorizado from "../pages/NoAutorizado/NoAutorizado.jsx";
import Login from "../pages/Login/Login.jsx";
import { Productos } from "../pages/admin/Productos/Productos.jsx"
import { Inicio } from "../pages/Inicio";
import { Menu } from "../pages/Menu/Menu";
import { Nosotros } from "../pages/Nosotros/Nosotros";
import { Dashboard } from "../pages/admin/Dashboard/Dashboard.jsx";
import { Galeria } from "../pages/Galeria/Galeria.jsx";
import { Contacto } from "../pages/Contacto/Contacto.jsx";
import { Eventos } from "../pages/admin/Eventos/Evento.jsx";
import { Usuarios } from "../pages/admin/Usuarios/Usuarios.jsx";
import { Promociones } from "../pages/admin/Promociones/Promociones.jsx";
import { CatalogoCategorias } from "../pages/admin/CatalogoCategoria/CatalagoCategoria.jsx";
import { SegmentacionPromociones } from "../pages/admin/SegmentacionPromociones/SegmentacionPromociones.jsx";
import { CobranzaDigital } from "../pages/caja/CobranzaDigital/CobranzaDigital.jsx";
import { CorteCaja } from "../pages/caja/CorteCaja/CorteCaja.jsx";
import { ReporteVenta } from "../pages/admin/ReporteVenta/ReporteVenta.jsx";
import { CarteleraEventos } from "../pages/CarteleraEventos/CarteleraEventos.jsx";
import { Resenias } from "../pages/admin/Resenias/Resenias.jsx";
import { Ordenes } from "../pages/Ordenes/Ordenes.jsx";

export const AppRouter = () => {
	return (
		<Routes>
			{/* Rutas públicas */}
			<Route path="/" element={<Inicio />} />
			<Route path="/login" element={<Login />} />
			<Route path="/menu" element={<Menu />} />
			<Route path="/nosotros" element={<Nosotros />} />
			<Route path="/contacto" element={<Contacto />} />
			<Route path="/galeria" element={<Galeria />} />
			<Route path="/CarteleraEventos" element={<CarteleraEventos />} />

			{/* Rutas protegidas */}
			<Route
				path="/admin/dashboard"
				element={
					<ProtectedRoute allowedRoles={[1,2]}>
						<Dashboard />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/admin/usuarios"
				element={
					<ProtectedRoute allowedRoles={[1,2]}>
						<Usuarios/>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/admin/productos"
				element={
					<ProtectedRoute allowedRoles={[1,2]}>
						<Productos />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/admin/eventos"
				element={
					<ProtectedRoute allowedRoles={[1,2]}>
						<Eventos />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/admin/CatalogoCategorias"
				element={
					<ProtectedRoute allowedRoles={[1,2]}>
						<CatalogoCategorias />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/admin/promociones"
				element={
					<ProtectedRoute allowedRoles={[1,2]}>
						<Promociones />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/admin/promociones"
				element={
					<ProtectedRoute allowedRoles={[1,2]}>
						<Promociones />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/admin/SegmentacionPromociones"
				element={
					<ProtectedRoute allowedRoles={[1,2]}>
						<SegmentacionPromociones />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/admin/CobranzaDigital"
				element={
					<ProtectedRoute allowedRoles={[1,2, 4]}>
						<CobranzaDigital />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/admin/CorteCaja"
				element={
					<ProtectedRoute allowedRoles={[1,2, 4]}>
						<CorteCaja />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/admin/ReporteVenta"
				element={
					<ProtectedRoute allowedRoles={[1,2]}>
						<ReporteVenta />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/admin/Sucursal"
				element={
					<ProtectedRoute allowedRoles={[1,2]}>
						<Sucursales />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/admin/resenias"
				element={
					<ProtectedRoute allowedRoles={[1,2]}>
						<Resenias />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/ordenes"
				element={
					<ProtectedRoute allowedRoles={[1,3]}>
					<Ordenes></Ordenes>
					</ProtectedRoute>
				}
			/>
			


			

			{/* Rutas especiales */}
			<Route path="/no-autorizado" element={<NoAutorizado />} />
			<Route path="/*" element={<h1>404 - Not Found</h1>} />
		</Routes>
	);
};
