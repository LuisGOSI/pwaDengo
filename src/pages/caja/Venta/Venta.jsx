import "./Venta.css";
import { useState, useEffect } from "react";
import { useAPI } from "../../../utils/UseAPI";
import { useForm } from "../../../utils/UseForm";
import { conf } from "../../../conf";
import { CustomButton, CustomInput, Form, InputOption, Label } from "../../../components/common/Form";
import { useAuth } from "../../../services/AuthContext";
import Modal from "../../../components/common/Modal";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useToast } from "../../../context/MensajeContext";
import Sidebar from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../context/SidebarContext';
import { Outlet } from 'react-router-dom';

// Inicializar Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_your_key_here');

// Componente de formulario de pago con Stripe
const StripePaymentForm = ({ onSuccess, onError, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Trigger form validation and wallet collection
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMessage(submitError.message);
        onError?.(submitError.message);
        return;
      }

      // Confirmar el pago usando el clientSecret que ya tenemos
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/venta-completada',
        },
        redirect: 'if_required'
      });

      if (error) {
        setErrorMessage(error.message);
        onError?.(`Error en el pago: ${error.message}`);
        return;
      }

      // Verificar que el pago se completó exitosamente
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess?.();
      } else {
        setErrorMessage('El pago no se completó correctamente');
        onError?.('El pago no se completó correctamente');
      }
    } catch (err) {
      setErrorMessage('Error procesando el pago');
      onError?.('Error procesando el pago');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button
          type="submit"
          disabled={!stripe || !elements || isProcessing}
          className="btn-guardar"
          style={{ flex: 1 }}
        >
          {isProcessing ? 'Procesando...' : 'Pagar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-limpiar"
          style={{ flex: 1 }}
        >
          Cancelar
        </button>
      </div>
      {errorMessage && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          {errorMessage}
        </div>
      )}
    </form>
  );
};

export const Venta = () => {
  const { get, post } = useAPI(`${conf.BACKEND_URL}/api/`);
  const { showToast } = useToast();

  // Productos cargados desde la API
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const { user } = useAuth();
  const [fetchedUser, setFetchedUser] = useState(null);

  // Carrito de venta
  const [carrito, setCarrito] = useState([]);

  // Input para agregar por ID
  const [productoIdInput, setProductoIdInput] = useState("");

  // Hook de formulario con tu useForm
  const { formData, handleInputChange, resetForm, setFormData } = useForm({
    metodo_pago: "tarjeta",
    monto_pagado: "",
    puntos_usados: 0,
    descuento_aplicado: 0,
    notas: "",
  });

  // Cargar productos al iniciar
  const loadProductos = () => {
    get("productos").then((res) => {
      setProductosDisponibles(res.data);
    });
  };

  useEffect(() => {
    loadProductos();
  }, []);

  useEffect(() => {
    if (user) {
      get(`usuarios/${user.id}`)
        .then((res) => {
          setFetchedUser(res.data);
        })
        .catch((err) => console.error(err));
    }
  }, [user]);

  // Agregar producto al carrito
  const agregarProductoAlCarrito = (producto) => {
    const item = {
      ...producto,
      timestamp: Date.now(),
    };
    setCarrito((prev) => [...prev, item]);
  };

  // Buscar y agregar producto por ID
  const agregarPorId = () => {
    if (!productoIdInput.trim()) {
      showToast('warning', 'Campo requerido', 'Ingresa un ID de producto');
      return;
    }

    const producto = productosDisponibles.find(
      (p) => p.id.toString() === productoIdInput.trim()
    );

    if (!producto) {
      showToast('error', 'Producto no encontrado', 'No se encontró un producto con ese ID');
      return;
    }

    agregarProductoAlCarrito(producto);
    setProductoIdInput("");
    showToast('success', 'Producto agregado', `${producto.nombre} agregado al carrito`);
  };

  // Eliminar producto del carrito
  const eliminarDelCarrito = (timestamp) => {
    setCarrito(carrito.filter((item) => item.timestamp !== timestamp));
  };

  // Calcular total
  const montoTotalCarrito = carrito.reduce(
    (total, item) => total + item.precio,
    0
  );

  // Registrar venta en el backend
  const registrarVenta = async () => {
    const ventaData = {
      ...formData,
      items: carrito.map((p) => ({
        producto_id: p.id,
        precio_unitario: p.precio,
        cantidad: carrito.filter(item => item.id === p.id).length,
      })),
      total: montoTotalCarrito,
      sucursal_id: fetchedUser ? fetchedUser.sucursal_personal_id : null,
    };

    try {
      const res = await post("ventas/registrar-venta", ventaData);
      const total = res.venta.total;
      console.log('Venta registrada:', total);
      // Clear form and carrito
      resetForm();
      setCarrito([]);

      showToast('success', 'Venta registrada', 'La venta se ha procesado exitosamente');

      const qrRes = await post("puntos", { total });
      const { qrImage } = qrRes;

      const html = `
            <div style="text-align: center; padding: 20px;">
              <h2 style="color: #10b981; margin-bottom: 20px;">Venta Completada</h2>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p style="font-size: 18px; margin: 10px 0;"><strong>Total:</strong> $${total.toFixed(2)}</p>
                <p style="font-size: 16px; margin: 10px 0;"><strong>Método:</strong> ${formData.metodo_pago}</p>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center; margin-top: 20px;">
                <img src="${qrImage}" alt="QR Code" style="max-width: 200px; border: 2px solid #e5e7eb; border-radius: 10px;" />
              </div>
              <p style="color: #6b7280; font-size: 14px;">Escanea el código QR para reclamar tus puntos.</p>
            </div>
          `;

      setHtmlContent(html);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error registrando venta:', error);
      showToast('error', 'Error en la venta', 'No se pudo registrar la venta. Intenta nuevamente.');
    }
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // Esta función ahora solo maneja la validación y delega según el método de pago
    handleConfirmPayment();
  };

  const handleDescuentoChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    if (value < 0) {
      setInputErrors(prev => ({
        ...prev,
        descuento_aplicado: "El descuento no puede ser negativo"
      }));
      showToast('warning', 'Descuento inválido', 'El descuento no puede ser un valor negativo');
      return;
    }
    if (value > montoTotalCarrito) {
      setInputErrors(prev => ({
        ...prev,
        descuento_aplicado: "El descuento no puede ser mayor al total"
      }));
      showToast('warning', 'Descuento inválido', 'El descuento no puede ser mayor al total del carrito');
      return;
    }
    // Limpiar error si el valor es válido
    setInputErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.descuento_aplicado;
      return newErrors;
    });
    setFormData((prev) => ({
      ...prev,
      descuento_aplicado: value,
      monto_pagado: Math.max(0, montoTotalCarrito - value),
    }));
  }

  // Actualizar el monto pagado cada vez que cambie el carrito
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      monto_pagado: montoTotalCarrito - prev.descuento_aplicado,
    }));
  }, [carrito]);

  useEffect(() => {
    handleDescuentoChange({ target: { value: formData.descuento_aplicado } });
  }, [formData.descuento_aplicado]);

  const handleStripeSuccess = () => {
    // Procesar la venta después del pago exitoso
    setStripeModalOpen(false);
    showToast('success', 'Pago aprobado', 'El pago con tarjeta fue procesado correctamente');
    registrarVenta();
  };

  const handleStripeError = (error) => {
    console.error('Error en pago Stripe:', error);
    showToast('error', 'Error en el pago', error || 'Ocurrió un error procesando el pago con tarjeta');
  };

  const handleStripeCancel = () => {
    setStripeModalOpen(false);
    setClientSecret(null);
    setStripeOptions(null);
  };

  const handleConfirmPayment = async () => {
    // Validaciones iniciales
    if (carrito.length === 0) {
      showToast('warning', 'Carrito vacío', 'Agrega productos al carrito antes de continuar');
      return;
    }

    if (!formData.monto_pagado) {
      showToast('warning', 'Camposd requeridos', 'Verifica el monto a pagar');
      return;
    }

    if (formData.monto_pagado <= 0) {
      showToast('error', 'Monto inválido', 'El monto a pagar debe ser mayor a cero');
      return;
    }

    if (formData.metodo_pago === 'tarjeta') {
      // Crear payment intent para Stripe
      try {
        showToast('success', 'Iniciando pago', 'Preparando el proceso de pago con tarjeta...');

        const response = await post('stripe/create-payment-intent', {
          amount: Math.round(formData.monto_pagado * 100), // Convertir a centavos
          currency: 'mxn'
        });

        if (!response.clientSecret) {
          throw new Error('No se recibió clientSecret del servidor');
        }

        setClientSecret(response.clientSecret);
        setStripeOptions({
          appearance: {
            theme: 'stripe'
          }
        });
        setStripeModalOpen(true);
      } catch (error) {
        console.error('Error creando payment intent:', error);
        showToast('error', 'Error de pago', 'No se pudo inicializar el pago con tarjeta. Intenta nuevamente.');
        return;
      }
    } else {
      // Para efectivo y transferencia, registrar directamente
      registrarVenta();
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  const [inputErrors, setInputErrors] = useState({});
  const [stripeModalOpen, setStripeModalOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [stripeOptions, setStripeOptions] = useState(null);

  const inputs = [
    new CustomInput("metodo_pago", "metodo_pago", "select", "Método de Pago", formData.metodo_pago, handleInputChange, "", [
      new InputOption("tarjeta", "Tarjeta"),
      new InputOption("efectivo", "Efectivo"),
    ], "formulario-select"),
    new CustomInput("puntos_usados", "puntos_usados", "number", "Puntos Usados", formData.puntos_usados, handleInputChange, "", [], "formulario-input"),
    new CustomInput(
      "descuento_aplicado",
      "descuento_aplicado",
      "number",
      "Descuento",
      formData.descuento_aplicado,
      handleDescuentoChange,
      "",
      [],
      "formulario-input",
      {},
      false,
      new Label(),
      inputErrors.descuento_aplicado ? new Label(inputErrors.descuento_aplicado, "descuento_aplicado", true) : null
    ),
    new CustomInput("notas", "notas", "textarea", "Notas", formData.notas, handleInputChange, "", [], "formulario-textarea"),
    new CustomInput("monto_pagado", "monto_pagado", "number", "Monto Pagado *", formData.monto_pagado, handleInputChange, "", [], "formulario-input", {}, true),
  ];

  const submitButtonText = formData.metodo_pago === 'tarjeta' ? 'Proceder al Pago' : 'Guardar Venta';
  const submitButton = new CustomButton("submit_venta", submitButtonText, handleConfirmPayment, "btn-guardar", {}, "button");
  const resetButton = new CustomButton("reset_venta", "Limpiar", () => {
    resetForm();
    setCarrito([]);
  }, "btn-limpiar", {}, "button");
  const { isOpen } = useSidebar();

  return (
    <main className={`main-content ${!isOpen ? 'sidebar-closed' : ''}`}>
    <div className="ventas-container">
      <Sidebar />
      <Modal title="Resumen de Venta" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
      </Modal>
      <header className="ventas-header">
        <div className="ventas-header-left">
          <h1 className="ventas-titulo">Módulo de Ventas</h1>
          <p className="ventas-breadcrumb">Gestión | Registros de Ventas</p>
        </div>
        <button
          className="btn-nueva-venta"
          onClick={() =>
            document
              .getElementById("formulario")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <span className="btn-icono">+</span>
          Nueva Venta
        </button>
      </header>

      <div className="ventas-layout-principal">
        {/* ------------------- LISTA DE PRODUCTOS ------------------- */}
        <section className="ventas-productos">
          <div className="productos-contenedor">
            <h2 className="productos-titulo">Seleccionar Productos</h2>

            <div className="productos-input-seccion">
              <h3 className="input-titulo">Agregar por ID de Producto</h3>
              <div className="producto-input-group">
                <input
                  type="text"
                  value={productoIdInput}
                  onChange={(e) => setProductoIdInput(e.target.value)}
                  placeholder="Ej: 101"
                  className="formulario-input"
                  onKeyPress={(e) => e.key === "Enter" && agregarPorId()}
                />
                <button className="btn-agregar-id" onClick={agregarPorId}>
                  Agregar
                </button>
              </div>
            </div>

            <div className="productos-grid">
              {productosDisponibles.map((producto) => (
                <div key={producto.id} className="producto-card">
                  <div className="producto-header">
                    <span className="producto-categoria">
                      {producto.categoria_id}
                    </span>
                    <span className="producto-precio">
                      ${producto.precio.toFixed(2)}
                    </span>
                  </div>

                  <h3 className="producto-nombre">{producto.nombre}</h3>
                  <p className="producto-id">{producto.id}</p>

                  <button
                    className="btn-agregar-producto"
                    onClick={() => agregarProductoAlCarrito(producto)}
                  >
                    Agregar al Carrito
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------- FORMULARIO DE VENTA ------------------- */}
        <div className="ventas-columna-derecha">
          <section className="ventas-formulario" id="formulario">
            <div className="formulario-contenedor">
              <h2 className="formulario-titulo">Registrar Nueva Venta</h2>
              <Form onSubmit={handleSubmit} inputs={inputs} submitButton={submitButton} resetButton={resetButton} className="formulario-grid" />
            </div>
          </section>

          {/* ------------------- CARRITO ------------------- */}
          <section className="ventas-carrito">
            <div className="carrito-contenedor">
              <h2 className="carrito-titulo">Carrito</h2>

              {carrito.length === 0 ? (
                <p className="carrito-vacio">El carrito está vacío</p>
              ) : (
                <div>
                  {carrito.map((item) => (
                    <div key={item.timestamp} className="carrito-item">
                      <div>
                        <p className="carrito-item-nombre">{item.nombre}</p>
                        <p>${item.precio}</p>
                      </div>

                      <button
                        className="btn-eliminar-item"
                        onClick={() => eliminarDelCarrito(item.timestamp)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <div className="carrito-total">
                    <p>Total:</p>
                    <p>${montoTotalCarrito.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <Modal
        title="Procesamiento de Pago"
        isOpen={stripeModalOpen}
        onClose={handleStripeCancel}
      >
        {clientSecret && stripeOptions && (
          <Elements
            stripe={stripePromise}
            options={{
              ...stripeOptions,
              clientSecret: clientSecret
            }}
          >
            <StripePaymentForm
              onSuccess={handleStripeSuccess}
              onError={handleStripeError}
              onCancel={handleStripeCancel}
            />
          </Elements>
        )}
      </Modal>
    </div>
    <Outlet />
    </main>
  );
};