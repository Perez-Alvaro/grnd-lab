import React from 'react';


export default function EditorActionBar({ dirty, onSave, onPdf, onBack }) {

  if (!dirty) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-800 bg-zinc-900/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 p-3">

        <button
          onClick={onBack}
          type="button"
          className="text-zinc-300 hover:text-white transition"
        >
          ← Volver
        </button>
        <div className="flex items-center gap-3">

          {onPdf && (
            <button
              onClick={onPdf}
              type="button"

              className="rounded-xl border border-lime-400 bg-zinc-800 px-4 py-2 text-white hover:shadow-[0_0_10px_#D7FB00] transition"

            >
              PDF
            </button>
          )}
          <button
            type="button"
            onClick={onSave}

            disabled={!dirty}
            className={`rounded-xl px-4 py-2 font-semibold transition ${
              dirty
                ? 'bg-[#D7FB00] text-black hover:shadow-[0_0_10px_#D7FB00]'
                : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
            }`}
          >
            Guardar

          </button>
        </div>
      </div>
    </div>
  );
}
