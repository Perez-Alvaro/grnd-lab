import React from "react";
import { FadeIn } from "./reactbits/index.js";
import { cn } from "../utils/cn.js";

const goals = [
  {
    id: "fat_loss",
    title: "Pérdida de Grasa (Fuerza y Resistencia)",
    description:
      "Sesiones de fuerza metabolizada con bloques de conditioning y control de cargas para optimizar la recomposición.",
  },
  {
    id: "muscle_gain",
    title: "Volumen (Fuerza e Hipertrofia)",
    description:
      "Programación de hipertrofia estructurada con énfasis en palancas, progresión lineal y capacidad neural.",
  },
];

function GoalSelector({ selectedGoal, onSelect, readyForRoutines }) {
  return (
    <section id="objetivo" className="mt-16 flex flex-col gap-8">
      <FadeIn className="flex flex-col gap-3 text-left">
        <span className="text-xs uppercase tracking-[0.4em] text-[#B5FF00]">
          Paso 02
        </span>
        <h2 className="text-3xl font-semibold uppercase text-white md:text-4xl">
          Definí tu objetivo
        </h2>
        <p className="max-w-3xl text-sm text-neutral-400 md:text-base">
          Afinamos los bloques semanales y la densidad de entrenamiento según tu
          misión principal. Seleccioná la prioridad para filtrar la
          programación.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {goals.map((goal, index) => (
          <FadeIn key={goal.id} delay={index * 80}>
            <button
              type="button"
              onClick={() => onSelect(goal.id)}
              className={cn(
                "flex w-full flex-col justify-center rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-left transition-all duration-150 md:min-h-[220px] md:p-8",
                "hover:border-[#B5FF00] hover:shadow-[0_0_20px_-12px_rgba(181,255,0,0.6)] hover:-translate-y-0.5",
                selectedGoal === goal.id &&
                  "border-[#B5FF00] ring-1 ring-[#B5FF00]",
              )}
            >
              <h3 className="text-xl font-semibold text-white md:text-2xl">
                {goal.title}
              </h3>
              <p className="mt-3 text-sm text-neutral-400">
                {goal.description}
              </p>
            </button>
          </FadeIn>
        ))}
      </div>

      {readyForRoutines && (
        <FadeIn delay={200} className="flex justify-center">
          <button
            type="button"
            className="rounded-full border border-[#B5FF00] bg-[#B5FF00] px-8 py-3 text-sm font-semibold uppercase tracking-wide text-black transition-all hover:-translate-y-0.5 hover:bg-[#c7ff3d]"
            onClick={() =>
              document
                .getElementById("rutinas")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Ver rutinas recomendadas
          </button>
        </FadeIn>
      )}
    </section>
  );
}

export default GoalSelector;
