import React from "react";
import training1 from "@/assets/training-1.jpg";
import training2 from "@/assets/training-2.jpg";
import training3 from "@/assets/training-3.jpg";

const plans = [
  {
    title: "Fuerza & Hipertrofia",
    description:
      "Bloques periodizados para crear fuerza neural y masa funcional con énfasis técnico.",
    image: training1,
  },
  {
    title: "Pérdida de Grasa & Rendimiento",
    description:
      "Workouts híbridos con control metabólico, conditioning de alta densidad y biomarcadores semanales.",
    image: training2,
  },
  {
    title: "Movilidad & Rehabilitación",
    description:
      "Protocolos correctivos con seguimiento conjunto de fisiokinesiologos para volver a tu mejor versión.",
    image: training3,
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
          return (
            <article
              key={plan.title}
              className="group overflow-hidden rounded-2xl border border-[#0AA66A]/50 bg-[#0b0b0b]/80 text-white shadow-[0_25px_80px_-45px_rgba(0,192,163,0.65)] transition-all hover:-translate-y-1 hover:border-[#0EF2A0] sm:rounded-3xl"
            >
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden sm:h-56">
                <img
                  src={plan.image}
                  alt={plan.title}
                  className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0 grayscale-[30%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/50 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6">
                <h3 className="text-lg font-semibold sm:text-xl">{plan.title}</h3>
                <p className="mt-2 text-xs text-gray-300 sm:mt-3 sm:text-sm">{plan.description}</p>
              </div>
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
