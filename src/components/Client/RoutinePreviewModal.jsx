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
      className="rounded-xl border border-[#2E2E2E] bg-[#0E0E0E] px-4 py-4 text-center shadow-inner shadow-black/10 text-natural-wrap"
    >
      <span className="block text-[11px] uppercase tracking-[0.35em] text-gray-400 text-natural-wrap">
        {label}
      </span>
      <span className="mock-text mt-2 block text-base font-semibold text-natural-wrap">
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
          <text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, sans-serif' font-size='28' fill='%23B5FF00'>Rutina</text>
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
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[600px] md:max-w-[800px] p-4 sm:p-6 bg-neutral-950 rounded-2xl overflow-hidden border border-[#2E2E2E] text-white shadow-[0_45px_120px_-50px_rgba(0,0,0,1)] text-natural-wrap">
        <div className="flex flex-col gap-6 md:flex-row md:gap-6 text-natural-wrap">
          <div className="md:w-1/2">
            <img
              src={imageSrc}
              alt={routine.title || routine.name}
              className="w-full h-[200px] sm:h-[300px] object-cover rounded-xl"
            />
          </div>
          <div className="md:w-1/2 flex flex-col gap-4 text-center sm:text-left text-natural-wrap">
            <DialogHeader className="space-y-2 p-0 text-left text-natural-wrap">
              <DialogTitle className="mock-text text-2xl font-bold text-natural-wrap">
                {routine.title || routine.name}
              </DialogTitle>
              <DialogDescription className="mock-text text-sm sm:text-base leading-relaxed text-natural-wrap">
                {description}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <InfoPill label="Duración" value={duration} />
              <InfoPill label="Frecuencia" value={frequency} />
              <InfoPill label="Nivel" value={level} />
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start text-natural-wrap">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#2E2E2E] bg-[#1A1A1A] px-3 py-1 text-xs font-medium uppercase tracking-wide text-lime-400 text-natural-wrap"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-6 flex flex-col gap-3 border-t border-[#2E2E2E] bg-[#0A0A0A] px-0 pt-4 md:flex-row md:justify-end md:gap-4 md:bg-transparent md:border-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full border border-accent px-6 py-2 text-sm font-semibold text-accent transition-colors duration-150 hover:bg-accent/10 md:w-auto"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={() => onSelect(routine)}
            className="w-full rounded-full bg-accent px-6 py-2 text-sm font-semibold text-black transition-transform transition-colors duration-150 hover:-translate-y-0.5 hover:bg-accent-strong active:scale-[0.97] md:w-auto"
          >
            Seleccionar rutina
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RoutinePreviewModal;
