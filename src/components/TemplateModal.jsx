import React, { useState } from 'react';
import { X, Plus, Trash2, Save, Eye } from 'lucide-react';

function TemplateModal({ isOpen, onClose, template = null, onSave }) {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    gender: template?.gender || '',
    frequency: template?.frequency || '',
    objective: template?.objective || '',
    tags: template?.tags?.join(', ') || '',
    notes: template?.notes || '',
    exercises: template?.exercises || [{ name: '', sets: '', reps: '', rest: '', cadence: '', rir: '', youtubeLink: '', notes: '' }]
  });

  const [showPreview, setShowPreview] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...formData.exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setFormData(prev => ({ ...prev, exercises: newExercises }));
  };

  const addExercise = () => {
    setFormData(prev => ({
      ...prev,
      exercises: [...prev.exercises, { name: '', sets: '', reps: '', rest: '', cadence: '', rir: '', youtubeLink: '', notes: '' }]
    }));
  };

  const removeExercise = (index) => {
    if (formData.exercises.length > 1) {
      const newExercises = formData.exercises.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, exercises: newExercises }));
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
            <TemplatePreview template={formData} />
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
                <option value="2">2 días/semana</option>
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
                <option value="maintenance">Mantenimiento Corporal</option>
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

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-medium text-[#787878]">
                Ejercicios
              </label>
              <button
                type="button"
                onClick={addExercise}
                className="bg-[#CBFF00] hover:bg-[#DBFE52] text-[#2D2D2D] px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Agregar ejercicio</span>
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {formData.exercises.map((exercise, index) => (
                <div key={index} className="bg-[#202020] rounded-xl p-4 border border-[#787878]/20">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[#CBFF00] font-medium">Ejercicio {index + 1}</span>
                    {formData.exercises.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExercise(index)}
                        className="text-red-400 hover:text-red-300 p-1 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-7 gap-3">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        required
                        value={exercise.name}
                        onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                        className="w-full bg-[#2D2D2D] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                        placeholder="Nombre del ejercicio"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        value={exercise.sets}
                        onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                        className="w-full bg-[#2D2D2D] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                        placeholder="Series"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        value={exercise.reps}
                        onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                        className="w-full bg-[#2D2D2D] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                        placeholder="Repeticiones"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={exercise.rest}
                        onChange={(e) => handleExerciseChange(index, 'rest', e.target.value)}
                        className="w-full bg-[#2D2D2D] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                        placeholder="Descanso"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={exercise.cadence}
                        onChange={(e) => handleExerciseChange(index, 'cadence', e.target.value)}
                        className="w-full bg-[#2D2D2D] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                        placeholder="Cadencia"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={exercise.rir}
                        onChange={(e) => handleExerciseChange(index, 'rir', e.target.value)}
                        className="w-full bg-[#2D2D2D] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                        placeholder="RIR"
                      />
                    </div>
                  </div>

                  <div className="mt-3 grid md:grid-cols-2 gap-3">
                    <input
                      type="url"
                      value={exercise.youtubeLink}
                      onChange={(e) => handleExerciseChange(index, 'youtubeLink', e.target.value)}
                      className="w-full bg-[#2D2D2D] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                      placeholder="Enlace de YouTube"
                    />
                    <input
                      type="text"
                      value={exercise.notes}
                      onChange={(e) => handleExerciseChange(index, 'notes', e.target.value)}
                      className="w-full bg-[#2D2D2D] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                      placeholder="Notas del ejercicio (opcional)"
                    />
                  </div>
                </div>
              ))}
            </div>
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
  const objectiveLabel = { volume: 'volumen', fat_loss: 'pérdida de grasa', maintenance: 'mantenimiento corporal' };
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

      <div className="mb-6">
        <h3 className="font-semibold text-[#CBFF00] mb-4">Programa de Ejercicios</h3>
        <div className="space-y-3">
          {template.exercises.map((exercise, index) => (
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
                  <a href={exercise.youtubeLink} target="_blank" rel="noopener noreferrer" className="text-[#DBFE52] hover:text-[#CBFF00]">Ver video</a>
                </p>
              )}
              {exercise.notes && (
                <p className="text-sm text-[#787878]">{exercise.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TemplateModal;