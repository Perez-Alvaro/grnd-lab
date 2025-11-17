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
    <section id="genero" className="flex flex-col gap-8">
      <FadeIn className="flex flex-col gap-3 text-left">
        <span className="text-xs uppercase tracking-[0.4em] text-accent">
          Paso 01
        </span>
        <h2 className="text-3xl font-semibold uppercase text-white md:text-4xl">
          Seleccioná tu perfil
        </h2>
        <p className="max-w-3xl text-sm text-gray-400 md:text-base">
          Definimos los planes en base a necesidades fisiológicas y carga
          tolerable. Elegí el enfoque que mejor representa tu estructura.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {genderCards.map((card, index) => (
          <FadeIn key={card.id} delay={index * 80}>
            <button
              type="button"
              onClick={() => onSelect(card.id)}
              className={cn(
                "group flex w-full flex-col justify-center rounded-xl border border-[#2E2E2E] bg-[#0E0E0E] p-6 text-left transition-all duration-150 md:min-h-[220px] md:p-8",
                "hover:border-accent hover:shadow-[0_0_20px_-12px_rgba(181,255,0,0.6)] hover:-translate-y-0.5",
                selectedGender === card.id &&
                  "border-accent ring-1 ring-accent",
              )}
            >
              <h3 className="text-xl font-semibold text-white md:text-2xl break-words whitespace-normal">
                {card.label}
              </h3>
              <p className="mt-3 text-sm text-gray-400 break-words whitespace-normal">
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
