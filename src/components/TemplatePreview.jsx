import React from 'react';

export default function TemplatePreview({ template }) {
  const genderLabel = { male: 'masculino', female: 'femenino' };
  const objectiveLabel = {
    fat_loss: 'pérdida de grasa',
    hypertrophy: 'hipertrofia',
    strength: 'fuerza',
    power: 'potencia',
    functional: 'funcional',
    hybrid: 'híbrido',
    swimmers: 'nadadores',
    volume: 'volumen'
  };
  return (
    <div className="bg-[#202020] rounded-xl p-6 border border-[#787878]/20">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#CBFF00] mb-2">{template.name}</h2>
        <div className="flex justify-center space-x-4 text-sm">
          <span className="bg-[#787878]/20 px-3 py-1 rounded-full capitalize">
            {genderLabel[template.gender]}
          </span>
          <span className="bg-[#787878]/20 px-3 py-1 rounded-full">
            {template.frequency} días/semana
          </span>
          <span className="bg-[#787878]/20 px-3 py-1 rounded-full capitalize">
            {objectiveLabel[template.objective]}
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

      {template.days &&
        template.days.map((day, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="font-semibold text-[#CBFF00] mb-4">
              {day.title || `Día ${idx + 1}`}
            </h3>

            {day.bloques.map((bloque, bIdx) => (
              <div key={bIdx} className="mb-4">
                {bloque.titulo && (
                  <h4 className="font-medium text-white mb-2">{bloque.titulo}</h4>
                )}
                <div className="space-y-3">
                  {bloque.items.map((exercise, eIdx) => (
                    <div
                      key={eIdx}
                      className="bg-[#2D2D2D] rounded-lg p-4 border border-[#787878]/20"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-white">
                          {exercise.ejercicio}
                        </h4>
                      </div>
                      {exercise.variantes.map((v, vIdx) => (
                        <div
                          key={vIdx}
                          className="grid grid-cols-5 gap-2 text-sm text-[#787878] mb-1"
                        >
                          <span>
                            <span className="text-white">Series:</span> {v.series || '-'}
                          </span>
                          <span>
                            <span className="text-white">Reps:</span> {v.reps || '-'}
                          </span>
                          <span>
                            <span className="text-white">Desc.:</span> {v.descanso || '-'}
                          </span>
                          <span>
                            <span className="text-white">Cad.:</span> {v.cadencia || '-'}
                          </span>
                          <span>
                            <span className="text-white">RIR:</span> {v.rir || '-'}
                          </span>
                        </div>
                      ))}
                      {exercise.notes && (
                        <p className="text-sm text-[#787878] whitespace-pre-line">{exercise.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}

