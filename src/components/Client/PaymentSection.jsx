import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FadeIn } from "../Shared/reactbits/index.js";
import { useAppContext } from "../../context/AppContext.jsx";
import { useClientAuth } from "../../context/UnifiedAuthContext.jsx";
import { mercadoPagoService } from "../../services/mercadoPagoService.js";
import { bundleService } from "../../services/bundleService.js";
import { validateCheckoutForm } from "../../utils/validation.js";
import logger from "../../utils/logger.js";

function PaymentSection({ routine }) {
  const navigate = useNavigate();
  const { dispatch } = useAppContext();
  const { user, profile } = useClientAuth();

  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: "",
    lastName: "",
  });
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isBundle, setIsBundle] = useState(false);
  const [bundleInfo, setBundleInfo] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const formatWeeks = (value) => {
    if (!value && value !== 0) return "—";
    const parsed = Number(value);
    if (!Number.isNaN(parsed) && parsed > 0) {
      return `${parsed} ${parsed === 1 ? "semana" : "semanas"}`;
    }
    return value;
  };

  const formatFrequency = (value) => {
    if (!value && value !== 0) return "—";
    const parsed = Number(value);
    if (!Number.isNaN(parsed) && parsed > 0) {
      return `${parsed} sesiones semanales`;
    }
    return value;
  };

  const plan = useMemo(
    () =>
      routine
        ? {
            id: `routine-${routine.id}`,
            name: routine.name,
            price: routine.price,
          }
        : null,
    [routine],
  );

  // Detectar si es bundle al montar el componente
  useEffect(() => {
    const checkIfBundle = async () => {
      if (!routine) return;

      try {
        const isBundleProduct = await bundleService.isBundleProduct(routine.id);
        setIsBundle(isBundleProduct);

        if (isBundleProduct) {
          const info = await bundleService.getBundleInfo(routine.id);
          setBundleInfo(info);
          logger.info('Bundle detected', { bundleId: routine.id, products: info.products.length });
        }
      } catch (error) {
        logger.error('Error checking bundle', error);
      }
    };

    checkIfBundle();
  }, [routine]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error de validación al escribir
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!routine || !plan) return;

    // Validar formulario
    const validation = validateCheckoutForm(formData);
    if (!validation.valid) {
      setValidationErrors(validation.errors);
      setError('Por favor completa todos los campos correctamente');
      return;
    }

    // Verificar que el usuario esté logueado
    if (!user || !profile) {
      logger.info('User not logged in, redirecting to login');
      localStorage.setItem('pending_purchase', JSON.stringify(routine));
      navigate('/login');
      return;
    }

    setProcessing(true);
    setError("");
    setValidationErrors({});

    const timer = logger.createTimer('create_mp_preference');

    try {
      logger.info('Creating Mercado Pago preference', {
        routineId: routine.id,
        isBundle,
        userEmail: user.email
      });

      // Crear preferencia de pago en Mercado Pago
      const { preferenceId, initPoint } = await mercadoPagoService.createPreference(
        routine,
        {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName
        }
      );

      timer.end();

      logger.info('Preference created, redirecting to MP', {
        preferenceId,
        isBundle
      });

      // Redirigir al Checkout Pro de Mercado Pago
      window.location.href = initPoint;

    } catch (err) {
      console.error('❌ Error creando preferencia:', err);
      logger.paymentError('unknown', err.message, {
        routineId: routine.id,
        userEmail: user.email
      });

      setError(
        err.message ||
        'Error al conectar con Mercado Pago. Por favor intenta nuevamente o contacta a soporte.'
      );
      setProcessing(false);
    }
  };

  const sectionClasses = "mt-16 flex flex-col gap-6 p-6 md:p-10";
  const headerClasses =
    "space-y-2 text-center md:text-left";
  const motionCardProps = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" },
  };

  if (!routine) {
    return (
      <section id="checkout-section" className={sectionClasses}>
        <header className={headerClasses}>
          <h4 className="text-xs uppercase tracking-[0.4em] text-[#B5FF00]">
            Paso 04
          </h4>
          <h2 className="text-3xl font-semibold text-white md:text-4xl">
            Checkout Mercado Pago
          </h2>
          <p className="text-sm text-gray-400 md:text-base">
            Confirmá tus datos y ejecutá el pago seguro con Mercado Pago.
          </p>
        </header>

        <FadeIn className="rounded-2xl border border-dashed border-[#2E2E2E] bg-[#0E0E0E] p-10 text-center">
          <h3 className="text-2xl font-semibold uppercase text-gray-300">
            Seleccioná una rutina
          </h3>
          <p className="mt-4 text-sm text-gray-500">
            Abrí una rutina disponible y confirmala para habilitar el checkout
            con Mercado Pago.
          </p>
        </FadeIn>
      </section>
    );
  }

  if (success) {
    return (
      <section id="checkout-section" className={sectionClasses}>
        <header className={headerClasses}>
          <h4 className="text-xs uppercase tracking-[0.4em] text-[#B5FF00]">
            Paso 04
          </h4>
          <h2 className="text-3xl font-semibold text-white md:text-4xl">
            Pago confirmado
          </h2>
          <p className="text-sm text-gray-400 md:text-base">
            Te enviamos la rutina seleccionada y el comprobante de Mercado Pago.
          </p>
        </header>

        <FadeIn className="rounded-2xl border border-[#B5FF00]/40 bg-[#0E0E0E] p-10 text-center">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#B5FF00] text-3xl">
              ✅
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-semibold uppercase text-white">
                ¡Listo!<br className="hidden md:block" /> Pago acreditado
              </h3>
              <p className="text-sm text-gray-400">
                Tu rutina <span className="text-white">{routine.name}</span> ya está disponible en tu dashboard.
                Redirigiendo en 3 segundos...
              </p>
            </div>
            <button
              type="button"
              className="w-full rounded-full bg-[#B5FF00] px-8 py-3 text-sm font-semibold uppercase tracking-wide text-black transition-all hover:-translate-y-0.5 hover:bg-[#D0FF4D] md:w-auto"
              onClick={() => navigate('/client/dashboard')}
            >
              Ir a Mi Dashboard
            </button>
          </div>
        </FadeIn>
      </section>
    );
  }

  return (
    <section id="checkout-section" className={sectionClasses}>
      <header className={headerClasses}>
        <h4 className="text-xs uppercase tracking-[0.4em] text-[#B5FF00]">
          Paso 04
        </h4>
        <h2 className="text-3xl font-semibold text-white md:text-4xl">
          Checkout Mercado Pago
        </h2>
        <p className="text-sm text-gray-400 md:text-base">
          Confirmá tus datos y ejecutá el pago seguro con Mercado Pago.
        </p>
      </header>

      <motion.div
        className="rounded-2xl border border-[#2E2E2E] bg-[#0E0E0E] p-6 shadow-[0_0_35px_-20px_rgba(181,255,0,0.35)] md:p-10"
        {...motionCardProps}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase tracking-[0.3em] text-gray-500">
              Plan seleccionado
            </span>
            <h3 className="text-2xl font-semibold text-white md:text-3xl">
              {routine.name}
            </h3>
            <p className="text-sm text-gray-400">
              {formatWeeks(routine.duration)} • {formatFrequency(routine.frequency)}
              {routine.level && routine.level !== ""
                ? ` • Nivel ${routine.level}`
                : ""}
            </p>
            {isBundle && bundleInfo && (
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#B5FF00]/10 px-3 py-1">
                <span className="text-xs font-semibold text-[#B5FF00]">
                  📦 Bundle: {bundleInfo.products.length} productos
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center text-center md:items-end md:text-right">
            <span className="text-xs uppercase tracking-[0.3em] text-gray-500">
              Inversión
            </span>
            <p className="text-3xl font-bold text-[#B5FF00] md:text-4xl">
              ${routine.price.toLocaleString("es-AR")}
            </p>
          </div>
        </div>

        <form className="mt-8 grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-gray-200">
              Nombre
              <input
                required
                value={formData.firstName}
                onChange={(event) =>
                  handleChange("firstName", event.target.value)
                }
                className={`rounded-lg border ${validationErrors.firstName ? 'border-red-500' : 'border-[#2E2E2E]'} bg-[#0A0A0A] px-4 py-3 text-sm text-white focus:border-[#B5FF00] focus:outline-none`}
                placeholder="Tu nombre"
              />
              {validationErrors.firstName && (
                <span className="text-xs text-red-400">{validationErrors.firstName}</span>
              )}
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-gray-200">
              Apellido
              <input
                required
                value={formData.lastName}
                onChange={(event) =>
                  handleChange("lastName", event.target.value)
                }
                className={`rounded-lg border ${validationErrors.lastName ? 'border-red-500' : 'border-[#2E2E2E]'} bg-[#0A0A0A] px-4 py-3 text-sm text-white focus:border-[#B5FF00] focus:outline-none`}
                placeholder="Tu apellido"
              />
              {validationErrors.lastName && (
                <span className="text-xs text-red-400">{validationErrors.lastName}</span>
              )}
            </label>
          </div>

          <label className="flex flex-col gap-2 text-sm font-medium text-gray-200">
            Email de entrega
            <input
              required
              type="email"
              value={formData.email}
              onChange={(event) => handleChange("email", event.target.value)}
              className={`rounded-lg border ${validationErrors.email ? 'border-red-500' : 'border-[#2E2E2E]'} bg-[#0A0A0A] px-4 py-3 text-sm text-white focus:border-[#B5FF00] focus:outline-none`}
              placeholder="tuemail@example.com"
            />
            {validationErrors.email ? (
              <span className="text-xs text-red-400">{validationErrors.email}</span>
            ) : (
              <span className="text-xs text-gray-500">
                Enviaremos {isBundle ? 'tus archivos' : 'la rutina'}, seguimiento y comprobante a este correo.
              </span>
            )}
          </label>

          <div className="flex flex-col items-center gap-4 rounded-xl border border-[#2E2E2E] bg-[#0A0A0A] p-6 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-[#B5FF00]">
              Método de pago
            </span>
            <div className="flex items-center justify-center">
              <img
                src="/logos/mercadopago.svg"
                alt="Mercado Pago"
                className="h-10"
              />
            </div>
            <p className="text-xs text-gray-500">
              Pago 100% seguro en pesos argentinos. Respetamos la integración
              oficial utilizada en la versión administrativa.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={processing}
            className="w-full rounded-full bg-[#B5FF00] px-8 py-3 text-sm font-semibold uppercase tracking-wide text-black transition-all hover:-translate-y-0.5 hover:bg-[#D0FF4D] disabled:cursor-not-allowed disabled:bg-[#2E2E2E] disabled:text-gray-500"
          >
            {processing
              ? "Redirigiendo a Mercado Pago..."
              : user ? `Proceder al pago - $${routine.price.toLocaleString("es-AR")}` : "Iniciar sesión para comprar"}
          </button>
        </form>
      </motion.div>
    </section>
  );
}

export default PaymentSection;
