import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import supabase from "../../services/supabase";
import { useAuth } from "../../services/AuthContext";
// 1. Importamos el hook de mensajes
import { useMensaje } from "../../context/MensajeContext";
import Header from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";

import "./Login.css";

export default function Login() {
    const location = useLocation();
    const navigate = useNavigate();
    const { session, loading, role } = useAuth();

    // 2. Extraemos la función para mostrar alertas
    const { mostrarMensaje } = useMensaje();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [authLoading, setAuthLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    // Lógica de redirección centralizada
    useEffect(() => {
        if (session) {
            // Si el rol es mayor a 0, es personal/admin
            if (role && role > 0) {
                const from = location.state?.from?.pathname || "/admin";
                navigate(from);
            } 
            // Si el rol es null o 0, asumimos que es CLIENTE y lo mandamos al portal
            else {
                navigate("/community");
            }
        }
    }, [session, role, navigate, location]);

    const handleGoogleSignIn = async () => {
        setAuthLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/community`, 
                },
            });

            if (error) throw error;
        } catch (error) {
            // 3. Reemplazo de alerta de error
            mostrarMensaje("error", error.message || "Ocurrió un error con Google");
            setAuthLoading(false);
        }
    };

    const handleAuth = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            // 3. Reemplazo de alerta de validación
            mostrarMensaje("error", "Por favor completa todos los campos");
            return;
        }

        if (password.length < 6) {
            // 3. Reemplazo de alerta de validación
            mostrarMensaje("error", "La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setAuthLoading(true);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        redirectTo: `${window.location.origin}/community`
                    },
                });

                if (error) throw error;

                // 3. Reemplazo de alerta de éxito
                mostrarMensaje("success", "Cuenta creada con éxito.");
                
                if (!session) {
                    setIsSignUp(false);
                    setEmail("");
                    setPassword("");
                    setAuthLoading(false);
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) throw error;
            }
        } catch (error) {
            // 3. Reemplazo de alerta de error general
            mostrarMensaje("error", error.message || "Ocurrió un error");
            setAuthLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (session) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="login-container">
                <div className="login-content">
                    {/* Sección izquierda - Branding */}
                    <div className="login-left">
                        <div className="brand-section">
                            <div className="coffee-icon">
                                <svg
                                    viewBox="0 0 64 64"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M16 24C16 24 20 16 28 16C36 16 40 24 40 24"
                                        stroke="#8B6F47"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M12 28H44C46 28 48 30 48 32V48C48 52 44 56 40 56H16C12 56 8 52 8 48V32C8 30 10 28 12 28Z"
                                        fill="#A0826D"
                                        stroke="#8B6F47"
                                        strokeWidth="2"
                                    />
                                    <path
                                        d="M48 32H52C54 32 56 34 56 36V40C56 42 54 44 52 44H48"
                                        stroke="#8B6F47"
                                        strokeWidth="2"
                                    />
                                    <circle cx="28" cy="40" r="3" fill="#6B5447" opacity="0.3" />
                                </svg>
                            </div>
                            <h1 className="brand-title">Dengo Cafetería</h1>
                            <p className="brand-subtitle">
                                Descubre el arte de un café perfecto
                            </p>
                        </div>

                        <div className="coffee-beans"></div>
                        <div className="coffee-beans-2"></div>
                    </div>

                    {/* Sección derecha - Formulario */}
                    <div className="login-right">
                        <div className="form-container">
                            <h2 className="form-title">
                                {isSignUp ? "Crear cuenta" : "Bienvenido de nuevo"}
                            </h2>
                            <p className="form-subtitle">
                                {isSignUp
                                    ? "Únete a nuestra comunidad cafetera"
                                    : "Inicia sesión para continuar"}
                            </p>

                            <form onSubmit={handleAuth} className="space-y-5 mt-8">
                                <div>
                                    <label className="input-label">Correo electrónico</label>
                                    <input
                                        type="email"
                                        placeholder="tu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="custom-input"
                                        disabled={authLoading}
                                    />
                                </div>

                                <div>
                                    <label className="input-label">Contraseña</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="custom-input"
                                        disabled={authLoading}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="submit-button"
                                    disabled={authLoading}
                                >
                                    {authLoading
                                        ? "Cargando..."
                                        : isSignUp
                                            ? "Crear cuenta"
                                            : "Iniciar sesión"}
                                </button>
                            </form>

                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="toggle-button"
                                disabled={authLoading}
                            >
                                {isSignUp
                                    ? "¿Ya tienes cuenta? Inicia sesión"
                                    : "¿No tienes cuenta? Regístrate"}
                            </button>

                            <div className="divider">
                                <span>O continúa con</span>
                            </div>

                            <button
                                onClick={handleGoogleSignIn}
                                className="google-button"
                                disabled={authLoading}
                            >
                                <img
                                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                    alt="Google"
                                    className="w-5 h-5"
                                    disabled={authLoading}
                                />
                                Google
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}