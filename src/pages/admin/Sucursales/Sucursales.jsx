import { useState, useEffect } from 'react'
import { Footer } from "../../../components/layout/Footer.jsx"
import Header from '../../../components/layout/Header.jsx'
import "./Sucursales.css"

export const Sucursales = () => {
	const [mostrarFormulario, setMostrarFormulario] = useState(false)
	const [editando, setEditando] = useState(null)
	const [formData, setFormData] = useState({
		nombre: '',
		direccion: '',
		latitud: '',
		longitud: '',
		telefono: '',
		horario_apertura: ''
	})

	const [sucursales, setSucursales] = useState([])

	const API_URL = 'http://localhost:3000/api/sucursales'

	useEffect(() => {
		cargarSucursales()
	}, [])

	const cargarSucursales = async () => {
		try {
			const response = await fetch(API_URL)
			const result = await response.json()
			
			if (result.success) {
				setSucursales(result.data)
			}
		} catch (err) {
			console.error('Error al cargar sucursales:', err)
		}
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target
		setFormData({
			...formData,
			[name]: value
		})
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		try {
			const url = editando ? `${API_URL}/${editando}` : API_URL
			const method = editando ? 'PUT' : 'POST'

			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					...formData,
					latitud: parseFloat(formData.latitud),
					longitud: parseFloat(formData.longitud)
				})
			})

			const result = await response.json()

			if (result.success) {
				await cargarSucursales()
				resetForm()
			}
		} catch (err) {
			console.error('Error al guardar sucursal:', err)
		}
	}

	const handleEditar = (sucursal) => {
		setEditando(sucursal.id)
		setFormData({
			nombre: sucursal.nombre,
			direccion: sucursal.direccion || '',
			latitud: sucursal.latitud || '',
			longitud: sucursal.longitud || '',
			telefono: sucursal.telefono || '',
			horario_apertura: sucursal.horario_apertura || ''
		})
		setMostrarFormulario(true)
	}

	const handleToggleActiva = async (id, activaActual) => {
		try {
			const response = await fetch(`${API_URL}/activa/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ activa: !activaActual })
			})

			const result = await response.json()

			if (result.success) {
				await cargarSucursales()
			}
		} catch (err) {
			console.error('Error al cambiar estado:', err)
		}
	}

	const resetForm = () => {
		setFormData({
			nombre: '',
			direccion: '',
			latitud: '',
			longitud: '',
			telefono: '',
			horario_apertura: ''
		})
		setMostrarFormulario(false)
		setEditando(null)
	}

	const handleCancelar = () => {
		resetForm()
	}

	return (
		<div>
			<div className="sucursales-container">
				<div className="sucursales-content">
					<div className="sucursales-card">
						<div className="sucursales-header">
							<div>
								<h1 className="sucursales-title">Catálogo de Sucursales</h1>
							</div>
							<button
								className="btn-nuevo-evento"
								onClick={() => {
									if (!mostrarFormulario) {
										resetForm()
									}
									setMostrarFormulario(!mostrarFormulario)
								}}
							>
								<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
								</svg>
								Nueva Sucursal
							</button>
						</div>

						{mostrarFormulario && (
							<div className="formulario-container">
								<h3 className="formulario-title">
									{editando ? 'Editar Sucursal' : 'Nueva Sucursal'}
								</h3>
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
											{editando ? 'Actualizar Sucursal' : 'Guardar Sucursal'}
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
								<div>ACCIONES</div>
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
										<div className="sucursal-acciones">
											<button
												onClick={() => handleEditar(sucursal)}
												className="btn-accion btn-editar"
												title="Editar"
											>
												<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
												</svg>
											</button>
											<button
												onClick={() => handleToggleActiva(sucursal.id, sucursal.activa)}
												className={`btn-accion ${sucursal.activa ? 'btn-desactivar' : 'btn-activar'}`}
												title={sucursal.activa ? 'Desactivar' : 'Activar'}
											>
												{sucursal.activa ? (
													<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
													</svg>
												) : (
													<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
													</svg>
												)}
											</button>
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