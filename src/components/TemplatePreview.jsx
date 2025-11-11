import React from 'react';
import { TRAINING_GOAL_LABELS } from '../constants/objectives.js';

export default function TemplatePreview({ template }) {
  const genderLabel = { male: 'masculino', female: 'femenino' };
  const weeks = Array.isArray(template.weeks) ? template.weeks : [];

  return (
    <div className="bg-[#202020] rounded-xl p-6 border border-[#787878]/20">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#CBFF00] mb-2">{template.name}</h2>
        <div className="flex justify-center flex-wrap gap-3 text-sm">
          <span className="bg-[#787878]/20 px-3 py-1 rounded-full capitalize">
            {genderLabel[template.gender]}
          </span>
          <span className="bg-[#787878]/20 px-3 py-1 rounded-full">
            {template.frequency} días/semana
          </span>
          {template.duration && (
            <span className="bg-[#787878]/20 px-3 py-1 rounded-full">
              {template.duration} semanas
            </span>
          )}
          <span className="bg-[#787878]/20 px-3 py-1 rounded-full capitalize">
            {TRAINING_GOAL_LABELS[template.objective] || template.objective}
          </span>
        </div>
        {template.tags && template.tags.length > 0 && (
          <div className="flex justify-center flex-wrap gap-2 mt-3 text-xs">
            {template.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-[#787878]/20 px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {template.notes && (
        <div className="mb-6 p-4 bg-[#CBFF00]/10 border border-[#CBFF00]/20 rounded-lg">
          <h3 className="font-semibold text-[#CBFF00] mb-2">Notas de Entrenamiento</h3>
          <p className="text-[#787878] whitespace-pre-line">{template.notes}</p>
        </div>
      )}

      {weeks.map((week, weekIndex) => (
        <div key={week.id || weekIndex} className="mb-6">
          <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-[#787878]">Semana {weekIndex + 1}</p>
              <h3 className="font-semibold text-[#CBFF00] text-xl">{week.title || `Semana ${weekIndex + 1}`}</h3>
            </div>
            {week.summary && <p className="text-sm text-[#C9C9C9]">{week.summary}</p>}
          </div>

          {week.notes && (
            <div className="mb-4 rounded-lg border border-[#787878]/20 bg-[#2D2D2D] p-3">
              <h4 className="text-xs uppercase tracking-wide text-[#787878] mb-1">Notas de la semana</h4>
              <p className="text-sm text-[#C9C9C9] whitespace-pre-line">{week.notes}</p>
            </div>
          )}

          {week.days?.map((day, dayIndex) => (
            <div key={day.id || dayIndex} className="mb-5 rounded-xl border border-[#787878]/20 bg-[#1A1A1A] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <h4 className="text-lg font-semibold text-white">{day.name || day.title || `Día ${dayIndex + 1}`}</h4>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#CBFF00]/20 text-[#CBFF00]">
                  {day.type || 'ENTRENAMIENTO'}
                </span>
              </div>

              {day.exercises?.map((exercise, exerciseIndex) => (
                <div
                  key={exercise.id || exerciseIndex}
                  className="mb-3 rounded-lg border border-[#787878]/20 bg-[#2D2D2D] p-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h5 className="text-sm font-semibold text-white">{exercise.name}</h5>
                      {exercise.notes && (
                        <p className="text-xs text-[#C9C9C9] whitespace-pre-line mt-1">
                          {exercise.notes}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-[#C9C9C9] md:grid-cols-5 md:text-sm">
                      <span><span className="text-[#787878]">Series:</span> {exercise.sets ?? exercise.series ?? '-'}</span>
                      <span><span className="text-[#787878]">Reps:</span> {exercise.reps || '-'}</span>
                      <span><span className="text-[#787878]">Desc.:</span> {exercise.rest || '-'}</span>
                      <span><span className="text-[#787878]">RIR:</span> {exercise.rir ?? '-'}</span>
                      <span><span className="text-[#787878]">Tempo:</span> {exercise.tempo || '-'}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-[#787878]">
                    {exercise.video ? (
                      <a
                        href={exercise.video}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#CBFF00] font-semibold hover:underline"
                      >
                        Ver
                      </a>
                    ) : (
                      <span>Sin video</span>
                    )}
                    {exercise.tempo && (
                      <span className="hidden md:inline">Tempo {exercise.tempo}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

