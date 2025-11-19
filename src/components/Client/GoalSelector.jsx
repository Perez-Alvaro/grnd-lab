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
    <section id="objetivo" className="mt-10 flex flex-col gap-6 sm:mt-12 sm:gap-8 md:mt-16">
      <FadeIn className="flex flex-col gap-2 text-center sm:gap-3 md:text-left">
        <span className="text-[10px] uppercase tracking-[0.3em] text-accent sm:text-xs sm:tracking-[0.4em]">
          Paso 02
        </span>
        <h2 className="text-2xl font-semibold uppercase text-white sm:text-3xl md:text-4xl">
          Definí tu objetivo
        </h2>
        <p className="mx-auto max-w-3xl text-xs text-gray-400 sm:text-sm md:mx-0 md:text-base">
          Afinamos los bloques semanales y la densidad de entrenamiento según tu
          misión principal. Seleccioná la prioridad para filtrar la
          programación.
        </p>
      </FadeIn>

      <div className="text-sm text-gray-400">
      </div>

      {cards.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6">
          {cards.map((goal, index) => (
            <motion.button
              {...motionProps}
              transition={{ ...motionProps.transition, delay: index * 0.08 }}
              key={goal.id}
              type="button"
              onClick={() => onSelect(goal.id)}
              className={cn(
                "flex w-full flex-col justify-center rounded-xl border border-[#1f1f1f] bg-[#0b0b0b] p-5 text-center transition-all duration-150 sm:p-6 md:min-h-[200px] md:p-8 md:text-left lg:min-h-[220px]",
                "hover:border-accent hover:shadow-[0_0_20px_-12px_rgba(14,242,160,0.55)] hover:-translate-y-0.5",
                selectedGoal === goal.id &&
                "border-accent ring-1 ring-accent",
              )}
            >
              <h3 className="text-lg font-semibold text-white sm:text-xl md:text-2xl break-words whitespace-normal">
                {goal.title}
              </h3>
              <p className="mt-2 text-xs text-gray-400 sm:mt-3 sm:text-sm break-words whitespace-normal">
                {goal.description}
              </p>
            </motion.button>
          ))}
        </div>
      )}

      {readyForRoutines && (
        <FadeIn delay={200} className="flex justify-center">
          <button
            type="button"
            className="w-full rounded-full border border-accent bg-accent px-6 py-3 text-xs font-semibold uppercase tracking-wide text-black transition-all hover:-translate-y-0.5 hover:bg-accent-strong sm:w-auto sm:px-8 sm:text-sm"
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
