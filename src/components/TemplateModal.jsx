import React, { useState } from 'react';
import { X, Plus, Trash2, Save, Eye, Copy } from 'lucide-react';

function TemplateModal({ isOpen, onClose, template = null, onSave }) {
  const emptyExercise = {
    name: '',
    sets: '',
    reps: '',
    rest: '',
    cadence: '',
    rir: '',
    youtubeLink: '',
    notes: ''
  };

  const initializeDays = () => {
    if (template?.days) {
      return template.days.map((d, i) => ({
        title: d.title || `Día ${i + 1}`,
        warmup: d.warmup && d.warmup.length ? d.warmup : [{ ...emptyExercise }],
        exercises: d.exercises && d.exercises.length ? d.exercises : [{ ...emptyExercise }]
      }));
    }
    return [
      {
        title: 'Día 1',
        warmup: template?.warmup && template.warmup.length ? template.warmup : [{ ...emptyExercise }],
        exercises: template?.exercises && template.exercises.length ? template.exercises : [{ ...emptyExercise }]
      }
    ];
  };

  const [formData, setFormData] = useState({
    name: template?.name || '',
    gender: template?.gender || '',
    frequency: template?.frequency || '',
    objective: template?.objective || '',
    tags: template?.tags?.join(', ') || '',
    notes: template?.notes || '',
    days: initializeDays()
  });

  const [showPreview, setShowPreview] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDayChange = (index, field, value) => {
    const newDays = [...formData.days];
    newDays[index] = { ...newDays[index], [field]: value };
    setFormData(prev => ({ ...prev, days: newDays }));
  };

  const addDay = () => {
    setFormData(prev => ({
      ...prev,
      days: [
        ...prev.days,
        {
          title: `Día ${prev.days.length + 1}`,
          warmup: [{ ...emptyExercise }],
          exercises: [{ ...emptyExercise }]
        }
      ]
    }));
  };

  const duplicateDay = (index) => {
    const day = formData.days[index];
    const copy = {
      title: `${day.title} (copia)`,
      warmup: day.warmup.map(ex => ({ ...ex })),
      exercises: day.exercises.map(ex => ({ ...ex }))
    };
    const newDays = [...formData.days];
    newDays.splice(index + 1, 0, copy);
    setFormData(prev => ({ ...prev, days: newDays }));
  };

  const removeDay = (index) => {
    if (formData.days.length > 1) {
      const newDays = formData.days.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, days: newDays }));
    }
  };

  const handleWarmupChange = (dayIndex, exIndex, field, value) => {
    const newDays = [...formData.days];
    const newWarmup = [...newDays[dayIndex].warmup];
    newWarmup[exIndex] = { ...newWarmup[exIndex], [field]: value };
    newDays[dayIndex] = { ...newDays[dayIndex], warmup: newWarmup };
    setFormData(prev => ({ ...prev, days: newDays }));
  };

  const addWarmup = (dayIndex) => {
    const newDays = [...formData.days];
    newDays[dayIndex].warmup.push({ ...emptyExercise });
    setFormData(prev => ({ ...prev, days: newDays }));
  };

  const duplicateWarmup = (dayIndex, exIndex) => {
    const newDays = [...formData.days];
    const ex = { ...newDays[dayIndex].warmup[exIndex] };
    newDays[dayIndex].warmup.splice(exIndex + 1, 0, ex);
    setFormData(prev => ({ ...prev, days: newDays }));
  };

  const removeWarmup = (dayIndex, exIndex) => {
    const newDays = [...formData.days];
    if (newDays[dayIndex].warmup.length > 1) {
      newDays[dayIndex].warmup = newDays[dayIndex].warmup.filter((_, i) => i !== exIndex);
      setFormData(prev => ({ ...prev, days: newDays }));
    }
  };

  const handleExerciseChange = (dayIndex, exIndex, field, value) => {
    const newDays = [...formData.days];
    const newExercises = [...newDays[dayIndex].exercises];
    newExercises[exIndex] = { ...newExercises[exIndex], [field]: value };
    newDays[dayIndex] = { ...newDays[dayIndex], exercises: newExercises };
    setFormData(prev => ({ ...prev, days: newDays }));
  };

  const addExercise = (dayIndex) => {
    const newDays = [...formData.days];
    newDays[dayIndex].exercises.push({ ...emptyExercise });
    setFormData(prev => ({ ...prev, days: newDays }));
  };

  const duplicateExercise = (dayIndex, exIndex) => {
    const newDays = [...formData.days];
    const ex = { ...newDays[dayIndex].exercises[exIndex] };
    newDays[dayIndex].exercises.splice(exIndex + 1, 0, ex);
    setFormData(prev => ({ ...prev, days: newDays }));
  };

  const removeExercise = (dayIndex, exIndex) => {
    const newDays = [...formData.days];
    if (newDays[dayIndex].exercises.length > 1) {
      newDays[dayIndex].exercises = newDays[dayIndex].exercises.filter((_, i) => i !== exIndex);
      setFormData(prev => ({ ...prev, days: newDays }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const templateData = {
      ...formData,
      id: template?.id || Date.now(),
      frequency: parseInt(formData.frequency),
      tags: formData.tags
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(Boolean)
    };
    onSave(templateData);
    onClose();
  };

  if (showPreview) {
    const previewData = {
      ...formData,
      tags: formData.tags
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(Boolean)
    };

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-[#2D2D2D] rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-[#787878]/20 flex justify-between items-center">
            <h3 className="text-2xl font-bold">Vista previa de la plantilla</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowPreview(false)}
                className="bg-[#787878]/20 hover:bg-[#787878]/30 p-2 rounded-lg transition-colors"
              >
                <Eye className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="bg-[#787878]/20 hover:bg-[#787878]/30 p-2 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <TemplatePreview template={previewData} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2D2D2D] rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[#787878]/20 flex justify-between items-center">
          <h3 className="text-2xl font-bold">
            {template ? 'Editar Plantilla' : 'Crear Nueva Plantilla'}
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowPreview(true)}
              className="bg-[#CBFF00]/20 hover:bg-[#CBFF00]/30 text-[#CBFF00] p-2 rounded-lg transition-colors"
            >
              <Eye className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="bg-[#787878]/20 hover:bg-[#787878]/30 p-2 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#787878] mb-2">
                Nombre de la plantilla
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full bg-[#202020] border border-[#787878]/30 rounded-xl px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                placeholder="ej., Masculino Volumen 3x/semana"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#787878] mb-2">
                Género
              </label>
              <select
                required
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full bg-[#202020] border border-[#787878]/30 rounded-xl px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
              >
                <option value="">Selecciona género</option>
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#787878] mb-2">
                Frecuencia (días/semana)
              </label>
              <select
                required
                value={formData.frequency}
                onChange={(e) => handleInputChange('frequency', e.target.value)}
                className="w-full bg-[#202020] border border-[#787878]/30 rounded-xl px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
              >
                <option value="">Selecciona frecuencia</option>
                <option value="3">3 días/semana</option>
                <option value="4">4 días/semana</option>
                <option value="5">5 días/semana</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#787878] mb-2">
                Objetivo
              </label>
              <select
                required
                value={formData.objective}
                onChange={(e) => handleInputChange('objective', e.target.value)}
                className="w-full bg-[#202020] border border-[#787878]/30 rounded-xl px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
              >
                <option value="">Selecciona objetivo</option>
                <option value="volume">Volumen (Ganancia Muscular)</option>
                <option value="fat_loss">Pérdida de Grasa</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#787878] mb-2">
              Tags (separados por coma)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              className="w-full bg-[#202020] border border-[#787878]/30 rounded-xl px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
              placeholder="ej., fuerza, piernas, torso"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#787878] mb-2">
              Notas e instrucciones
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full bg-[#202020] border border-[#787878]/30 rounded-xl px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors resize-none"
              placeholder="Agrega notas de entrenamiento, tiempos de descanso, consejos de progresión..."
            />
          </div>

          {formData.days.map((day, dayIndex) => (
            <div key={dayIndex} className="bg-[#202020] rounded-xl p-4 border border-[#787878]/20 mb-6">
              <div className="flex justify-between items-center mb-4">
                <input
                  type="text"
                  value={day.title}
                  onChange={(e) => handleDayChange(dayIndex, 'title', e.target.value)}
                  className="w-full bg-[#2D2D2D] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors mr-2"
                  placeholder={`Día ${dayIndex + 1} - título`}
                />
                <div className="flex space-x-1">
                  <button
                    type="button"
                    onClick={() => duplicateDay(dayIndex)}
                    className="text-[#CBFF00] hover:text-[#DBFE52] p-2 rounded-lg transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  {formData.days.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDay(dayIndex)}
                      className="text-red-400 hover:text-red-300 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-medium text-[#787878]">Entrada en calor</label>
                  <button
                    type="button"
                    onClick={() => addWarmup(dayIndex)}
                    className="bg-[#CBFF00] hover:bg-[#DBFE52] text-[#2D2D2D] px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Agregar ejercicio</span>
                  </button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {day.warmup.map((exercise, index) => (
                    <div key={index} className="bg-[#2D2D2D] rounded-xl p-4 border border-[#787878]/20">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[#CBFF00] font-medium">Ejercicio {index + 1}</span>
                        <div className="flex space-x-1">
                          <button
                            type="button"
                            onClick={() => duplicateWarmup(dayIndex, index)}
                            className="text-[#CBFF00] hover:text-[#DBFE52] p-1 transition-colors"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          {day.warmup.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeWarmup(dayIndex, index)}
                              className="text-red-400 hover:text-red-300 p-1 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-7 gap-3">
                        <div className="md:col-span-2">
                          <input
                            type="text"

                            value={exercise.name}
                            onChange={(e) => handleWarmupChange(dayIndex, index, 'name', e.target.value)}
                            className="w-full bg-[#202020] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                            placeholder="Nombre del ejercicio"
                          />
                        </div>
                        <div>
                          <input
                            type="text"

                            value={exercise.sets}
                            onChange={(e) => handleWarmupChange(dayIndex, index, 'sets', e.target.value)}
                            className="w-full bg-[#202020] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                            placeholder="Series"
                          />
                        </div>
                        <div>
                          <input
                            type="text"

                            value={exercise.reps}
                            onChange={(e) => handleWarmupChange(dayIndex, index, 'reps', e.target.value)}
                            className="w-full bg-[#202020] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                            placeholder="Repeticiones"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={exercise.rest}
                            onChange={(e) => handleWarmupChange(dayIndex, index, 'rest', e.target.value)}
                            className="w-full bg-[#202020] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                            placeholder="Descanso"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={exercise.cadence}
                            onChange={(e) => handleWarmupChange(dayIndex, index, 'cadence', e.target.value)}
                            className="w-full bg-[#202020] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                            placeholder="Cadencia"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={exercise.rir}
                            onChange={(e) => handleWarmupChange(dayIndex, index, 'rir', e.target.value)}
                            className="w-full bg-[#202020] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                            placeholder="RIR"
                          />
                        </div>
                      </div>

                      <div className="mt-3 grid md:grid-cols-2 gap-3">
                        <input
                          type="url"
                          value={exercise.youtubeLink}
                          onChange={(e) => handleWarmupChange(dayIndex, index, 'youtubeLink', e.target.value)}
                          className="w-full bg-[#202020] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                          placeholder="Enlace de YouTube"
                        />
                        <input
                          type="text"
                          value={exercise.notes}
                          onChange={(e) => handleWarmupChange(dayIndex, index, 'notes', e.target.value)}
                          className="w-full bg-[#202020] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                          placeholder="Notas del ejercicio (opcional)"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-medium text-[#787878]">Ejercicios</label>
                  <button
                    type="button"
                    onClick={() => addExercise(dayIndex)}
                    className="bg-[#CBFF00] hover:bg-[#DBFE52] text-[#2D2D2D] px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Agregar ejercicio</span>
                  </button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {day.exercises.map((exercise, index) => (
                    <div key={index} className="bg-[#2D2D2D] rounded-xl p-4 border border-[#787878]/20">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[#CBFF00] font-medium">Ejercicio {index + 1}</span>
                        <div className="flex space-x-1">
                          <button
                            type="button"
                            onClick={() => duplicateExercise(dayIndex, index)}
                            className="text-[#CBFF00] hover:text-[#DBFE52] p-1 transition-colors"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          {day.exercises.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeExercise(dayIndex, index)}
                              className="text-red-400 hover:text-red-300 p-1 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-7 gap-3">
                        <div className="md:col-span-2">
                          <input
                            type="text"

                            value={exercise.name}
                            onChange={(e) => handleExerciseChange(dayIndex, index, 'name', e.target.value)}
                            className="w-full bg-[#202020] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                            placeholder="Nombre del ejercicio"
                          />
                        </div>
                        <div>
                          <input
                            type="text"

                            value={exercise.sets}
                            onChange={(e) => handleExerciseChange(dayIndex, index, 'sets', e.target.value)}
                            className="w-full bg-[#202020] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                            placeholder="Series"
                          />
                        </div>
                        <div>
                          <input
                            type="text"

                            value={exercise.reps}
                            onChange={(e) => handleExerciseChange(dayIndex, index, 'reps', e.target.value)}
                            className="w-full bg-[#202020] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                            placeholder="Repeticiones"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={exercise.rest}
                            onChange={(e) => handleExerciseChange(dayIndex, index, 'rest', e.target.value)}
                            className="w-full bg-[#202020] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                            placeholder="Descanso"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={exercise.cadence}
                            onChange={(e) => handleExerciseChange(dayIndex, index, 'cadence', e.target.value)}
                            className="w-full bg-[#202020] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                            placeholder="Cadencia"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={exercise.rir}
                            onChange={(e) => handleExerciseChange(dayIndex, index, 'rir', e.target.value)}
                            className="w-full bg-[#202020] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                            placeholder="RIR"
                          />
                        </div>
                      </div>

                      <div className="mt-3 grid md:grid-cols-2 gap-3">
                        <input
                          type="url"
                          value={exercise.youtubeLink}
                          onChange={(e) => handleExerciseChange(dayIndex, index, 'youtubeLink', e.target.value)}
                          className="w-full bg-[#202020] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                          placeholder="Enlace de YouTube"
                        />
                        <input
                          type="text"
                          value={exercise.notes}
                          onChange={(e) => handleExerciseChange(dayIndex, index, 'notes', e.target.value)}
                          className="w-full bg-[#202020] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                          placeholder="Notas del ejercicio (opcional)"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="mb-6">
            <button
              type="button"
              onClick={addDay}
              className="bg-[#CBFF00] hover:bg-[#DBFE52] text-[#2D2D2D] px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Agregar día</span>
            </button>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-[#787878]/20">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-[#787878]/20 hover:bg-[#787878]/30 rounded-xl font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#CBFF00] hover:bg-[#DBFE52] text-[#2D2D2D] rounded-xl font-medium flex items-center space-x-2 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{template ? 'Actualizar Plantilla' : 'Crear Plantilla'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TemplatePreview({ template }) {
  const genderLabel = { male: 'masculino', female: 'femenino' };
const objectiveLabel = { volume: 'volumen', fat_loss: 'pérdida de grasa' };
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
          <p className="text-[#787878]">{template.notes}</p>
        </div>
      )}

      {template.days &&
        template.days.map((day, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="font-semibold text-[#CBFF00] mb-4">
              {day.title || `Día ${idx + 1}`}
            </h3>

            {day.warmup && day.warmup.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-white mb-2">Entrada en calor</h4>
                <div className="space-y-3">
                  {day.warmup.map((exercise, index) => (
                    <div key={index} className="bg-[#2D2D2D] rounded-lg p-4 border border-[#787878]/20">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-white">{exercise.name}</h4>
                        <span className="text-[#CBFF00] font-bold">
                          {exercise.sets} × {exercise.reps}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm text-[#787878] mb-2">
                        {exercise.rest && <span><span className="text-white">Descanso:</span> {exercise.rest}</span>}
                        {exercise.cadence && <span><span className="text-white">Cadencia:</span> {exercise.cadence}</span>}
                        {exercise.rir && <span><span className="text-white">RIR:</span> {exercise.rir}</span>}
                      </div>
                      {exercise.youtubeLink && (
                        <p className="mb-2 text-sm">
                          <a
                            href={exercise.youtubeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#DBFE52] hover:text-[#CBFF00]"
                          >
                            Ver video
                          </a>
                        </p>
                      )}
                      {exercise.notes && (
                        <p className="text-sm text-[#787878]">{exercise.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {day.exercises && day.exercises.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-white mb-2">Entrenamiento</h4>
                <div className="space-y-3">
                  {day.exercises.map((exercise, index) => (
                    <div key={index} className="bg-[#2D2D2D] rounded-lg p-4 border border-[#787878]/20">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-white">{exercise.name}</h4>
                        <span className="text-[#CBFF00] font-bold">
                          {exercise.sets} × {exercise.reps}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm text-[#787878] mb-2">
                        {exercise.rest && <span><span className="text-white">Descanso:</span> {exercise.rest}</span>}
                        {exercise.cadence && <span><span className="text-white">Cadencia:</span> {exercise.cadence}</span>}
                        {exercise.rir && <span><span className="text-white">RIR:</span> {exercise.rir}</span>}
                      </div>
                      {exercise.youtubeLink && (
                        <p className="mb-2 text-sm">
                          <a
                            href={exercise.youtubeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#DBFE52] hover:text-[#CBFF00]"
                          >
                            Ver video
                          </a>
                        </p>
                      )}
                      {exercise.notes && (
                        <p className="text-sm text-[#787878]">{exercise.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}

export default TemplateModal;
