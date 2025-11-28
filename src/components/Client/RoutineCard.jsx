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
          <text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, sans-serif' font-size='28' fill='%2322c55e'>Rutina</text>
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

  // Formatear duración (ej: "8" -> "8 sem")
  const rawDuration = routine.duration || routine.durationWeeks || routine.duration_weeks;
  const duration = rawDuration
    ? `${rawDuration} sem${rawDuration === 1 || rawDuration === '1' ? '' : ''}`
    : "—";

  const frequency =
    routine.frequency ||
    (Array.isArray(routine.days) ? `${routine.days.length}x/sem` : "—");

  // Mapeo de niveles a español
  const levelMap = {
    'beginner': 'Principiante',
    'intermediate': 'Intermedio',
    'advanced': 'Avanzado'
  };
  const level = routine.level ? (levelMap[routine.level] || routine.level) : (routine.difficulty || "—");

  const cardBackground = routine.cardColor || "#111111";

  return (
    <article
      className="group flex w-full flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-black text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-500/50 active:scale-[0.97]"
      style={{ backgroundColor: cardBackground }}
    >
      <div className="relative w-full aspect-[16/10] overflow-hidden">
        <img
          src={routine.image || fallbackImage}
          alt={title}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <div className="flex flex-col justify-between p-4 gap-2 sm:gap-3 sm:p-5">
        <div className="flex flex-col gap-1 text-natural-wrap sm:gap-2">
          <h3 className="text-lg font-bold leading-tight !text-white sm:text-xl md:text-2xl line-clamp-2">
            {title}
          </h3>
          {shortDescription && (
            <p className="text-sm leading-relaxed !text-zinc-400 sm:text-base line-clamp-2">
              {shortDescription}
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 mt-1">
          <div className="border border-neutral-700 rounded-lg py-2 text-center">
            <p className="text-[10px] !text-zinc-500 uppercase tracking-wide sm:text-xs">Duración</p>
            <p className="text-sm font-semibold !text-white sm:text-base">{duration}</p>
          </div>
          <div className="border border-neutral-700 rounded-lg py-2 text-center">
            <p className="text-[10px] !text-zinc-500 uppercase tracking-wide sm:text-xs">Frecuencia</p>
            <p className="text-sm font-semibold !text-white sm:text-base">{frequency}</p>
          </div>
          <div className="border border-neutral-700 rounded-lg py-2 text-center">
            <p className="text-[10px] !text-zinc-500 uppercase tracking-wide sm:text-xs">Nivel</p>
            <p className="text-sm font-semibold !text-white sm:text-base">{level}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onPreview?.(routine)}
          className="mt-3 rounded-full bg-emerald-500 py-3 text-sm font-bold uppercase tracking-wide text-black shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:bg-emerald-600 hover:scale-105 active:scale-95 sm:py-3.5"
        >
          Ver vista previa
        </button>
      </div>
    </article>
  );
}

export default RoutineCard;
