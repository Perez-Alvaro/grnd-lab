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
    <div className="bg-[#1F1F1F] border border-[#3A3A3A] rounded-2xl p-4 md:p-5 shadow-lg shadow-black/20">
      <div className="flex justify-between items-start">
        <div>
          <button onClick={onEdit} className="text-left">
            <h4 className="text-lg md:text-xl font-semibold hover:text-[#CBFF00] transition-colors">
              {template.name}
            </h4>
          </button>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="rounded-full px-2.5 py-1 text-sm bg-[#787878]/20 border border-[#787878]/20 capitalize">
              {genderLabel[template.gender]}
            </span>
            <span className="rounded-full px-2.5 py-1 text-sm bg-[#787878]/20 border border-[#787878]/20">
              {template.frequency}x/semana
            </span>
            <span className="rounded-full px-2.5 py-1 text-sm bg-[#787878]/20 border border-[#787878]/20 capitalize">
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
        <p className="text-xs text-[#787878] mt-4">{meta.join(" • ")}</p>
      )}
    </div>
  );
}
