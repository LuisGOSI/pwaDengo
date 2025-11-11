import './Promociones.css'
import Sidebar from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../context/SidebarContext';
import { Outlet } from 'react-router-dom';

export const Promociones = () => {
    const { isOpen } = useSidebar();

    return (
        <main className={`main-content ${!isOpen ? 'sidebar-closed' : ''}`}>
            <div className="promociones-container">
                <Sidebar />
                <div className="promociones-header">
                    <div className="promociones-header-left">
                        <h1 className="promociones-titulo">Catálogo de Promociones</h1>
                        <p className="promociones-breadcrumb">Marketing | Promociones</p>
                    </div>
                    <button className="btn-nueva-promocion">
                        <span className="btn-icono">+</span>
                        Nueva Promoción
                    </button>
                </div>

                {/* Filtros */}
                <div className="promociones-filtros">
                    <div className="filtros-grid">
                        <div className="filtro-group">
                            <label>Buscar</label>
                            <input
                                type="text"
                                className="filtro-input"
                                placeholder="Buscar promoción..."
                            />
                        </div>
                        <div className="filtro-group">
                            <label>Tipo</label>
                            <select className="filtro-select">
                                <option value="">Todos</option>
                                <option value="descuento">Descuento</option>
                                <option value="2x1">2x1</option>
                                <option value="combo">Combo</option>
                                <option value="especial">Especial</option>
                            </select>
                        </div>
                        <div className="filtro-group">
                            <label>Estado</label>
                            <select className="filtro-select">
                                <option value="">Todos</option>
                                <option value="activa">Activa</option>
                                <option value="programada">Programada</option>
                                <option value="finalizada">Finalizada</option>
                            </select>
                        </div>
                        <div className="filtro-group">
                            <label>Sucursal</label>
                            <select className="filtro-select">
                                <option value="">Todas</option>
                                <option value="centro">Centro</option>
                                <option value="norte">Norte</option>
                                <option value="sur">Sur</option>
                            </select>
                        </div>
                    </div>
                    <button className="btn-filtrar">Filtrar</button>
                </div>

                {/* Lista de Promociones */}
                <div className="promociones-lista">
                    <div className="lista-header">
                        <h2 className="lista-titulo">Lista de Promociones</h2>
                        <p className="lista-subtitulo">Total: 12 promociones</p>
                    </div>

                    <div className="tabla-container">
                        <table className="promociones-tabla">
                            <thead>
                                <tr>
                                    <th>PROMOCIÓN</th>
                                    <th>TIPO</th>
                                    <th>SUCURSAL</th>
                                    <th>DESCUENTO</th>
                                    <th>VIGENCIA</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="promocion-info">
                                            <div className="promocion-avatar">2X1</div>
                                            <div className="promocion-datos">
                                                <p className="promocion-nombre">Café del Día</p>
                                                <p className="promocion-descripcion">2x1 en café americano</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="tipo-badge tipo-2x1">2x1</span>
                                    </td>
                                    <td>
                                        <span className="promocion-sucursal">Todas</span>
                                    </td>
                                    <td>
                                        <span className="promocion-descuento">50%</span>
                                    </td>
                                    <td>
                                        <span className="promocion-vigencia">01/11 - 30/11</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="promocion-info">
                                            <div className="promocion-avatar">DM</div>
                                            <div className="promocion-datos">
                                                <p className="promocion-nombre">Desayuno Mañanero</p>
                                                <p className="promocion-descripcion">Combo desayuno + bebida</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="tipo-badge tipo-combo">Combo</span>
                                    </td>
                                    <td>
                                        <span className="promocion-sucursal">Centro</span>
                                    </td>
                                    <td>
                                        <span className="promocion-descuento">25%</span>
                                    </td>
                                    <td>
                                        <span className="promocion-vigencia">01/11 - 15/11</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="promocion-info">
                                            <div className="promocion-avatar">HF</div>
                                            <div className="promocion-datos">
                                                <p className="promocion-nombre">Happy Friday</p>
                                                <p className="promocion-descripcion">Descuento en postres</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="tipo-badge tipo-descuento">Descuento</span>
                                    </td>
                                    <td>
                                        <span className="promocion-sucursal">Norte</span>
                                    </td>
                                    <td>
                                        <span className="promocion-descuento">30%</span>
                                    </td>
                                    <td>
                                        <span className="promocion-vigencia">Viernes</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="promocion-info">
                                            <div className="promocion-avatar">ME</div>
                                            <div className="promocion-datos">
                                                <p className="promocion-nombre">Menú Ejecutivo</p>
                                                <p className="promocion-descripcion">Comida completa mediodía</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="tipo-badge tipo-especial">Especial</span>
                                    </td>
                                    <td>
                                        <span className="promocion-sucursal">Centro</span>
                                    </td>
                                    <td>
                                        <span className="promocion-descuento">20%</span>
                                    </td>
                                    <td>
                                        <span className="promocion-vigencia">Lun-Vie</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="promocion-info">
                                            <div className="promocion-avatar">CB</div>
                                            <div className="promocion-datos">
                                                <p className="promocion-nombre">Café + Brownie</p>
                                                <p className="promocion-descripcion">Combo especial tarde</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="tipo-badge tipo-combo">Combo</span>
                                    </td>
                                    <td>
                                        <span className="promocion-sucursal">Sur</span>
                                    </td>
                                    <td>
                                        <span className="promocion-descuento">15%</span>
                                    </td>
                                    <td>
                                        <span className="promocion-vigencia">Todo el mes</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="promocion-info">
                                            <div className="promocion-avatar">NS</div>
                                            <div className="promocion-datos">
                                                <p className="promocion-nombre">Noche Especial</p>
                                                <p className="promocion-descripcion">Cena + postre gratis</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="tipo-badge tipo-especial">Especial</span>
                                    </td>
                                    <td>
                                        <span className="promocion-sucursal">Todas</span>
                                    </td>
                                    <td>
                                        <span className="promocion-descuento">40%</span>
                                    </td>
                                    <td>
                                        <span className="promocion-vigencia">Sábados</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Outlet />
        </main>
    );
}