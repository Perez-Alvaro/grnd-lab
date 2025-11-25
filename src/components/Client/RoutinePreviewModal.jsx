import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../Shared/reactbits/index.js";

function InfoPill({ label, value }) {
  const displayValue = value && value !== "" ? value : "—";
  return (
    <div
      className="rounded-xl border border-zinc-800 bg-black px-4 py-4 text-center shadow-inner shadow-black/10"
    >
      <span className="block text-[11px] uppercase tracking-[0.35em] text-zinc-400">
        {label}
      </span>
      <span className="mt-2 block text-base font-semibold text-white">
        {displayValue}
      </span>
    </div>
  );
}

function RoutinePreviewModal({ routine, open, onClose, onSelect }) {
  const fallbackImage = useMemo(
    () =>
      `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240'>
          <defs>
            <linearGradient id='gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
              <stop offset='0%' stop-color='%23000000'/>
              <stop offset='100%' stop-color='%23141414'/>
            </linearGradient>
          </defs>
          <rect width='400' height='240' fill='url(%23gradient)'/>
          <text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, sans-serif' font-size='28' fill='%2322c55e'>Rutina</text>
        </svg>
      `)}`,
    [],
  );

  if (!routine) return null;

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

  const tags = Array.isArray(routine.tags)
    ? routine.tags
    : typeof routine.tags === "string"
      ? routine.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
      : [];

  const description = routine.description?.trim() || "—";
  const duration = formatWeeks(routine.duration);
  const frequency = formatFrequency(routine.frequency);
  const level = routine.level || "—";

  const imageSrc = routine.image || fallbackImage;

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[700px] md:max-w-4xl p-0 bg-black rounded-2xl overflow-hidden border border-zinc-800 text-white shadow-2xl shadow-emerald-500/10">

        {/* Image - Full width, proper aspect ratio */}
        <div className="w-full aspect-video overflow-hidden relative">
          <img
            src={imageSrc}
            alt={routine.title || routine.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <DialogHeader className="space-y-3 p-0 text-left mb-6">
            <DialogTitle className="text-3xl md:text-4xl font-black text-white uppercase leading-tight break-words">
              {routine.title || routine.name}
            </DialogTitle>
            <DialogDescription className="text-base md:text-lg leading-relaxed text-zinc-300 whitespace-pre-wrap break-words">
              {description}
            </DialogDescription>
          </DialogHeader>

          {/* Info Pills */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <InfoPill label="Duración" value={duration} />
            <InfoPill label="Frecuencia" value={frequency} />
            <InfoPill label="Nivel" value={level} />
          </div>

          {/* Tags - Emerald */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-emerald-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer with CTAs */}
          <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:gap-4 pt-6 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto rounded-full border-2 border-emerald-500 bg-transparent px-8 py-3 text-sm font-bold uppercase tracking-wide text-emerald-500 transition-all duration-300 hover:bg-emerald-500/10 hover:border-emerald-400 hover:scale-105"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={() => onSelect(routine)}
              className="w-full sm:w-auto rounded-full bg-emerald-500 px-8 py-3 text-sm font-bold uppercase tracking-wide text-black shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:bg-emerald-600 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/40"
            >
              Seleccionar rutina
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RoutinePreviewModal;
