import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FadeIn } from "../Shared/reactbits/index.js";
import { useAppContext } from "../../context/AppContext.jsx";
import { mercadoPagoService } from "../../services/mercadoPagoService.js";
import { useClientAuth } from "../../context/UnifiedAuthContext.jsx";

function PaymentSection({
  routine,
  planType = "essential",
  premiumAddonPrice = 6000,
}) {
  const { dispatch } = useAppContext();
  const { user } = useClientAuth();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const isPremium = planType === "premium";
  const planLabel = isPremium ? "Plan Premium MZ" : "Plan Essential";

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

  const totalPrice = useMemo(() => {
    if (!routine) return 0;
    return isPremium ? routine.price + premiumAddonPrice : routine.price;
  }, [isPremium, premiumAddonPrice, routine]);

  const plan = useMemo(
    () =>
      routine
        ? {
          id: `routine-${routine.id}`,
          name: routine.name,
          price: totalPrice,
          label: planLabel,
          type: planType,
          premiumAddonPrice,
        }
        : null,
    [planLabel, planType, premiumAddonPrice, routine, totalPrice],
  );

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!routine || !plan) return;

    setProcessing(true);
    setError(null);

    try {
      let productData;
      // Import dinámico para evitar problemas de SSR o inicialización
      const { supabase } = await import('@/lib/supabase');

      if (isPremium) {
        // 1. Buscar el producto "Libro" en la base de datos
        const { data: bookProduct, error: bookError } = await supabase
          .from('products')
          .select('id, name, price, description')
          .eq('type', 'book')
          .limit(1)
          .single();

        if (bookError && bookError.code !== 'PGRST116') {
          console.error('Error fetching book:', bookError);
        }

        // Si encontramos el libro, creamos un bundle dinámico
        if (bookProduct) {
          console.log('📚 Libro encontrado para bundle:', bookProduct.name);
          
          productData = {
            id: `bundle-${routine.id}-${bookProduct.id}`, // ID temporal para el bundle
            name: `${routine.name} + ${bookProduct.name}`,
            description: `Pack Premium: Rutina + Ebook`,
            price: totalPrice,
            type: 'bundle',
            isDynamic: true, // Flag importante para el servicio
            products: [
              {
                id: routine.id,
                name: routine.name,
                description: routine.description || 'Rutina de entrenamiento',
                price: routine.price,
                type: 'routine'
              },
              {
                id: bookProduct.id,
                name: bookProduct.name,
                description: bookProduct.description || 'Ebook de Nutrición',
                price: premiumAddonPrice, // Usamos el precio del addon definido en frontend
                type: 'book'
              }
            ],
            metadata: {
              is_dynamic: true,
              is_bundle: true,
              routine_id: routine.id,
              book_id: bookProduct.id,
              plan_type: 'premium'
            }
          };
        } else {
          // Fallback si no hay libro en DB (no debería pasar en prod)
          console.warn('⚠️ No se encontró producto tipo "book" en DB. Usando fallback simple.');
          productData = {
            id: routine.id,
            name: routine.name,
            description: routine.description || `Rutina ${routine.name}`,
            price: totalPrice,
            type: 'routine',
            metadata: {
              plan_type: 'premium',
              includes_ebook: true, // Flag legacy
              addon_price: premiumAddonPrice
            }
          };
        }
      } else {
        // Plan Essential (Solo Rutina)
        productData = {
          id: routine.id,
          name: routine.name,
          description: routine.description || `Rutina ${routine.name}`,
          price: totalPrice,
          type: 'routine',
          metadata: {
            plan_type: 'essential'
          }
        };
      }

      // Preparar datos del usuario
      const userData = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        userId: user?.id || null, // ID de Supabase si está autenticado
        planType: planType
      };

      console.log('🚀 Iniciando proceso de pago con MercadoPago...');
      console.log('📦 Producto:', productData);
      console.log('👤 Usuario:', { ...userData, userId: userData.userId ? '***' : null });

      // Crear preferencia de pago en MercadoPago
      const { preferenceId, initPoint } = await mercadoPagoService.createPreference(
        productData,
        userData
      );

      console.log('✅ Preferencia creada:', preferenceId);
      console.log('🔗 Redirigiendo a MercadoPago Checkout:', initPoint);

      // Guardar datos en contexto antes de redireccionar
      dispatch({
        type: "SET_PENDING_PURCHASE",
        payload: {
          routine,
          plan,
          userData,
          preferenceId
        }
      });

      // Redirigir a MercadoPago Checkout Pro
      window.location.href = initPoint;

    } catch (err) {
      console.error('❌ Error al procesar el pago:', err);
      setError(err.message || 'Error al procesar el pago. Por favor, intenta nuevamente.');
      setProcessing(false);
    }
  };

  const sectionClasses = "mt-8 flex flex-col gap-4 p-5 text-natural-wrap sm:mt-10 sm:gap-5 sm:p-6 md:mt-12 md:gap-6 md:p-8 lg:mt-16 lg:p-10";
  const headerClasses = "space-y-2 text-center text-natural-wrap sm:space-y-3 md:text-left";
  const motionCardProps = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" },
  };

  if (!routine) {
    return (
      <section id="checkout-section" className={sectionClasses}>
        <header className={headerClasses}>
          <h4 className="text-xs uppercase tracking-[0.4em] text-accent">
            Paso 04
          </h4>
          <h2 className="text-3xl font-semibold text-white md:text-4xl text-natural-wrap">
            Checkout Mercado Pago
          </h2>
          <p className="text-sm text-gray-400 md:text-base text-natural-wrap">
            Confirmá tus datos y ejecutá el pago seguro con Mercado Pago.
          </p>
        </header>

        <FadeIn className="rounded-2xl border border-dashed border-brand-border bg-surface p-10 text-center">
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
          <h4 className="text-xs uppercase tracking-[0.4em] text-accent">
            Paso 04
          </h4>
          <h2 className="text-3xl font-semibold text-white md:text-4xl">
            Pago confirmado
          </h2>
          <p className="mock-text text-sm md:text-base">
            Te enviamos la rutina seleccionada y el comprobante de Mercado Pago.
          </p>
        </header>

        <FadeIn className="rounded-2xl border border-accent/40 bg-surface p-10 text-center">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-accent text-3xl">
              ✅
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-semibold uppercase text-white break-words whitespace-normal">
                ¡Listo!<br className="hidden md:block" /> Pago acreditado
              </h3>
              <p className="mock-text text-sm break-words whitespace-normal">
                Enviamos <span className="mock-text text-white">{plan?.label}</span> y tu
                rutina <span className="mock-text text-white">{routine.name}</span> a{" "}
                <span className="mock-text text-white">{formData.email}</span>.
                {isPremium
                  ? " Incluimos el ebook nutricional y la invitación a la Comunidad MZ."
                  : " Recordá que podés mejorar a Premium más adelante."}
              </p>
            </div>
            <button
              type="button"
              className="w-full rounded-full bg-accent px-8 py-3 text-sm font-semibold uppercase tracking-wide text-black transition-all hover:-translate-y-0.5 hover:bg-accent-strong md:w-auto"
              onClick={() => window.location.assign("/landing")}
            >
              Volver al inicio
            </button>
          </div>
        </FadeIn>
      </section>
    );
  }

  return (
    <section id="checkout-section" className={sectionClasses}>
      <header className={headerClasses}>
        <h4 className="text-xs uppercase tracking-[0.4em] text-accent">
          Paso 04
        </h4>
        <h2 className="text-3xl font-semibold text-white md:text-4xl text-natural-wrap">
          Checkout Mercado Pago
        </h2>
        <p className="text-sm text-gray-400 md:text-base text-natural-wrap">
          Confirmá tus datos y ejecutá el pago seguro con Mercado Pago.
        </p>
      </header>

      <motion.div
        className="rounded-2xl border border-brand-border bg-surface p-6 shadow-[0_0_35px_-20px_rgba(14,242,160,0.45)] md:p-10"
        {...motionCardProps}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3 text-center md:text-left">
            <span className="text-xs uppercase tracking-[0.3em] text-gray-500">
              Plan seleccionado
            </span>
            <h3 className="mock-text text-2xl font-semibold md:text-3xl text-natural-wrap">
              {routine.name}
            </h3>
            <p className="mock-text text-sm text-natural-wrap">
              {formatWeeks(routine.duration)} • {formatFrequency(routine.frequency)}
              {routine.level && routine.level !== ""
                ? ` • Nivel ${routine.level}`
                : ""}
            </p>
            <span
              className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${isPremium
                  ? "border border-accent/60 bg-accent/10 text-accent"
                  : "border border-brand-border text-gray-300"
                }`}
            >
              {planLabel}
            </span>
          </div>
          <div className="flex flex-col items-center text-center md:items-end md:text-right">
            <span className="text-xs uppercase tracking-[0.3em] text-gray-500">
              Inversión
            </span>
            <p className="text-3xl font-bold text-accent md:text-4xl">
              ${totalPrice.toLocaleString("es-AR")}
            </p>
            <p className="text-xs text-gray-500">
              {isPremium
                ? `Incluye +$${premiumAddonPrice.toLocaleString("es-AR")} por ebook y comunidad.`
                : "Puedes sumar el ebook antes de confirmar el pago."}
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-center">
            <p className="text-sm text-red-400">
              {error}
            </p>
          </div>
        )}

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
                className="rounded-lg border border-brand-border bg-base px-4 py-3 text-sm text-white focus:border-accent focus:outline-none"
                placeholder="Tu nombre"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-gray-200">
              Apellido
              <input
                required
                value={formData.lastName}
                onChange={(event) =>
                  handleChange("lastName", event.target.value)
                }
                className="rounded-lg border border-brand-border bg-base px-4 py-3 text-sm text-white focus:border-accent focus:outline-none"
                placeholder="Tu apellido"
              />
            </label>
          </div>

          <label className="flex flex-col gap-2 text-sm font-medium text-gray-200">
            Email de entrega
            <input
              required
              type="email"
              value={formData.email}
              onChange={(event) => handleChange("email", event.target.value)}
              className="rounded-lg border border-brand-border bg-base px-4 py-3 text-sm text-white focus:border-accent focus:outline-none"
              placeholder="tuemail@example.com"
            />
            <span className="text-xs text-gray-500">
              Enviaremos la rutina, seguimiento y comprobante a este correo.
            </span>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-gray-200">
            Teléfono
            <input
              required
              type="tel"
              name="telefono"
              value={formData.phone}
              onChange={(event) => handleChange("phone", event.target.value)}
              className="w-full rounded-lg border border-accent text-accent bg-neutral-950 px-4 py-3 text-sm focus:ring-2 focus:ring-accent"
              placeholder="Tu número de teléfono"
            />
            <span className="text-xs text-gray-500">
              Utilizamos este canal para enviarte novedades del plan y acceso a
              la comunidad MZ.
            </span>
          </label>

          <div className="flex flex-col items-center gap-4 rounded-xl border border-brand-border bg-base p-6 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">
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

          <button
            type="submit"
            disabled={processing}
            className="w-full rounded-full bg-accent px-8 py-3 text-sm font-semibold uppercase tracking-wide text-black transition-all hover:-translate-y-0.5 hover:bg-accent-strong disabled:cursor-not-allowed disabled:bg-brand-border disabled:text-gray-500"
          >
            {processing
              ? "Procesando..."
              : `Proceder al pago - $${totalPrice.toLocaleString("es-AR")}`}
          </button>
        </form>
      </motion.div>
    </section>
  );
}

export default PaymentSection;