import { Edit, Copy, Trash2, Monitor } from "lucide-react";

export default function TemplateActions({
  onEdit,
  onDuplicate,
  onDelete,
  onExportPdf,
}) {
  return (
    <div className="flex flex-wrap gap-2 md:justify-end">
      <button
        onClick={onEdit}
        className="inline-flex items-center gap-2 rounded-lg border border-[#B5FF00] px-3 py-2 text-sm font-medium text-[#B5FF00] transition-colors hover:bg-[#B5FF00]/10"
        aria-label="Editar"
      >
        <Edit className="w-4 h-4" />
        <span className="hidden sm:inline">Editar</span>
      </button>
      <button
        onClick={onDuplicate}
        className="inline-flex items-center gap-2 rounded-lg border border-[#2E2E2E] px-3 py-2 text-sm text-gray-300 transition-colors hover:border-[#B5FF00]/60 hover:text-white"
        aria-label="Duplicar"
      >
        <Copy className="w-4 h-4" />
        <span className="hidden sm:inline">Duplicar</span>
      </button>
      <button
        onClick={onDelete}
        className="inline-flex items-center gap-2 rounded-lg border border-orange-500/60 px-3 py-2 text-sm text-orange-400 transition-colors hover:bg-orange-500/10"
        aria-label="Eliminar"
      >
        <Trash2 className="w-4 h-4" />
        <span className="hidden sm:inline">Eliminar</span>
      </button>
      <button
        onClick={onExportPdf}
        className="inline-flex items-center gap-2 rounded-lg border border-[#2E2E2E] px-3 py-2 text-sm text-gray-300 transition-colors hover:border-[#B5FF00]/60 hover:text-white"
        aria-label="PDF"
      >
        <Monitor className="w-4 h-4" />
        <span className="hidden sm:inline">PDF</span>
      </button>
    </div>
  );
}
