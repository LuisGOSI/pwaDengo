import { Footer } from "../../../components/layout/Footer";
import Header from "../../../components/layout/Header";
import { FormProductos } from "./FormProductos";
import { TablaProductos } from "./TablaProductos";
import "./Productos.css";
import { useState } from "react";
import React from "react";

export const Productos = () => {
	const [showForm, setShowForm] = useState(false);

	return (
		<div className="container">
			<div className="mainWrapper">
				<Header />
				<main className="main">
					<div className="content">
						<div className="headerSection">
							<div>
								<h1 className="title">Catálogo de Productos</h1>
								<p className="subtitle">Gestiona todos tus productos</p>
							</div>
							<button
								onClick={() => setShowForm(!showForm)}
								className="addButton"
							>
								<span className="plus">+</span> Añadir Producto
							</button>
						</div>

						{showForm && <FormProductos onClose={() => setShowForm(false)} />}

						<TablaProductos />
					</div>
				</main>
			</div>
		</div>
	);
};
