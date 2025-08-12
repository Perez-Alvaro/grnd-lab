import React from 'react';
import { ArrowLeft, Save, Eye } from 'lucide-react';

/**
 * Sticky toolbar used in the template editor page.
 * Provides back navigation and save action.
 */
export default function EditorToolbar({ onBack, onSave, onPreview }) {
  return (
    <div className="flex justify-between items-center mb-4 sticky top-0 bg-[#2D2D2D] border-b border-[#787878]/20 p-4 z-10">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center space-x-2 text-[#CBFF00] hover:text-[#DBFE52]"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Volver</span>
      </button>
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={onPreview}
          className="flex items-center space-x-2 bg-[#787878]/20 hover:bg-[#787878]/30 text-white px-4 py-2 rounded-lg"
        >
          <Eye className="h-5 w-5" />
          <span>Vista</span>
        </button>
        <button
          type="button"
          onClick={onSave}
          className="flex items-center space-x-2 bg-[#CBFF00] hover:bg-[#DBFE52] text-[#2D2D2D] px-4 py-2 rounded-lg font-medium"
        >
          <Save className="h-5 w-5" />
          <span>Guardar</span>
        </button>
      </div>
    </div>
  );
}
