import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./reactbits/index.js";

function InfoPill({ label, value }) {
  const displayValue = value && value !== "" ? value : "—";
  return (
    <div className="rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-center">
      <span className="block text-[11px] uppercase tracking-[0.3em] text-neutral-500">
        {label}
      </span>
      <span className="mt-1 block text-sm font-semibold text-white">
        {displayValue}
      </span>
    </div>
  );
}

function RoutinePreviewModal({ routine, open, onClose, onSelect }) {
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
      ? routine.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
      : [];

  const description = routine.description?.trim() || "—";
  const duration = formatWeeks(routine.duration);
  const frequency = formatFrequency(routine.frequency);
  const level = routine.level || "—";

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-w-3xl border border-neutral-800 bg-neutral-950 text-white shadow-xl">
        <DialogHeader className="px-8 pt-8 pb-4">
          <DialogTitle className="text-2xl font-semibold text-white">
            {routine.title || routine.name}
          </DialogTitle>
          <DialogDescription className="mt-3 text-sm leading-relaxed text-neutral-400">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="px-8">
          {routine.image && (
            <div className="overflow-hidden rounded-2xl border border-neutral-800">
              <img
                src={routine.image}
                alt={routine.title || routine.name}
                className="h-64 w-full object-cover"
              />
            </div>
          )}
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <InfoPill label="Duración" value={duration} />
            <InfoPill label="Frecuencia" value={frequency} />
            <InfoPill label="Nivel" value={level} />
          </div>
          {tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-neutral-300">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1 text-[11px] uppercase tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <DialogFooter className="flex flex-col gap-3 px-8 pb-8 pt-6 md:flex-row md:justify-between">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full border border-neutral-700 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-neutral-300 transition-all hover:border-neutral-500 hover:bg-neutral-900 md:w-auto"
          >
            Seguir explorando
          </button>
          <button
            type="button"
            onClick={() => onSelect(routine)}
            className="w-full rounded-full bg-lime-400 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-black transition-all hover:-translate-y-0.5 hover:bg-lime-500 md:w-auto"
          >
            Seleccionar esta rutina
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RoutinePreviewModal;
