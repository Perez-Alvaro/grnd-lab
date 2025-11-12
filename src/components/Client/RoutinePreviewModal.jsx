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
    <div className="rounded-xl border border-[#2E2E2E] bg-[#0E0E0E] px-4 py-4 text-center shadow-inner shadow-black/10">
      <span className="block text-[11px] uppercase tracking-[0.35em] text-gray-400">
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
      <DialogContent className="max-w-3xl overflow-hidden rounded-2xl border border-[#2E2E2E] bg-[#0E0E0E] text-white shadow-[0_45px_120px_-50px_rgba(0,0,0,1)]">
        <div className="flex flex-col gap-8 p-8">
          <DialogHeader className="space-y-3 p-0">
            <DialogTitle className="text-2xl font-semibold text-lime-400">
              {routine.title || routine.name}
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm leading-relaxed text-gray-400">
              {description}
            </DialogDescription>
          </DialogHeader>

          <div className="w-full overflow-hidden rounded-2xl border border-[#2E2E2E] bg-[#0E0E0E]">
            <img
              src={imageSrc}
              alt={routine.title || routine.name}
              className="h-64 w-full object-cover md:h-[260px]"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <InfoPill label="Duración" value={duration} />
            <InfoPill label="Frecuencia" value={frequency} />
            <InfoPill label="Nivel" value={level} />
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#2E2E2E] bg-[#1A1A1A] px-3 py-1 text-xs font-medium uppercase tracking-wide text-lime-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col gap-3 border-t border-[#2E2E2E] bg-[#0A0A0A] px-8 py-6 md:flex-row md:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full border border-[#B5FF00] px-6 py-2 text-sm font-semibold text-[#B5FF00] transition-colors duration-150 hover:bg-[#B5FF00]/10 md:w-auto"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={() => onSelect(routine)}
            className="w-full rounded-full bg-[#B5FF00] px-6 py-2 text-sm font-semibold text-black transition-transform transition-colors duration-150 hover:-translate-y-0.5 hover:bg-[#D0FF4D] md:w-auto"
          >
            Seleccionar rutina
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RoutinePreviewModal;
