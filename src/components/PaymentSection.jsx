import React, { useMemo, useState } from "react";
import { FadeIn } from "./reactbits/index.js";
import { useAppContext } from "../context/AppContext.jsx";
import { mockProcessPayment } from "../utils/mockApi.js";

function PaymentSection({ routine }) {
  const { dispatch } = useAppContext();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
  });
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!routine || !plan) return;
    setProcessing(true);

    const { user, sale } = await mockProcessPayment(formData, routine, plan);
    dispatch({ type: "ADD_USER", payload: user });
    dispatch({ type: "ADD_SALE", payload: sale });

    setProcessing(false);
    setSuccess(true);
  };

  if (!routine) {
    return (
      <FadeIn className="mt-24 rounded-2xl border border-dashed border-neutral-700 bg-neutral-900/70 p-12 text-center">
        <h3 className="text-2xl font-semibold uppercase text-neutral-300">
          Seleccioná una rutina
        </h3>
        <p className="mt-4 text-sm text-neutral-500">
          Abrí una rutina disponible y confirmala para habilitar el checkout con
          Mercado Pago.
        </p>
      </FadeIn>
    );
  }

  if (success) {
    return (
      <FadeIn className="mt-20 rounded-2xl border border-[#B5FF00]/40 bg-neutral-900 p-12 text-center">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#B5FF00] text-3xl">
            ✅
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold uppercase text-white">
              Pago confirmado
            </h2>
            <p className="text-sm text-neutral-400">
              Enviamos <span className="text-white">{routine.name}</span> a{" "}
              <span className="text-white">{formData.email}</span>. También
              recibirás seguimiento técnico y actualizaciones automáticas.
            </p>
          </div>
          <button
            type="button"
            className="rounded-full bg-[#B5FF00] px-8 py-3 text-sm font-semibold uppercase tracking-wide text-black transition-all hover:-translate-y-0.5 hover:bg-[#c7ff3d]"
            onClick={() => window.location.assign("/")}
          >
            Volver al inicio
          </button>
        </div>
      </FadeIn>
    );
  }

  return (
    <section className="mt-16 flex flex-col gap-8">
      <FadeIn className="flex flex-col gap-3 text-left">
        <span className="text-xs uppercase tracking-[0.4em] text-[#B5FF00]">
          Paso 04
        </span>
        <h2 className="text-3xl font-semibold uppercase text-white md:text-4xl">
          Checkout Mercado Pago
        </h2>
        <p className="max-w-3xl text-sm text-neutral-400 md:text-base">
          Confirmá tus datos y ejecutá el pago seguro con Mercado Pago.
          Mantenemos la integración existente sin modificar la lógica del
          backend.
        </p>
      </FadeIn>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-[0_0_35px_-20px_rgba(181,255,0,0.5)]">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-white">
              {routine.name}
            </h3>
            <p className="text-sm text-neutral-400">
              {formatWeeks(routine.duration)} • {formatFrequency(routine.frequency)}
              {routine.level && routine.level !== ""
                ? ` • Nivel ${routine.level}`
                : ""}
            </p>
          </div>
          <div className="text-left md:text-right">
            <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">
              Inversión
            </span>
            <p className="text-3xl font-bold text-[#B5FF00]">
              ${routine.price.toLocaleString("es-AR")}
            </p>
          </div>
        </div>

        <form className="mt-8 grid gap-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-neutral-300">
              Nombre
              <input
                required
                value={formData.firstName}
                onChange={(event) =>
                  handleChange("firstName", event.target.value)
                }
                className="rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white focus:border-[#B5FF00] focus:outline-none"
                placeholder="Tu nombre"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-neutral-300">
              Apellido
              <input
                required
                value={formData.lastName}
                onChange={(event) =>
                  handleChange("lastName", event.target.value)
                }
                className="rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white focus:border-[#B5FF00] focus:outline-none"
                placeholder="Tu apellido"
              />
            </label>
          </div>

          <label className="flex flex-col gap-2 text-sm font-medium text-neutral-300">
            Email de entrega
            <input
              required
              type="email"
              value={formData.email}
              onChange={(event) => handleChange("email", event.target.value)}
              className="rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white focus:border-[#B5FF00] focus:outline-none"
              placeholder="tuemail@example.com"
            />
            <span className="text-xs text-neutral-500">
              Enviaremos la rutina, seguimiento y comprobante a este correo.
            </span>
          </label>

          <div className="flex flex-col items-center gap-4 rounded-xl border border-neutral-800 bg-neutral-950 p-6 text-center">
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
            <p className="text-xs text-neutral-500">
              Pago 100% seguro en pesos argentinos. Se respeta la integración
              oficial utilizada en la versión administrativa.
            </p>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="rounded-full bg-[#B5FF00] px-8 py-3 text-sm font-semibold uppercase tracking-wide text-black transition-all hover:-translate-y-0.5 hover:bg-[#c7ff3d] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {processing
              ? "Procesando..."
              : `Proceder al pago - $${routine.price.toLocaleString("es-AR")}`}
          </button>
        </form>
      </div>
    </section>
  );
}

export default PaymentSection;
