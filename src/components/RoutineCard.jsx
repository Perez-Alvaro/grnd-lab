import React, { useMemo } from "react";

const formatWeeks = (value) => {
  if (!value && value !== 0) return "—";
  const parsed = Number(value);
  if (!Number.isNaN(parsed) && parsed > 0) {
    return `${parsed} ${parsed === 1 ? "semana" : "semanas"}`;
  }
  return value;
};

const formatFrequency = (value) => {
  if (!value && value !== 0) return "—";
  const parsed = Number(value);
  if (!Number.isNaN(parsed) && parsed > 0) {
    return `${parsed}x/semana`;
  }
  return value;
};

function RoutineCard({ routine, onPreview, onSelect }) {
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

  const description = routine.description?.trim() || "—";
  const duration = formatWeeks(routine.duration);
  const frequency = formatFrequency(routine.frequency);
  const level = routine.level?.trim() || "—";
  const tags = Array.isArray(routine.tags) ? routine.tags : [];

  return (
    <article className="flex h-full min-h-[500px] w-full flex-col justify-between gap-4 rounded-2xl border border-neutral-800 bg-neutral-950 p-6 text-white shadow-lg transition-all duration-150 ease-in-out hover:border-lime-400 hover:shadow-[0_0_35px_-18px_rgba(181,255,0,0.4)]">
      <div className="flex flex-col gap-3">
        <div className="overflow-hidden rounded-xl border border-neutral-800">
          {routine.image ? (
            <img
              src={routine.image}
              alt={routine.title || routine.name}
              className="h-[180px] w-full object-cover"
              loading="lazy"
            />
          ) : (
            <img
              src={fallbackImage}
              alt="Rutina sin imagen"
              className="h-[180px] w-full object-cover"
            />
          )}
        </div>
        <h3 className="text-lg font-semibold text-lime-400">
          {routine.title || routine.name}
        </h3>
        <p className="text-sm leading-relaxed text-gray-400 line-clamp-3">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div>
          <p className="text-xs uppercase text-gray-500">Duración</p>
          <p className="font-semibold text-gray-200">{duration}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-gray-500">Frecuencia</p>
          <p className="font-semibold text-gray-200">{frequency}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-gray-500">Nivel</p>
          <p className="font-semibold text-gray-200">{level}</p>
        </div>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-medium text-lime-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between pt-2">
        <button
          type="button"
          className="rounded-full border border-neutral-700 px-4 py-2 text-sm text-gray-300 transition-all hover:bg-neutral-800"
          onClick={() => onPreview?.(routine)}
        >
          Seguir explorando
        </button>
        <button
          type="button"
          className="rounded-full bg-lime-400 px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-lime-500"
          onClick={() => onSelect?.(routine)}
        >
          Seleccionar rutina
        </button>
      </div>
    </article>
  );
}

export default RoutineCard;
