
import { Edit, Copy, Trash2, Monitor } from 'lucide-react';

export default function TemplateActions({ onEdit, onDuplicate, onDelete, onExportPdf }) {
  return (
    <div className="flex flex-wrap gap-2 md:justify-end">
      <button

        onClick={onEdit}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#787878]/20 hover:bg-[#787878]/10"
        aria-label="Editar"
      >
        <Edit className="w-4 h-4" />
        <span className="hidden sm:inline">Editar</span>
      </button>
      <button
        onClick={onDuplicate}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#787878]/20 hover:bg-[#787878]/10"
        aria-label="Duplicar"
      >
        <Copy className="w-4 h-4" />
        <span className="hidden sm:inline">Duplicar</span>
      </button>
      <button
        onClick={onDelete}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#787878]/20 hover:bg-red-500/10 text-red-400/90"
        aria-label="Eliminar"
      >
        <Trash2 className="w-4 h-4" />
        <span className="hidden sm:inline">Eliminar</span>
      </button>
      <button
        onClick={onExportPdf}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#787878]/20 hover:bg-[#787878]/10"
        aria-label="PDF"
      >
        <Monitor className="w-4 h-4" />
        <span className="hidden sm:inline">PDF</span>
      </button>
    </div>
  );
}
