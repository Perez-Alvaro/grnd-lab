import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FadeIn } from "../Shared/reactbits/index.js";
import { useAppContext } from "../../context/AppContext.jsx";
import { mockProcessPayment } from "../../utils/mockApi.js";

function PaymentSection({
  routine,
  planType = "essential",
  premiumAddonPrice = 6000,
}) {
  const { dispatch } = useAppContext();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
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

    const payload = { ...formData, planType };
    const { user, sale } = await mockProcessPayment(payload, routine, plan);
    dispatch({ type: "ADD_USER", payload: user });
    dispatch({ type: "ADD_SALE", payload: sale });

    setProcessing(false);
    setSuccess(true);
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
          <h4 className="text-xs uppercase tracking-[0.4em] text-accent">
            Paso 04
          </h4>
          <h2 className="text-3xl font-semibold text-white md:text-4xl break-words whitespace-normal">
            Checkout Mercado Pago
          </h2>
          <p className="text-sm text-gray-400 md:text-base break-words whitespace-normal">
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
          <p className="text-sm text-gray-400 md:text-base">
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
            <p className="text-sm text-gray-400 break-words whitespace-normal">
              Enviamos <span className="text-white">{plan?.label}</span> y tu
              rutina <span className="text-white">{routine.name}</span> a{" "}
              <span className="text-white">{formData.email}</span>.
                {isPremium
                  ? " Incluimos el ebook nutricional y la invitación a la Comunidad MZ."
                  : " Recordá que podés mejorar a Premium más adelante."}
              </p>
            </div>
            <button
              type="button"
              className="w-full rounded-full bg-accent px-8 py-3 text-sm font-semibold uppercase tracking-wide text-black transition-all hover:-translate-y-0.5 hover:bg-accent-strong md:w-auto"
              onClick={() => window.location.assign("/")}
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
        <h2 className="text-3xl font-semibold text-white md:text-4xl break-words whitespace-normal">
          Checkout Mercado Pago
        </h2>
        <p className="text-sm text-gray-400 md:text-base break-words whitespace-normal">
          Confirmá tus datos y ejecutá el pago seguro con Mercado Pago.
        </p>
      </header>

      <motion.div
        className="rounded-2xl border border-brand-border bg-surface p-6 shadow-[0_0_35px_-20px_rgba(181,255,0,0.35)] md:p-10"
        {...motionCardProps}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3 text-center md:text-left">
            <span className="text-xs uppercase tracking-[0.3em] text-gray-500">
              Plan seleccionado
            </span>
            <h3 className="text-2xl font-semibold text-white md:text-3xl break-words whitespace-normal">
              {routine.name}
            </h3>
            <p className="text-sm text-gray-400 break-words whitespace-normal">
              {formatWeeks(routine.duration)} • {formatFrequency(routine.frequency)}
              {routine.level && routine.level !== ""
                ? ` • Nivel ${routine.level}`
                : ""}
            </p>
            <span
              className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                isPremium
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
