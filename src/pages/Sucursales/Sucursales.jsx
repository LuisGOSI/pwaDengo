import React, { useState } from 'react'
import { Footer } from "../../components/layout/Footer"
import  Header  from "../../components/layout/Header"
import "./Sucursales.css"

export const Sucursales = () => {
	const [mostrarFormulario, setMostrarFormulario] = useState(false)
	const [formData, setFormData] = useState({
		nombre: '',
		direccion: '',
		latitud: '',
		longitud: '',
		telefono: '',
		horario_apertura: ''
	})

	const [sucursales, setSucursales] = useState([
		{
			nombre: 'Sucursal Centro',
			direccion: 'Av. Principal 123, Centro',
			latitud: 21.1219,
			longitud: -101.6827,
			telefono: '(477) 123-4567',
			horario_apertura: '08:00'
		},
		{
			nombre: 'Sucursal Norte',
			direccion: 'Blvd. Norte 456, Col. Industrial',
			latitud: 21.1500,
			longitud: -101.7000,
			telefono: '(477) 234-5678',
			horario_apertura: '09:00'
		},
		{
			nombre: 'Sucursal Sur',
			direccion: 'Calzada Sur 789, Col. Residencial',
			latitud: 21.1000,
			longitud: -101.6500,
			telefono: '(477) 345-6789',
			horario_apertura: '08:30'
		},
		{
			nombre: 'Sucursal Plaza León',
			direccion: 'Plaza Comercial León, Local 45',
			latitud: 21.1300,
			longitud: -101.6900,
			telefono: '(477) 456-7890',
			horario_apertura: '10:00'
		},
		{
			nombre: 'Sucursal Universidad',
			direccion: 'Blvd. Universitario 321, Col. Jardines',
			latitud: 21.1400,
			longitud: -101.6700,
			telefono: '(477) 567-8901',
			horario_apertura: '08:00'
		}
	])

	const handleInputChange = (e) => {
		const { name, value } = e.target
		setFormData({
			...formData,
			[name]: value
		})
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		setSucursales([
			...sucursales,
			{
				...formData,
				latitud: parseFloat(formData.latitud),
				longitud: parseFloat(formData.longitud)
			}
		])
		setFormData({
			nombre: '',
			direccion: '',
			latitud: '',
			longitud: '',
			telefono: '',
			horario_apertura: ''
		})
		setMostrarFormulario(false)
	}

	const handleCancelar = () => {
		setFormData({
			nombre: '',
			direccion: '',
			latitud: '',
			longitud: '',
			telefono: '',
			horario_apertura: ''
		})
		setMostrarFormulario(false)
	}

	return (
		<div>
			<Header />
			<div className="sucursales-container">
				<div className="sucursales-content">
					<div className="sucursales-card">
						<div className="sucursales-header">
							<div>
								<h1 className="sucursales-title">Catálogo de Sucursales</h1>
							</div>
							<button
								className="btn-nuevo-evento"
								onClick={() => setMostrarFormulario(!mostrarFormulario)}
							>
								<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
								</svg>
								Nueva Sucursal
							</button>
						</div>

						{mostrarFormulario && (
							<div className="formulario-container">
								<h3 className="formulario-title">Nueva Sucursal</h3>
								<form onSubmit={handleSubmit} className="formulario-sucursal">
									<div className="form-row">
										<div className="form-group">
											<label htmlFor="nombre">Nombre</label>
											<input
												type="text"
												id="nombre"
												name="nombre"
												value={formData.nombre}
												onChange={handleInputChange}
												required
												placeholder="Ej: Sucursal Centro"
											/>
										</div>

										<div className="form-group">
											<label htmlFor="telefono">Teléfono</label>
											<input
												type="text"
												id="telefono"
												name="telefono"
												value={formData.telefono}
												onChange={handleInputChange}
												required
												placeholder="Ej: (477) 123-4567"
											/>
										</div>
									</div>

									<div className="form-group">
										<label htmlFor="direccion">Dirección</label>
										<input
											type="text"
											id="direccion"
											name="direccion"
											value={formData.direccion}
											onChange={handleInputChange}
											required
											placeholder="Ej: Av. Principal 123, Centro"
										/>
									</div>

									<div className="form-row">
										<div className="form-group">
											<label htmlFor="latitud">Latitud</label>
											<input
												type="number"
												step="any"
												id="latitud"
												name="latitud"
												value={formData.latitud}
												onChange={handleInputChange}
												required
												placeholder="Ej: 21.1219"
											/>
										</div>

										<div className="form-group">
											<label htmlFor="longitud">Longitud</label>
											<input
												type="number"
												step="any"
												id="longitud"
												name="longitud"
												value={formData.longitud}
												onChange={handleInputChange}
												required
												placeholder="Ej: -101.6827"
											/>
										</div>

										<div className="form-group">
											<label htmlFor="horario_apertura">Horario de Apertura</label>
											<input
												type="time"
												id="horario_apertura"
												name="horario_apertura"
												value={formData.horario_apertura}
												onChange={handleInputChange}
												required
											/>
										</div>
									</div>

									<div className="form-actions">
										<button type="button" className="btn-cancelar" onClick={handleCancelar}>
											Cancelar
										</button>
										<button type="submit" className="btn-guardar">
											Guardar Sucursal
										</button>
									</div>
								</form>
							</div>
						)}

						<div className="sucursales-lista">
							<h2 className="lista-title">Lista de Sucursales</h2>
							<p className="lista-total">Total: {sucursales.length} sucursales</p>

							<div className="table-header">
								<div>NOMBRE</div>
								<div>DIRECCIÓN</div>
								<div>COORDENADAS</div>
								<div>TELÉFONO</div>
								<div>HORARIO APERTURA</div>
							</div>

							<div className="sucursales-items">
								{sucursales.map((sucursal, index) => (
									<div key={index} className="sucursal-item">
										<div className="sucursal-nombre-col">
											<div className="sucursal-avatar">
												{sucursal.nombre.charAt(0)}
											</div>
											<div className="sucursal-nombre-text">
												{sucursal.nombre}
											</div>
										</div>
										<div className="sucursal-direccion">
											{sucursal.direccion}
										</div>
										<div className="sucursal-coordenadas">
											{sucursal.latitud}, {sucursal.longitud}
										</div>
										<div className="sucursal-telefono">
											{sucursal.telefono}
										</div>
										<div>
											<span className="horario-badge">
												{sucursal.horario_apertura}
											</span>
										</div>
									</div>
								))}
							</div>

							{sucursales.length === 0 && (
								<div className="no-results">
									No se encontraron sucursales
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	)
}
