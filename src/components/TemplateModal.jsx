import React, { useState } from 'react';
import { X, Plus, Trash2, Save, Eye } from 'lucide-react';

function TemplateModal({ isOpen, onClose, template = null, onSave }) {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    gender: template?.gender || '',
    frequency: template?.frequency || '',
    objective: template?.objective || '',
    notes: template?.notes || '',
    youtubeLink: template?.youtubeLink || '',
    exercises: template?.exercises || [{ name: '', sets: '', reps: '', notes: '' }]
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
      exercises: [...prev.exercises, { name: '', sets: '', reps: '', notes: '' }]
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
      frequency: parseInt(formData.frequency)
    };
    onSave(templateData);
    onClose();
  };

  if (showPreview) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-[#2D2D2D] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-[#787878]/20 flex justify-between items-center">
            <h3 className="text-2xl font-bold">Template Preview</h3>
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
      <div className="bg-[#2D2D2D] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[#787878]/20 flex justify-between items-center">
          <h3 className="text-2xl font-bold">
            {template ? 'Edit Template' : 'Create New Template'}
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
                Template Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full bg-[#202020] border border-[#787878]/30 rounded-xl px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                placeholder="e.g., Male Volume 3x/week"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#787878] mb-2">
                YouTube Link
              </label>
              <input
                type="url"
                value={formData.youtubeLink}
                onChange={(e) => handleInputChange('youtubeLink', e.target.value)}
                className="w-full bg-[#202020] border border-[#787878]/30 rounded-xl px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#787878] mb-2">
                Gender
              </label>
              <select
                required
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full bg-[#202020] border border-[#787878]/30 rounded-xl px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#787878] mb-2">
                Frequency (days/week)
              </label>
              <select
                required
                value={formData.frequency}
                onChange={(e) => handleInputChange('frequency', e.target.value)}
                className="w-full bg-[#202020] border border-[#787878]/30 rounded-xl px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
              >
                <option value="">Select Frequency</option>
                <option value="2">2 days/week</option>
                <option value="3">3 days/week</option>
                <option value="5">5 days/week</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#787878] mb-2">
                Objective
              </label>
              <select
                required
                value={formData.objective}
                onChange={(e) => handleInputChange('objective', e.target.value)}
                className="w-full bg-[#202020] border border-[#787878]/30 rounded-xl px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
              >
                <option value="">Select Objective</option>
                <option value="volume">Volume (Muscle Building)</option>
                <option value="fat_loss">Fat Loss</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#787878] mb-2">
              Notes & Instructions
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full bg-[#202020] border border-[#787878]/30 rounded-xl px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors resize-none"
              placeholder="Add training notes, rest periods, progression tips..."
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-medium text-[#787878]">
                Exercises
              </label>
              <button
                type="button"
                onClick={addExercise}
                className="bg-[#CBFF00] hover:bg-[#DBFE52] text-[#2D2D2D] px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Exercise</span>
              </button>
            </div>

            <div className="space-y-4 max-h-64 overflow-y-auto">
              {formData.exercises.map((exercise, index) => (
                <div key={index} className="bg-[#202020] rounded-xl p-4 border border-[#787878]/20">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[#CBFF00] font-medium">Exercise {index + 1}</span>
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
                  
                  <div className="grid md:grid-cols-4 gap-3">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        required
                        value={exercise.name}
                        onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                        className="w-full bg-[#2D2D2D] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                        placeholder="Exercise name"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        value={exercise.sets}
                        onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                        className="w-full bg-[#2D2D2D] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                        placeholder="Sets"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        value={exercise.reps}
                        onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                        className="w-full bg-[#2D2D2D] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                        placeholder="Reps"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <input
                      type="text"
                      value={exercise.notes}
                      onChange={(e) => handleExerciseChange(index, 'notes', e.target.value)}
                      className="w-full bg-[#2D2D2D] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                      placeholder="Exercise notes (optional)"
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
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#CBFF00] hover:bg-[#DBFE52] text-[#2D2D2D] rounded-xl font-medium flex items-center space-x-2 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{template ? 'Update Template' : 'Create Template'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TemplatePreview({ template }) {
  return (
    <div className="bg-[#202020] rounded-xl p-6 border border-[#787878]/20">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-[#CBFF00] mb-2">{template.name}</h2>
        <div className="flex justify-center space-x-4 text-sm">
          <span className="bg-[#787878]/20 px-3 py-1 rounded-full capitalize">
            {template.gender}
          </span>
          <span className="bg-[#787878]/20 px-3 py-1 rounded-full">
            {template.frequency} days/week
          </span>
          <span className="bg-[#787878]/20 px-3 py-1 rounded-full capitalize">
            {template.objective?.replace('_', ' ')}
          </span>
        </div>
      </div>

      {template.notes && (
        <div className="mb-6 p-4 bg-[#CBFF00]/10 border border-[#CBFF00]/20 rounded-lg">
          <h3 className="font-semibold text-[#CBFF00] mb-2">Training Notes</h3>
          <p className="text-[#787878]">{template.notes}</p>
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-semibold text-[#CBFF00] mb-4">Exercise Program</h3>
        <div className="space-y-3">
          {template.exercises.map((exercise, index) => (
            <div key={index} className="bg-[#2D2D2D] rounded-lg p-4 border border-[#787878]/20">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-white">{exercise.name}</h4>
                <span className="text-[#CBFF00] font-bold">
                  {exercise.sets} × {exercise.reps}
                </span>
              </div>
              {exercise.notes && (
                <p className="text-sm text-[#787878]">{exercise.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {template.youtubeLink && (
        <div className="text-center">
          <a
            href={template.youtubeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-[#DBFE52]/20 hover:bg-[#DBFE52]/30 text-[#DBFE52] px-4 py-2 rounded-lg transition-colors"
          >
            <span>📹 Watch Exercise Videos</span>
          </a>
        </div>
      )}
    </div>
  );
}

export default TemplateModal;