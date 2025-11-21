import React from "react";
import { FadeIn } from "../Shared/reactbits/index.js";
import { cn } from "../../utils/cn.js";

const genderCards = [
  {
    id: "Masculino",
    label: "Masculino",
    description:
      "Protocolos con énfasis en fuerza máxima, potencia y volumen controlado.",
  },
  {
    id: "Femenino",
    label: "Femenino",
    description:
      "Rutinas enfocadas en estabilidad, potencia y composición atlética integral.",
  },
];

function GenderSelector({ selectedGender, onSelect }) {
  return (
    <section id="genero" className="flex flex-col gap-6 sm:gap-8">
      <FadeIn className="flex flex-col gap-2 text-center sm:gap-3 md:text-left">
        <span className="text-[10px] uppercase tracking-[0.3em] text-accent sm:text-xs sm:tracking-[0.4em]">
          Paso 01
        </span>
        <h2 className="text-2xl font-semibold uppercase !text-white sm:text-3xl md:text-4xl">
          Seleccioná tu perfil
        </h2>
        <p className="mx-auto max-w-3xl text-xs !text-gray-400 sm:text-sm md:mx-0 md:text-base">
          Definimos los planes en base a necesidades fisiológicas y carga
          tolerable. Elegí el enfoque que mejor representa tu estructura.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6">
        {genderCards.map((card, index) => (
          <FadeIn key={card.id} delay={index * 80}>
            <button
              type="button"
              onClick={() => onSelect(card.id)}
              className={cn(
                "group flex w-full flex-col justify-center rounded-xl border border-[#1f1f1f] bg-[#0b0b0b] p-5 text-center transition-all duration-150 sm:p-6 md:min-h-[200px] md:p-8 md:text-left lg:min-h-[220px]",
                "hover:border-accent hover:shadow-[0_0_20px_-12px_rgba(14,242,160,0.55)] hover:-translate-y-0.5",
                selectedGender === card.id &&
                "border-accent ring-1 ring-accent",
              )}
            >
              <h3 className="text-lg font-semibold !text-white sm:text-xl md:text-2xl break-words whitespace-normal">
                {card.label}
              </h3>
              <p className="mt-2 text-xs !text-gray-400 sm:mt-3 sm:text-sm break-words whitespace-normal">
                {card.description}
              </p>
            </button>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

export default GenderSelector;
