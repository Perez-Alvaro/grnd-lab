import React from "react";
import { motion } from "framer-motion";
import { FadeIn } from "../Shared/reactbits/index.js";
import RoutineCard from "./RoutineCard.jsx";

function RoutineCarousel({ routines, onPreview, onSelect }) {
  if (!routines.length) {
    return (
      <FadeIn className="mt-20 rounded-2xl border border-dashed border-[#2E2E2E] bg-[#0E0E0E] p-12 text-center">
        <h3 className="text-2xl font-semibold uppercase text-gray-300">
          Configura tus filtros
        </h3>
        <p className="mt-4 text-sm text-gray-500">
          Seleccioná perfil y objetivo para desplegar las rutinas diseñadas por
          nuestro equipo técnico.
        </p>
      </FadeIn>
    );
  }

  return (
    <section className="mt-16 flex flex-col gap-8">
      <FadeIn className="flex flex-col gap-3 text-left">
        <span className="text-xs uppercase tracking-[0.4em] text-[#B5FF00]">
          Paso 03
        </span>
        <h2 className="text-3xl font-semibold uppercase text-white md:text-4xl">
          Rutinas disponibles
        </h2>
        <p className="max-w-3xl text-sm text-gray-400 md:text-base">
          Explorá las variantes disponibles y abrí una rutina para revisar su
          estructura completa antes de confirmar la compra.
        </p>
      </FadeIn>

      <div className="rounded-2xl border border-[#2E2E2E] bg-[#0E0E0E] p-4 sm:p-6 md:p-8">
        <div className="flex flex-col items-center gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {routines.map((routine, index) => (
            <motion.div
              key={routine.id}
              className="flex w-full max-w-[340px]"
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
