import React from "react";
import { Activity, Dumbbell, HeartPulse } from "lucide-react";

const plans = [
  {
    title: "Fuerza & Hipertrofia",
    description:
      "Bloques periodizados para crear fuerza neural y masa funcional con énfasis técnico.",
    icon: Dumbbell,
  },
  {
    title: "Pérdida de Grasa & Rendimiento",
    description:
      "Workouts híbridos con control metabólico, conditioning de alta densidad y biomarcadores semanales.",
    icon: Activity,
  },
  {
    title: "Movilidad & Rehabilitación",
    description:
      "Protocolos correctivos con seguimiento conjunto de fisiokinesiólogos para volver a tu mejor versión.",
    icon: HeartPulse,
  },
];

function Asesorias() {
  return (
    <section id="asesorias" className="space-y-6 sm:space-y-8 md:space-y-10">
      <header className="space-y-2 text-center sm:space-y-3 md:text-left">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#00C0A3] sm:text-xs sm:tracking-[0.4em]">
          Experiencias 1:1
        </p>
        <h2 className="text-2xl font-semibold text-white sm:text-3xl md:text-4xl">
          Asesorías Personalizadas MZ
        </h2>
        <p className="text-sm text-gray-300 sm:text-base md:text-lg">
          Planes ajustados a tu objetivo, seguimiento semanal y optimizaciones
          continuas guiadas por Matias Ortiz.
        </p>
      </header>

      <div className="grid gap-4 sm:gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <article
              key={plan.title}
              className="group rounded-2xl border border-[#0AA66A]/50 bg-[#0b0b0b]/80 p-5 text-white shadow-[0_25px_80px_-45px_rgba(0,192,163,0.65)] transition-all hover:-translate-y-1 hover:border-[#0EF2A0] sm:rounded-3xl sm:p-6"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#0AA66A] bg-[#050505] text-[#0EF2A0] sm:mb-4 sm:h-12 sm:w-12 sm:rounded-2xl">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-lg font-semibold sm:text-xl">{plan.title}</h3>
              <p className="mt-2 text-xs text-gray-300 sm:mt-3 sm:text-sm">{plan.description}</p>
            </article>
          );
        })}
      </div>

      <div className="flex justify-center md:justify-start">
        <a
          href="https://wa.me/5491100000000"
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-full items-center justify-center rounded-full bg-[#0EF2A0] px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[#050505] transition-transform hover:-translate-y-0.5 sm:w-auto sm:px-8 sm:text-sm"
        >
          Solicitar asesoría 1:1
        </a>
      </div>
    </section>
  );
}

export default Asesorias;
