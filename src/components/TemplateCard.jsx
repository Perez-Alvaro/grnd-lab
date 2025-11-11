import TemplateActions from "./TemplateActions.jsx";
import { TRAINING_GOAL_LABELS } from "../constants/objectives.js";

const genderLabel = { male: "masculino", female: "femenino" };

export default function TemplateCard({
  template,
  onEdit,
  onDuplicate,
  onDelete,
  onExportPdf,
}) {
  const formattedDate = template.createdAt
    ? new Date(template.createdAt).toLocaleDateString("es-AR")
    : null;
  const totalWeeks = Array.isArray(template.weeks) ? template.weeks.length : 0;
  const totalDays = Array.isArray(template.weeks)
    ? template.weeks.reduce((sum, week) => sum + (week.days?.length || 0), 0)
    : template.days?.length || 0;
  const meta = [];
  if (formattedDate) meta.push(`Actualizada: ${formattedDate}`);
  if (totalWeeks) meta.push(`Semanas: ${totalWeeks}`);
  if (totalDays) meta.push(`Días: ${totalDays}`);
  if (template.tags?.length)
    meta.push(`Etiquetas: ${template.tags.join(", ")}`);

  return (
    <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-4 shadow-[0_25px_70px_-45px_rgba(0,0,0,0.8)] transition-colors hover:border-[#B5FF00]/60 md:p-5">
      <div className="flex items-start justify-between">
        <div>
          <button onClick={onEdit} className="text-left">
            <h4 className="text-lg font-semibold text-white transition-colors hover:text-[#B5FF00] md:text-xl">
              {template.name}
            </h4>
          </button>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="rounded-full border border-[#2E2E2E] bg-[#0E0E0E] px-2.5 py-1 text-sm capitalize text-gray-300">
              {genderLabel[template.gender]}
            </span>
            <span className="rounded-full border border-[#2E2E2E] bg-[#0E0E0E] px-2.5 py-1 text-sm text-gray-300">
              {template.frequency}x/semana
            </span>
            <span className="rounded-full border border-[#2E2E2E] bg-[#0E0E0E] px-2.5 py-1 text-sm capitalize text-gray-300">
              {TRAINING_GOAL_LABELS[template.objective] || template.objective}
            </span>
          </div>
        </div>
        <TemplateActions
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          onExportPdf={onExportPdf}
        />
      </div>
      {meta.length > 0 && (
        <p className="mt-4 text-xs text-gray-500">{meta.join(" • ")}</p>
      )}
    </div>
  );
}
