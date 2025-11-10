import { Navigate } from "react-router-dom";
import { useAuth } from "../../services/AuthContext";
import Spinner from "./Spinner";

export function ProtectedRoute({ children, allowedRoles }) {
    const { user, role, loading } = useAuth();

    // Si está cargando, mostrar spinner
    if (loading) {
        return <Spinner />;
    }

    // Si no hay usuario, redirigir al login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Si tenemos usuario pero el rol aún es null (está cargando), mostrar spinner
    if (user && role === null) {
        return <Spinner />;
    }

    // Si se especifican roles y el usuario no tiene un rol permitido
    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/no-autorizado" replace />;
    }

    return children;
}