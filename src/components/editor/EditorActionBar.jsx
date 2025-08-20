import React from 'react';

export default function EditorActionBar({ dirty, valid, saving, onSave, onPdf, onBack }) {
  if (!dirty) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-800 bg-zinc-900/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 p-3">
        <button onClick={onBack} type="button" className="text-zinc-300 hover:text-white">← Volver</button>
        <div className="flex items-center gap-2">
          {onPdf && (
            <button
              onClick={onPdf}
              type="button"
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl px-4 h-9 font-medium"
            >
              PDF
            </button>
          )}
          <button
            type="button"
            onClick={onSave}
            disabled={!dirty || !valid || saving}
            className="bg-lime-500 hover:bg-lime-400 text-black rounded-xl px-4 h-9 font-medium disabled:opacity-50"
          >
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}
