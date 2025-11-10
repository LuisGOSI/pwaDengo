import { Route, Routes } from "react-router-dom";
import { Sucursales } from "../pages/admin/Sucursales/Sucursales.jsx";
import { ProtectedRoute } from "../components/common/ProtectedRoute.jsx";
import NoAutorizado from "../pages/NoAutorizado/NoAutorizado.jsx";
import Login from "../pages/Login/Login.jsx";
import { Productos } from "../pages/admin/Productos/Productos.jsx"
import { Inicio } from "../pages/Inicio";
import { Menu } from "../pages/Menu/Menu";
import { Nosotros } from "../pages/Nosotros/Nosotros";
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
import { Ordenes } from "../pages/barista/Ordenes/Ordenes.jsx";
import { AdminPage } from "../pages/admin/AdminPage/AdminPage.jsx";
import { SidebarProvider } from "../context/SidebarContext.jsx";
import { NotFound } from "../components/layout/NotFound.jsx";
import { Ingredientes } from "../pages/barista/Ingredientes/Ingredientes.jsx";
import { ProductosComunidad } from "../pages/admin/ProductosComunidad/ProductosComunidad.jsx";
import { Configuracion } from "../pages/admin/Configuracion/Configuracion.jsx";
import { Cartelera } from "../pages/admin/Cartelera/Cartelera.jsx";

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
			{/* Ruta a Página de Admin */}
			<Route path="/admin/*" element={
				<ProtectedRoute allowedRoles={[1, 2, 3, 4]}>
					<SidebarProvider>
						<AdminPage />
					</SidebarProvider>
				</ProtectedRoute>
			} />
			{/* Ruta a Resportes de las ventas */}
			<Route path="/admin/ReporteVenta" element={
				<ProtectedRoute allowedRoles={[1, 2]}>
					<SidebarProvider>
						<ReporteVenta />
					</SidebarProvider>
				</ProtectedRoute>
			} />
			{/* Ruta a Gestión de pedidos / ordenes */}
			<Route path="/barista/ordenes" element={
				<ProtectedRoute allowedRoles={[2, 3, 4]}>
					<SidebarProvider>
						<Ordenes />
					</SidebarProvider>
				</ProtectedRoute>
			} />
			{/* Ruta a Corte de caja */}
			<Route path="/caja/CorteCaja" element={
				<ProtectedRoute allowedRoles={[1, 2, 4]}>
					<SidebarProvider>
						<CorteCaja />
					</SidebarProvider>
				</ProtectedRoute>
			} />
			{/* Ruta a Cobranza digital */}
			<Route path="/caja/CobranzaDigital" element={
				<ProtectedRoute allowedRoles={[1, 2, 4]}>
					<SidebarProvider>
						<CobranzaDigital />
					</SidebarProvider>
				</ProtectedRoute>
			} />
			{/* Ruta a Gestión de productos */}
			<Route path="/admin/productos" element={
				<ProtectedRoute allowedRoles={[1, 2, 3]}>
					<SidebarProvider>
						<Productos />
					</SidebarProvider>
				</ProtectedRoute>
			} />

			{/*Ruta a Gestión de ingredientes*/}
			<Route path="/admin/ingredientes" element={
				<ProtectedRoute allowedRoles={[1, 2, 3]}>
					<SidebarProvider>
						<Ingredientes />
					</SidebarProvider>
				</ProtectedRoute>
			} />
			{/* Ruta a Gestión de  categorias */}
			<Route path="/admin/CatalogoCategorias" element={
				<ProtectedRoute allowedRoles={[1, 2, 3, 4]}>
					<SidebarProvider>
						<CatalogoCategorias />
					</SidebarProvider>
				</ProtectedRoute>
			} />
			{/*Ruta a Productos de la comunidad*/}
			<Route path="/admin/ProductosComunidad" element={
				<ProtectedRoute allowedRoles={[1, 2, 3, 4]}>
					<SidebarProvider>
						<ProductosComunidad />
					</SidebarProvider>
				</ProtectedRoute>
			} />
			{/* Ruta a Gestión de promociones */}
			<Route path="/admin/promociones" element={
				<ProtectedRoute allowedRoles={[1, 2, 3, 4]}>
					<SidebarProvider>
						<Promociones />
					</SidebarProvider>
				</ProtectedRoute>
			} />
			{/*Ruta a Gestión de eventos*/}
			<Route path="/admin/eventos" element={
				<ProtectedRoute allowedRoles={[1, 2, 3, 4]}>
					<SidebarProvider>
						<Eventos />
					</SidebarProvider>
				</ProtectedRoute>
			} />

			{/*Ruta a Gestión de Cartelera*/}
			<Route path="/admin/cartelera" element={
				<ProtectedRoute allowedRoles={[1, 2]}>
					<SidebarProvider>
						<Cartelera />
					</SidebarProvider>
				</ProtectedRoute>
			} />
			{/* Ruta a Gestión de usuarios */}
			<Route path="/admin/usuarios" element={
				<ProtectedRoute allowedRoles={[1, 2]}>
					<SidebarProvider>
						<Usuarios />
					</SidebarProvider>
				</ProtectedRoute>
			} />
			{/* Ruta a Gestión de reseñas */}
			<Route path="/admin/resenias" element={
				<ProtectedRoute allowedRoles={[1, 2, 3]}>
					<SidebarProvider>
						<Resenias />
					</SidebarProvider>
				</ProtectedRoute>
			} />
			{/* Ruta a Segmentación de promociones */}
			<Route path="/admin/SegmentacionPromociones" element={
				<ProtectedRoute allowedRoles={[1, 2]}>
					<SidebarProvider>
						<SegmentacionPromociones />
					</SidebarProvider>
				</ProtectedRoute>
			} />
			{/* Ruta a Gestión de sucursales */}
			<Route path="/admin/Sucursal" element={
				<ProtectedRoute allowedRoles={[1, 2]}>
					<SidebarProvider>
						<Sucursales />
					</SidebarProvider>
				</ProtectedRoute>
			} />
			{/* Ruta a Usuarios y roles*/}

			{/* Ruta a configuración*/}
			<Route path="/admin/configuracion" element={
				<ProtectedRoute allowedRoles={[1, 2, 3, 4]}>
					<SidebarProvider>
						<Configuracion />
					</SidebarProvider>
				</ProtectedRoute>
			} />

			{/* Rutas especiales */}
			<Route path="/no-autorizado" element={<NoAutorizado />} />
			<Route path="/*" element={<NotFound />} />
		</Routes>
	);
};
