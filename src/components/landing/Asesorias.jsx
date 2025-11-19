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
    <section id="asesorias" className="space-y-10">
      <header className="space-y-3 text-center md:text-left">
        <p className="text-xs uppercase tracking-[0.4em] text-[#00C0A3]">
          Experiencias 1:1
        </p>
        <h2 className="text-3xl font-semibold text-white md:text-4xl">
          Asesorías Personalizadas MZ
        </h2>
        <p className="text-base text-gray-300 md:text-lg">
          Planes ajustados a tu objetivo, seguimiento semanal y optimizaciones
          continuas guiadas por Matias Ortiz.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <article
              key={plan.title}
              className="group rounded-3xl border border-[#0AA66A]/50 bg-[#0b0b0b]/80 p-6 text-white shadow-[0_25px_80px_-45px_rgba(0,192,163,0.65)] transition-all hover:-translate-y-1 hover:border-[#0EF2A0]"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#0AA66A] bg-[#050505] text-[#0EF2A0]">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">{plan.title}</h3>
              <p className="mt-3 text-sm text-gray-300">{plan.description}</p>
            </article>
          );
        })}
      </div>

      <div className="flex justify-center md:justify-start">
        <a
          href="https://wa.me/5491100000000"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-[#0EF2A0] px-8 py-3 text-sm font-semibold uppercase tracking-wide text-[#050505] transition-transform hover:-translate-y-0.5"
        >
          Solicitar asesoría 1:1
        </a>
      </div>
    </section>
  );
}

export default Asesorias;
