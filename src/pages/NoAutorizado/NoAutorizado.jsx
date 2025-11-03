import { useNavigate } from "react-router-dom";
import "./NoAutorizado.css";

export default function NoAutorizado() {
	const navigate = useNavigate();

	return (
		<div className="unauthorized-container">
			<div className="unauthorized-content">
				{/* Ícono de Taza Bloqueada */}
				<div className="blocked-icon">
					<svg
						viewBox="0 0 120 120"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						{/* Taza de café */}
						<path
							d="M30 45C30 45 35 35 45 35C55 35 60 45 60 45"
							stroke="#A0826D"
							strokeWidth="3"
							strokeLinecap="round"
							opacity="0.5"
						/>
						<path
							d="M20 50H70C73 50 75 52 75 55V80C75 86 70 92 65 92H25C20 92 15 86 15 80V55C15 52 17 50 20 50Z"
							fill="#D4B5A0"
							stroke="#A0826D"
							strokeWidth="3"
							opacity="0.5"
						/>
						<path
							d="M75 55H82C85 55 88 58 88 61V68C88 71 85 74 82 74H75"
							stroke="#A0826D"
							strokeWidth="3"
							opacity="0.5"
						/>

						{/* Símbolo de prohibido */}
						<circle
							cx="60"
							cy="60"
							r="35"
							fill="white"
							stroke="#DC2626"
							strokeWidth="4"
						/>
						<circle
							cx="60"
							cy="60"
							r="35"
							fill="none"
							stroke="#DC2626"
							strokeWidth="6"
						/>
						<line
							x1="35"
							y1="35"
							x2="85"
							y2="85"
							stroke="#DC2626"
							strokeWidth="6"
							strokeLinecap="round"
						/>
					</svg>
				</div>

				{/* Contenido del mensaje */}
				<h1 className="unauthorized-title">Acceso Restringido</h1>
				<p className="unauthorized-subtitle">
					Lo sentimos, no tienes permiso para acceder a esta página
				</p>

				<div className="unauthorized-message">
					<p>Esta área está reservada para usuarios autorizados.</p>
					<p>Si crees que esto es un error, contacta al administrador.</p>
				</div>

				{/* Botones de acción */}
				<div className="unauthorized-actions">
					<button onClick={() => navigate(-1)} className="btn-secondary">
						← Volver atrás
					</button>
					<button onClick={() => navigate("/")} className="btn-primary">
						Ir al inicio
					</button>
				</div>

				{/* Decoración de granos */}
				<div className="coffee-bean bean-1"></div>
				<div className="coffee-bean bean-2"></div>
				<div className="coffee-bean bean-3"></div>
			</div>
		</div>
	);
}
