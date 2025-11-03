import { Navigate } from "react-router-dom";
import { useAuth } from "../../services/AuthContext";
import Spinner from "./Spinner";

export function ProtectedRoute({ children, allowedRoles }) {
	const { user, role, loading } = useAuth();


	// Si aún está cargando sesión o rol, esperamos
	if (loading || role === null) {
		return <Spinner />;
	}

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	if (allowedRoles && !allowedRoles.includes(role)) {
		return <Navigate to="/no-autorizado" replace />;
	}

	return children;
}
