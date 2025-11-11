import React from 'react';
import { FadeIn } from './reactbits/index.js';

function RoutineCarousel({ routines, onPreview }) {
  if (!routines.length) {
    return (
      <FadeIn className="mt-20 rounded-2xl border border-dashed border-neutral-700 bg-neutral-900/60 p-12 text-center">
        <h3 className="text-2xl font-semibold uppercase text-neutral-300">Configura tus filtros</h3>
        <p className="mt-4 text-sm text-neutral-500">
          Seleccioná perfil y objetivo para desplegar las rutinas diseñadas por nuestro equipo técnico.
        </p>
      </FadeIn>
    );
  }

  return (
    <section className="mt-16 flex flex-col gap-8">
      <FadeIn className="flex flex-col gap-3 text-left">
        <span className="text-xs uppercase tracking-[0.4em] text-[#B5FF00]">Paso 03</span>
        <h2 className="text-3xl font-semibold uppercase text-white md:text-4xl">Rutinas disponibles</h2>
        <p className="max-w-3xl text-sm text-neutral-400 md:text-base">
          Cada plan incluye estructura semanal, cargas objetivo y seguimiento. Desplegá la vista previa antes de confirmar.
        </p>
      </FadeIn>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 md:p-8">
        <div className="flex gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none]">
          {routines.map((routine) => (
            <div
              key={routine.id}
              className="flex h-[400px] w-[300px] flex-none flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-950 p-6 transition-all duration-150 hover:border-[#B5FF00] hover:shadow-[0_0_28px_-14px_rgba(181,255,0,0.7)]"
            >
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">{routine.duration}</span>
                  <h3 className="text-lg font-semibold text-white">{routine.name}</h3>
                </div>
                <p className="line-clamp-3 text-sm text-neutral-400">{routine.description}</p>
                <div className="grid grid-cols-2 gap-3 text-xs text-neutral-400">
                  <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-3 text-center">
                    <span className="block text-[11px] uppercase tracking-widest text-neutral-500">Frecuencia</span>
                    <span className="mt-1 block text-sm text-white">{routine.frequency}x semana</span>
                  </div>
                  <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-3 text-center">
                    <span className="block text-[11px] uppercase tracking-widest text-neutral-500">Nivel</span>
                    <span className="mt-1 block text-sm text-white">{routine.level}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-[#B5FF00]">${routine.price.toLocaleString('es-AR')}</span>
                <button
                  type="button"
                  className="rounded-full bg-[#B5FF00] px-4 py-2 text-sm font-semibold uppercase tracking-wide text-black transition-all hover:-translate-y-0.5 hover:bg-[#c7ff3d]"
                  onClick={() => onPreview(routine)}
                >
                  Ver rutina
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RoutineCarousel;
