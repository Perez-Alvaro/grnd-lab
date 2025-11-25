import React from "react";
import { motion } from "framer-motion";
import { FadeIn } from "../Shared/reactbits/index.js";
import RoutineCard from "./RoutineCard.jsx";

function RoutineCarousel({ routines, onPreview, onSelect }) {
  if (!routines.length) {
    return (
      <FadeIn className="mt-12 rounded-2xl border border-dashed border-[#2E2E2E] bg-[#0E0E0E] p-8 text-center sm:mt-16 sm:p-10 md:mt-20 md:p-12">
        <h3 className="text-xl font-semibold uppercase !text-gray-300 sm:text-2xl">
          Configura tus filtros
        </h3>
        <p className="mt-3 text-xs !text-gray-500 sm:mt-4 sm:text-sm">
          Seleccioná perfil y objetivo para desplegar las rutinas diseñadas por
          nuestro equipo técnico.
        </p>
      </FadeIn>
    );
  }

  return (
    <section className="mt-10 flex flex-col gap-6 sm:mt-12 sm:gap-8 md:mt-16">
      <FadeIn className="flex flex-col gap-2 text-center sm:gap-3 md:text-left">
        <span className="text-[10px] uppercase tracking-[0.3em] !text-accent sm:text-xs sm:tracking-[0.4em]">
          Paso 03
        </span>
        <h2 className="text-2xl font-semibold uppercase !text-white sm:text-3xl md:text-4xl">
          Rutinas disponibles
        </h2>
        <p className="mx-auto max-w-3xl text-xs !text-gray-400 sm:text-sm md:mx-0 md:text-base">
        </p>
      </FadeIn>

      <div className="rounded-2xl border border-[#2E2E2E] bg-[#0E0E0E] p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {routines.map((routine, index) => (
            <motion.div
              key={routine.id}
              className="flex w-full"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.08 }}
            >
              <RoutineCard
                routine={routine}
                onPreview={onPreview}
                onSelect={onSelect}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RoutineCarousel;
