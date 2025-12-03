import "./Venta.css";
import React, { useState, useEffect } from "react";
import { useAPI } from "../../../utils/UseAPI";
import { useForm } from "../../../utils/UseForm";
import { conf } from "../../../conf";
import { Form, createCustomInput, createInputOption, createCustomButton, createLabel } from "../../../components/common/Form";
import type { CustomInput, ValidationResult } from "../../../components/common/Form";
import { useAuth } from "../../../services/AuthContext";
import Modal from "../../../components/common/Modal";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useToast } from "../../../context/MensajeContext";

// ----- SIDEBAR -----
import Sidebar from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../context/SidebarContext';
import { Outlet } from 'react-router-dom';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria_id: string;
  timestamp?: number;
}

interface ItemCarrito extends Producto {
  timestamp: number;
}

interface VentaFormData {
  metodo_pago: string;
  monto_pagado: string | number;
  puntos_usados: number;
  descuento_aplicado: number;
  notas: string;
}

interface StripePaymentFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onCancel: () => void;
}

const stripePromise = loadStripe((import.meta as any).env?.VITE_STRIPE_PUBLIC_KEY || 'pk_test_your_key_here');

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ onSuccess, onError, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
        setErrorMessage(submitError.message || 'Error en el formulario');
        onError?.(submitError.message || 'Error en el formulario');
        return;
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/venta-completada',
        },
        redirect: 'if_required'
      });

      if (error) {
        setErrorMessage(error.message || 'Error desconocido');
        onError?.(`Error en el pago: ${error.message || 'Error desconocido'}`);
        return;
      }

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

export const Venta: React.FC = () => {

  const { isOpen } = useSidebar();

  const { get, post } = useAPI(`${conf.BACKEND_URL}/api/`);
  const { showToast } = useToast();

  const [productosDisponibles, setProductosDisponibles] = useState<Producto[]>([]);
  const { user } = useAuth();
  const [fetchedUser, setFetchedUser] = useState<any>(null);

  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);

  const [productoIdInput, setProductoIdInput] = useState<string>("");

  const { formData, handleInputChange, resetForm, setFormData } = useForm({
    metodo_pago: "tarjeta",
    monto_pagado: "",
    puntos_usados: 0,
    descuento_aplicado: 0,
    notas: "",
  });

  const typedFormData = formData as VentaFormData;

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

  const agregarProductoAlCarrito = (producto: Producto): void => {
    const item: ItemCarrito = {
      ...producto,
      timestamp: Date.now(),
    };
    setCarrito((prev) => [...prev, item]);
  };

  const agregarPorId = async () => {
    if (!productoIdInput.trim()) {
      showToast('warning', 'Campo requerido', 'Ingresa un ID de producto');
      return;
    }

    const response = await get(`productos/${productoIdInput.trim()}`);

    if (!response.success) {
      showToast('error', 'Producto no encontrado', 'No se encontró un producto con ese ID');
      return;
    }

    const producto = response.data as Producto;

    if (!producto) {
      showToast('error', 'Producto no encontrado', 'No se encontró un producto con ese ID');
      return;
    }

    agregarProductoAlCarrito(producto);
    setProductoIdInput("");
    showToast('success', 'Producto agregado', `${producto.nombre} agregado al carrito`);
  };

  const eliminarDelCarrito = (timestamp: number): void => {
    setCarrito(carrito.filter((item) => item.timestamp !== timestamp));
  };

  const montoTotalCarrito = carrito.reduce(
    (total, item) => total + item.precio,
    0
  );

  const registrarVenta = async () => {
    const ventaData = {
      ...typedFormData,
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
                <p style="font-size: 16px; margin: 10px 0;"><strong>Método:</strong> ${typedFormData.metodo_pago}</p>
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

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    handleConfirmPayment();
  };

  const handleDescuentoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const value = parseFloat(e.target.value) || 0;

    setFormData((prev) => ({
      ...prev,
      descuento_aplicado: value,
      monto_pagado: Math.max(0, montoTotalCarrito - value),
    }));
  }

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      monto_pagado: montoTotalCarrito - (prev as VentaFormData).descuento_aplicado,
    }));
  }, [carrito]);

  useEffect(() => {
    const descuento = Number(typedFormData.descuento_aplicado) || 0;
    setFormData((prev) => ({
      ...prev,
      monto_pagado: Math.max(0, montoTotalCarrito - descuento),
    }));
  }, [typedFormData.descuento_aplicado, montoTotalCarrito, setFormData]);

  useEffect(() => {
    validateAllInputs();
  }, [typedFormData, carrito, montoTotalCarrito]);

  const handleStripeSuccess = () => {
    setStripeModalOpen(false);
    showToast('success', 'Pago aprobado', 'El pago con tarjeta fue procesado correctamente');
    registrarVenta();
  };

  const handleStripeError = (error: string) => {
    console.error('Error en pago Stripe:', error);
    showToast('error', 'Error en el pago', error || 'Ocurrió un error procesando el pago con tarjeta');
  };

  const handleStripeCancel = () => {
    setStripeModalOpen(false);
    setClientSecret(null);
    setStripeOptions(null);
  };

  const handleConfirmPayment = async () => {
    if (!isFormValid || !validateAllInputs()) {
      const errorMessages = Object.values(validationErrors);
      showToast('error', 'Formulario inválido', errorMessages[0] || 'Corrige los errores antes de continuar');
      return;
    }

    if (typedFormData.metodo_pago === 'tarjeta') {
      try {
        showToast('success', 'Iniciando pago', 'Preparando el proceso de pago con tarjeta...');

        const response = await post('stripe/create-payment-intent', {
          amount: Math.round(Number(typedFormData.monto_pagado) * 100), // Convertir a centavos
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
      // For other payment methods, directly register the sale
      registrarVenta();
    }
  }

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [inputErrors, setInputErrors] = useState<Record<string, string>>({});
  const [stripeModalOpen, setStripeModalOpen] = useState<boolean>(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripeOptions, setStripeOptions] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  // Function to validate the entire form
  const validateAllInputs = () => {
    const errors: Record<string, string> = {};

    // Validate discount
    const descuentoValidation = validateDescuento(typedFormData.descuento_aplicado);
    if (!descuentoValidation.isValid) {
      errors.descuento_aplicado = descuentoValidation.message;
    }

    // Validate amount paid
    const montoValidation = validateMontoPagado(typedFormData.monto_pagado);
    if (!montoValidation.isValid) {
      errors.monto_pagado = montoValidation.message;
    }

    // Additional business validations
    if (carrito.length === 0) {
      errors.carrito = "Debe agregar al menos un producto al carrito";
    }

    if (!typedFormData.monto_pagado || Number(typedFormData.monto_pagado) <= 0) {
      errors.monto_pagado = "El monto debe ser mayor a cero";
    }

    setValidationErrors(errors);
    const formIsValid = Object.keys(errors).length === 0;
    setIsFormValid(formIsValid);

    return formIsValid;
  };

  // Validators
  const validateDescuento = (value: any): ValidationResult => {
    const numValue = parseFloat(value) || 0;
    if (numValue < 0) {
      return { isValid: false, message: "El descuento no puede ser negativo" };
    }
    if (numValue > montoTotalCarrito) {
      return { isValid: false, message: "El descuento no puede ser mayor al total" };
    }
    return { isValid: true, message: "" };
  };

  const validateMontoPagado = (value: any): ValidationResult => {
    const numValue = parseFloat(value) || 0;
    if (numValue <= 0) {
      return { isValid: false, message: "El monto debe ser mayor a cero" };
    }
    return { isValid: true, message: "" };
  };

  const inputs: CustomInput[] = [
    createCustomInput(
      "metodo_pago",
      "Método de Pago",
      typedFormData.metodo_pago,
      handleInputChange,
      {
        type: "select",
        options: [
          createInputOption("tarjeta", "Tarjeta"),
          createInputOption("efectivo", "Efectivo"),
        ],
        className: "formulario-select"
      }
    ),
    createCustomInput(
      "descuento_aplicado",
      "Descuento",
      typedFormData.descuento_aplicado,
      handleDescuentoChange,
      {
        type: "number",
        className: "formulario-input",
        placeholder: "0.00",
        validator: validateDescuento,
      }
    ),
    createCustomInput(
      "notas",
      "Notas",
      typedFormData.notas,
      handleInputChange,
      {
        type: "textarea",
        className: "formulario-textarea",
        placeholder: "Observaciones adicionales...",
        rows: 3
      }
    ),
    createCustomInput(
      "monto_pagado",
      "Monto Pagado *",
      typedFormData.monto_pagado,
      handleInputChange,
      {
        type: "number",
        className: "formulario-input",
        disabled: true,
        validator: validateMontoPagado
      }
    ),
  ];

  const submitButtonText = typedFormData.metodo_pago === 'tarjeta' ? 'Proceder al Pago' : 'Guardar Venta';
  const submitButton = createCustomButton(
    submitButtonText,
    handleConfirmPayment,
    {
      id: "submit_venta",
      className: `btn-guardar ${!isFormValid ? 'disabled' : ''}`,
      type: "button",
      disabled: !isFormValid,
      style: {
        opacity: isFormValid ? 1 : 0.6,
        cursor: isFormValid ? 'pointer' : 'not-allowed'
      }
    }
  );

  const resetButton = createCustomButton(
    "Limpiar",
    () => {
      resetForm();
      setCarrito([]);
      setValidationErrors({});
      setIsFormValid(false);
    },
    {
      id: "reset_venta",
      className: "btn-limpiar",
      type: "button"
    }
  );

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

                {/* Mostrar estado de validación */}
                {Object.keys(validationErrors).length > 0 && (
                  <div style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '6px',
                    padding: '12px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ color: '#dc2626', fontSize: '14px', fontWeight: '600' }}>
                      Corrige los siguientes errores:
                    </div>
                    <ul style={{ margin: '8px 0 0 20px', color: '#dc2626', fontSize: '13px' }}>
                      {Object.entries(validationErrors).map(([field, error]) => (
                        <li key={field}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

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
