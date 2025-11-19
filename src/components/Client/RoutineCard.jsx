import React, { useMemo } from "react";

function RoutineCard({ routine, onPreview }) {
  const fallbackImage = useMemo(
    () =>
      `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240'>
          <defs>
            <linearGradient id='gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
              <stop offset='0%' stop-color='%230E0E0E'/>
              <stop offset='100%' stop-color='%23262626'/>
            </linearGradient>
          </defs>
          <rect width='400' height='240' fill='url(%23gradient)'/>
          <text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, sans-serif' font-size='28' fill='%23B5FF00'>Rutina</text>
        </svg>
      `)}`,
    [],
  );

  const title = routine.title || routine.name;
  const description = routine.description?.trim() || "";
  const shortDescription =
    routine.focus?.trim() ||
    routine.shortDescription?.trim() ||
    (Array.isArray(routine.highlights) && routine.highlights.length > 0
      ? routine.highlights[0]
      : description);

  const duration = routine.duration || routine.durationWeeks || "—";
  const frequency =
    routine.frequency ||
    (Array.isArray(routine.days) ? `${routine.days.length}x/semana` : "—");
  const level = routine.level || routine.difficulty || "—";

  const cardBackground = routine.cardColor || "#111111";

  return (
    <article
      className="group flex w-full flex-col overflow-hidden rounded-xl bg-neutral-900 text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.97] text-natural-wrap sm:rounded-2xl"
      style={{ backgroundColor: cardBackground }}
    >
      <div className="relative w-full h-[180px] overflow-hidden sm:h-[200px] md:h-[220px] lg:h-[260px]">
        <img
          src={routine.image || fallbackImage}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="flex flex-col justify-between p-4 gap-2 sm:gap-3 sm:p-5">
        <div className="flex flex-col gap-1 text-natural-wrap sm:gap-2">
          <h3 className="mock-text text-base font-bold leading-tight text-natural-wrap sm:text-lg md:text-xl">
            {title}
          </h3>
          {shortDescription && (
            <p className="mock-text text-xs leading-relaxed text-natural-wrap sm:text-sm md:text-base">
              {shortDescription}
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 mt-1">
          <div className="border border-neutral-700 rounded-lg py-2 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-wide text-natural-wrap sm:text-xs">Duración</p>
            <p className="mock-text text-xs font-semibold text-natural-wrap sm:text-sm md:text-base">{duration}</p>
          </div>
          <div className="border border-neutral-700 rounded-lg py-2 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-wide text-natural-wrap sm:text-xs">Frecuencia</p>
            <p className="mock-text text-xs font-semibold text-natural-wrap sm:text-sm md:text-base">{frequency}</p>
          </div>
          <div className="border border-neutral-700 rounded-lg py-2 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-wide text-natural-wrap sm:text-xs">Nivel</p>
            <p className="mock-text text-xs font-semibold text-natural-wrap sm:text-sm md:text-base">{level}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onPreview?.(routine)}
          className="mt-2 rounded-full bg-[#0EF2A0] py-2 text-xs font-semibold text-[#050505] transition hover:bg-[#0AA66A] active:scale-[0.97] sm:py-2.5 sm:text-sm"
        >
          Ver vista previa
        </button>
      </div>
    </article>
  );
}

export default RoutineCard;
