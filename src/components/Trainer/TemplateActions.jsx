import { Edit, Copy, Trash2, Monitor, Upload } from "lucide-react";

export default function TemplateActions({
  onEdit,
  onDuplicate,
  onDelete,
  onExportPdf,
  onUploadToStorage,
  uploadingPDF = false,
}) {
  return (
    <div className="flex flex-wrap gap-2 md:justify-end">
      <button
        onClick={onEdit}
        className="inline-flex items-center gap-2 rounded-lg border border-accent px-3 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
        aria-label="Editar"
      >
        <Edit className="w-4 h-4" />
        <span className="hidden sm:inline">Editar</span>
      </button>
      <button
        onClick={onDuplicate}
        className="inline-flex items-center gap-2 rounded-lg border border-[#2E2E2E] px-3 py-2 text-sm text-gray-300 transition-colors hover:border-accent/60 hover:text-white"
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
        className="inline-flex items-center gap-2 rounded-lg border border-[#2E2E2E] px-3 py-2 text-sm text-gray-300 transition-colors hover:border-accent/60 hover:text-white"
        aria-label="Descargar PDF"
        title="Descargar PDF local"
      >
        <Monitor className="w-4 h-4" />
        <span className="hidden sm:inline">PDF</span>
      </button>
      {onUploadToStorage && (
        <button
          onClick={onUploadToStorage}
          disabled={uploadingPDF}
          className="inline-flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-sm text-accent transition-colors hover:border-accent hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Subir a Storage"
          title="Generar y subir PDF al Storage de Supabase"
        >
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">{uploadingPDF ? 'Subiendo...' : 'Storage'}</span>
        </button>
      )}
    </div>
  );
}
