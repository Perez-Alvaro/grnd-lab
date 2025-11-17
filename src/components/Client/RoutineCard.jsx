import React, { useMemo } from "react";
import { getReadableTextColor } from "../../utils/color.js";

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
  const readableTextColor = getReadableTextColor(cardBackground);

  return (
    <article
      className="group flex w-full sm:w-[380px] md:w-[440px] flex-col overflow-hidden rounded-2xl bg-neutral-900 text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.97]"
      style={{ backgroundColor: cardBackground, color: readableTextColor }}
    >
      <div className="relative w-full h-[220px] md:h-[260px] overflow-hidden">
        <img
          src={routine.image || fallbackImage}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="flex flex-col justify-between p-4 gap-3 sm:p-5">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg md:text-xl font-bold text-white leading-tight line-clamp-2 break-words whitespace-normal">
            {title}
          </h3>
          {shortDescription && (
            <p className="text-gray-400 text-sm md:text-base leading-relaxed line-clamp-2 break-words whitespace-normal">
              {shortDescription}
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 mt-1">
          <div className="border border-neutral-700 rounded-lg py-2 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide break-words whitespace-normal">Duración</p>
            <p className="text-white font-semibold text-sm md:text-base break-words whitespace-normal">{duration}</p>
          </div>
          <div className="border border-neutral-700 rounded-lg py-2 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide break-words whitespace-normal">Frecuencia</p>
            <p className="text-white font-semibold text-sm md:text-base break-words whitespace-normal">{frequency}</p>
          </div>
          <div className="border border-neutral-700 rounded-lg py-2 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide break-words whitespace-normal">Nivel</p>
            <p className="text-white font-semibold text-sm md:text-base break-words whitespace-normal">{level}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onPreview?.(routine)}
          className="mt-2 bg-lime-400 text-black rounded-full py-2 font-semibold hover:bg-lime-300 transition active:scale-[0.97]"
        >
          Ver rutina
        </button>
      </div>
    </article>
  );
}

export default RoutineCard;
