import React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Tag
} from './reactbits/index.js';

function InfoPill({ label, value }) {
  return (
    <div className="rounded-2xl bg-neutral-100 px-4 py-3 text-center">
      <span className="block text-xs uppercase tracking-[0.3em] text-neutral-500">{label}</span>
      <span className="mt-1 block text-sm font-semibold text-neutral-900">{value}</span>
    </div>
  );
}

function RoutinePreviewModal({ routine, open, onClose, onSelect }) {
  if (!routine) return null;

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{routine.name}</DialogTitle>
          <DialogDescription>{routine.focus}</DialogDescription>
        </DialogHeader>
        <div className="px-8">
          <div className="overflow-hidden rounded-3xl">
            <img src={routine.image} alt={routine.name} className="h-64 w-full object-cover" />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <InfoPill label="Duración" value={routine.duration} />
            <InfoPill label="Frecuencia" value={`${routine.frequency} días`} />
            <InfoPill label="Nivel" value={routine.level} />
          </div>
          <p className="mt-6 text-base leading-relaxed text-neutral-600">{routine.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {routine.tags.map((tag) => (
              <Tag key={tag} tone="lime">
                {tag}
              </Tag>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" color="neutral" onClick={onClose} className="w-full md:w-auto">
            Seguir explorando
          </Button>
          <Button color="lime" onClick={() => onSelect(routine)} className="w-full md:w-auto">
            Seleccionar esta rutina
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RoutinePreviewModal;
