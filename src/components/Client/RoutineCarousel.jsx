import React from "react";
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

      <div className="rounded-2xl border border-[#2E2E2E] bg-[#0E0E0E] p-6 md:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {routines.map((routine) => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              onPreview={onPreview}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default RoutineCarousel;
