import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { FadeIn } from "../Shared/reactbits/index.js";
import { cn } from "../../utils/cn.js";

const objectiveDescriptions = {
  "Pérdida de Grasa (Fuerza y Resistencia)":
    "Sesiones de fuerza metabolizada con bloques de conditioning y control de cargas para optimizar la recomposición.",
  "Volumen (Fuerza e Hipertrofia)":
    "Programación de hipertrofia estructurada con énfasis en palancas, progresión lineal y capacidad neural.",
};

function GoalSelector({
  objectives = [],
  selectedGoal,
  onSelect,
  readyForRoutines,
}) {
  const options = useMemo(() => {
    const normalized = ["Todos", ...objectives];
    return Array.from(new Set(normalized.filter(Boolean)));
  }, [objectives]);

  const cards = useMemo(
    () =>
      options
        .filter((option) => option !== "Todos")
        .map((option) => ({
          id: option,
          title: option,
          description:
            objectiveDescriptions[option] ||
            "Personalizamos los bloques semanales y la densidad de trabajo según tu misión principal.",
        })),
    [options],
  );

  const motionProps = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.5, ease: "easeOut" },
  };

  return (
    <section id="objetivo" className="mt-16 flex flex-col gap-8">
      <FadeIn className="flex flex-col gap-3 text-left">
        <span className="text-xs uppercase tracking-[0.4em] text-[#B5FF00]">
          Paso 02
        </span>
        <h2 className="text-3xl font-semibold uppercase text-white md:text-4xl">
          Definí tu objetivo
        </h2>
        <p className="max-w-3xl text-sm text-gray-400 md:text-base">
          Afinamos los bloques semanales y la densidad de entrenamiento según tu
          misión principal. Seleccioná la prioridad para filtrar la
          programación.
        </p>
      </FadeIn>

      <div className="text-sm text-gray-400">
      </div>

      {cards.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {cards.map((goal, index) => (
            <motion.button
              {...motionProps}
              transition={{ ...motionProps.transition, delay: index * 0.08 }}
              key={goal.id}
              type="button"
              onClick={() => onSelect(goal.id)}
              className={cn(
                "flex w-full flex-col justify-center rounded-xl border border-[#2E2E2E] bg-[#0E0E0E] p-6 text-left transition-all duration-150 md:min-h-[220px] md:p-8",
                "hover:border-[#B5FF00] hover:shadow-[0_0_20px_-12px_rgba(181,255,0,0.6)] hover:-translate-y-0.5",
                selectedGoal === goal.id &&
                  "border-[#B5FF00] ring-1 ring-[#B5FF00]",
              )}
            >
              <h3 className="text-xl font-semibold text-white md:text-2xl">
                {goal.title}
              </h3>
              <p className="mt-3 text-sm text-gray-400">{goal.description}</p>
            </motion.button>
          ))}
        </div>
      )}

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
