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

  return (
    <article className="group flex h-full w-full min-h-[380px] flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 text-white shadow-[0_35px_80px_-60px_rgba(0,0,0,0.85)] transition-all duration-200 hover:border-lime-400 hover:shadow-[0_28px_75px_-45px_rgba(181,255,0,0.45)]">
      <div className="relative h-48 w-full border-b border-neutral-800">
        {routine.image ? (
          <img
            src={routine.image}
            alt={title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <img
            src={fallbackImage}
            alt="Rutina sin imagen"
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between gap-6 p-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold leading-tight text-white line-clamp-2">
            {title}
          </h3>
          {shortDescription && (
            <p className="text-sm text-neutral-400 line-clamp-2">
              {shortDescription}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => onPreview?.(routine)}
          className="inline-flex items-center justify-center rounded-md bg-lime-400 px-5 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-lime-500"
        >
          Ver vista previa
        </button>
      </div>
    </article>
  );
}

export default RoutineCard;
