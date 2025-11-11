import { memo, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';
import { usePlanContext } from '../../context/PlanContext.jsx';

const PlanMetadataForm = memo(() => {
  const { metadata, updateMetadata } = usePlanContext();

  const handleChange = useCallback(
    field => event => {
      updateMetadata(field, event.target.value);
    },
    [updateMetadata]
  );

  return (
    <section
      data-testid="plan-metadata-form"
      className="bg-[#202020] border border-[#787878]/20 rounded-2xl p-6 space-y-6"
    >
      <div className="flex items-center gap-2">
        <ChevronRight className="h-5 w-5 text-[#CBFF00]" />
        <h2 className="text-lg font-semibold">Información del plan</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#787878] mb-2">Nombre del plan</label>
          <input
            data-testid="plan-name-input"
            type="text"
            value={metadata.name}
            onChange={handleChange('name')}
            placeholder="ej. Hipertrofia Intermedia 4 semanas"
            className="w-full bg-[#1A1A1A] border border-[#787878]/30 rounded-xl px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#787878] mb-2">Objetivo</label>
          <select
            data-testid="plan-objective-select"
            value={metadata.objective}
            onChange={handleChange('objective')}
            className="w-full bg-[#1A1A1A] border border-[#787878]/30 rounded-xl px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
          >
            <option value="">Seleccioná un objetivo</option>
            <option value="hipertrofia">Hipertrofia</option>
            <option value="fuerza">Fuerza</option>
            <option value="resistencia">Resistencia</option>
            <option value="pérdida de grasa">Pérdida de grasa</option>
            <option value="salud general">Salud general</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#787878] mb-2">Duración (semanas)</label>
          <input
            data-testid="plan-duration-input"
            type="number"
            min="1"
            value={metadata.durationWeeks}
            onChange={handleChange('durationWeeks')}
            className="w-full bg-[#1A1A1A] border border-[#787878]/30 rounded-xl px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#787878] mb-2">Frecuencia semanal</label>
          <input
            data-testid="plan-frequency-input"
            type="number"
            min="1"
            value={metadata.frequency}
            onChange={handleChange('frequency')}
            className="w-full bg-[#1A1A1A] border border-[#787878]/30 rounded-xl px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#787878] mb-2">Género objetivo</label>
          <select
            data-testid="plan-gender-select"
            value={metadata.gender}
            onChange={handleChange('gender')}
            className="w-full bg-[#1A1A1A] border border-[#787878]/30 rounded-xl px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
          >
            <option value="">Todos</option>
            <option value="male">Masculino</option>
            <option value="female">Femenino</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#787878] mb-2">Autor / Coach</label>
          <input
            data-testid="plan-author-input"
            type="text"
            value={metadata.author}
            onChange={handleChange('author')}
            placeholder="Nombre del entrenador"
            className="w-full bg-[#1A1A1A] border border-[#787878]/30 rounded-xl px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#787878] mb-2">Etiquetas (separadas por coma)</label>
          <input
            data-testid="plan-tags-input"
            type="text"
            value={metadata.tags}
            onChange={handleChange('tags')}
            placeholder="ej. torso/pierna, avanzado, volumen"
            className="w-full bg-[#1A1A1A] border border-[#787878]/30 rounded-xl px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#787878] mb-2">Notas generales del plan</label>
          <textarea
            data-testid="plan-notes-input"
            rows={4}
            value={metadata.notes}
            onChange={handleChange('notes')}
            placeholder="Introduce pautas generales, recomendaciones de progresión, recordatorios de recuperación..."
            className="w-full bg-[#1A1A1A] border border-[#787878]/30 rounded-xl px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors resize-none"
          />
        </div>
      </div>
    </section>
  );
});

PlanMetadataForm.displayName = 'PlanMetadataForm';

export default PlanMetadataForm;
