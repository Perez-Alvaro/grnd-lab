import React, { useState } from 'react';
import { X, Plus, Trash2, Save, Eye, Copy } from 'lucide-react';
import TemplatePreview from './TemplatePreview.jsx';
import migrateTemplate from '../utils/migrateTemplate.ts';

const emptyVariant = {
  series: '',
  reps: '',
  descanso: '',
  cadencia: '',
  rir: ''
};

const emptyExercise = {
  ejercicio: '',
  variantes: [{ ...emptyVariant }],
  videoUrl: '',
  notes: ''
};

const emptyBlock = {
  titulo: 'Entrenamiento',
  tipo: 'normal',
  color: '',
  items: [{ ...emptyExercise }]
};

function TemplateModal({ isOpen, onClose, template = null, onSave }) {
  const migrated = migrateTemplate(template);

  const [formData, setFormData] = useState({
    name: migrated?.name || '',
    gender: migrated?.gender || '',
    frequency: migrated?.frequency || '',
    objective: migrated?.objective || '',
    tags: migrated?.tags?.join(', ') || '',
    notes: migrated?.notes || '',
    days: migrated?.days || [{ title: 'Día 1', bloques: [{ ...emptyBlock }] }]
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
      days: [...prev.days, { title: `Día ${prev.days.length + 1}`, bloques: [{ ...emptyBlock }] }]
    }));
  };

  const duplicateDay = index => {
    const day = formData.days[index];
    const copy = JSON.parse(JSON.stringify(day));
    copy.title = `${day.title} (copia)`;
    const newDays = [...formData.days];
    newDays.splice(index + 1, 0, copy);
    setFormData(prev => ({ ...prev, days: newDays }));
  };

  const removeDay = index => {
    if (formData.days.length > 1) {
      setFormData(prev => ({ ...prev, days: prev.days.filter((_, i) => i !== index) }));
    }
  };

  const handleBlockChange = (dayIndex, blockIndex, field, value) => {
    const newDays = [...formData.days];
    const blocks = [...newDays[dayIndex].bloques];
    blocks[blockIndex] = { ...blocks[blockIndex], [field]: value };
    newDays[dayIndex] = { ...newDays[dayIndex], bloques: blocks };
    setFormData(prev => ({ ...prev, days: newDays }));
  };

  const addBlock = dayIndex => {
    const newDays = [...formData.days];
    newDays[dayIndex].bloques.push(JSON.parse(JSON.stringify(emptyBlock)));
    setFormData(prev => ({ ...prev, days: newDays }));
  };

  const duplicateBlock = (dayIndex, blockIndex) => {
    const newDays = [...formData.days];
    const block = JSON.parse(JSON.stringify(newDays[dayIndex].bloques[blockIndex]));
    newDays[dayIndex].bloques.splice(blockIndex + 1, 0, block);
    setFormData(prev => ({ ...prev, days: newDays }));
  };

  const removeBlock = (dayIndex, blockIndex) => {
    const newDays = [...formData.days];
    if (newDays[dayIndex].bloques.length > 1) {
      newDays[dayIndex].bloques.splice(blockIndex, 1);
      setFormData(prev => ({ ...prev, days: newDays }));
    }
  };

  const handleItemChange = (dayIndex, blockIndex, itemIndex, field, value) => {
    const newDays = [...formData.days];
    const blocks = [...newDays[dayIndex].bloques];
    const items = [...blocks[blockIndex].items];
    items[itemIndex] = { ...items[itemIndex], [field]: value };
    blocks[blockIndex] = { ...blocks[blockIndex], items };
    newDays[dayIndex] = { ...newDays[dayIndex], bloques: blocks };
    setFormData(prev => ({ ...prev, days: newDays }));
  };

  const addItem = (dayIndex, blockIndex) => {
    const newDays = [...formData.days];
    newDays[dayIndex].bloques[blockIndex].items.push(JSON.parse(JSON.stringify(emptyExercise)));
    setFormData(prev => ({ ...prev, days: newDays }));
  };

  const duplicateItem = (dayIndex, blockIndex, itemIndex) => {
    const newDays = [...formData.days];
    const ex = JSON.parse(JSON.stringify(newDays[dayIndex].bloques[blockIndex].items[itemIndex]));
    newDays[dayIndex].bloques[blockIndex].items.splice(itemIndex + 1, 0, ex);
    setFormData(prev => ({ ...prev, days: newDays }));
  };

  const removeItem = (dayIndex, blockIndex, itemIndex) => {
    const newDays = [...formData.days];
    const block = newDays[dayIndex].bloques[blockIndex];
    if (block.items.length > 1) {
      block.items.splice(itemIndex, 1);
      setFormData(prev => ({ ...prev, days: newDays }));
    }
  };

  const handleVariantChange = (dayIndex, blockIndex, itemIndex, variantIndex, field, value) => {
    const newDays = [...formData.days];
    const block = newDays[dayIndex].bloques[blockIndex];
    const items = [...block.items];
    const variants = [...items[itemIndex].variantes];
    variants[variantIndex] = { ...variants[variantIndex], [field]: value };
    items[itemIndex] = { ...items[itemIndex], variantes: variants };
    block.items = items;
    setFormData(prev => ({ ...prev, days: newDays }));
  };

  const addVariant = (dayIndex, blockIndex, itemIndex) => {
    const newDays = [...formData.days];
    newDays[dayIndex].bloques[blockIndex].items[itemIndex].variantes.push({ ...emptyVariant });
    setFormData(prev => ({ ...prev, days: newDays }));
  };

  const duplicateVariant = (dayIndex, blockIndex, itemIndex, variantIndex) => {
    const newDays = [...formData.days];
    const variants = newDays[dayIndex].bloques[blockIndex].items[itemIndex].variantes;
    const v = { ...variants[variantIndex] };
    variants.splice(variantIndex + 1, 0, v);
    setFormData(prev => ({ ...prev, days: newDays }));
  };

  const removeVariant = (dayIndex, blockIndex, itemIndex, variantIndex) => {
    const newDays = [...formData.days];
    const variants = newDays[dayIndex].bloques[blockIndex].items[itemIndex].variantes;
    if (variants.length > 1) {
      variants.splice(variantIndex, 1);
      setFormData(prev => ({ ...prev, days: newDays }));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    const templateData = {
      ...formData,
      id: template?.id || Date.now(),
      frequency: parseInt(formData.frequency, 10),
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
                onChange={e => handleInputChange('name', e.target.value)}
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
                onChange={e => handleInputChange('gender', e.target.value)}
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
                onChange={e => handleInputChange('frequency', e.target.value)}
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
                onChange={e => handleInputChange('objective', e.target.value)}
                className="w-full bg-[#202020] border border-[#787878]/30 rounded-xl px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
              >
                <option value="">Selecciona objetivo</option>
                <option value="fat_loss">Pérdida de grasa / recomposición</option>
                <option value="hypertrophy">Hipertrofia (ganancia muscular)</option>
                <option value="strength">Fuerza pura / Powerlifting básico</option>
                <option value="power">Potencia / Atletas</option>
                <option value="functional">Entrenamiento funcional / calistenia</option>
                <option value="hybrid">Entrenamiento híbrido (fuerza + resistencia)</option>
                <option value="swimmers">Preparación física – Nadadores</option>
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
              onChange={e => handleInputChange('tags', e.target.value)}
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
              onChange={e => handleInputChange('notes', e.target.value)}
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
                  onChange={e => handleDayChange(dayIndex, 'title', e.target.value)}
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

              {day.bloques.map((bloque, blockIndex) => (
                <div key={blockIndex} className="mb-6 bg-[#2D2D2D] rounded-lg p-4 border border-[#787878]/20">
                  <div className="flex justify-between items-center mb-4">
                    <input
                      type="text"
                      value={bloque.titulo}
                      onChange={e => handleBlockChange(dayIndex, blockIndex, 'titulo', e.target.value)}
                      className="w-full bg-[#202020] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors mr-2"
                      placeholder="Título del bloque"
                    />
                    <select
                      value={bloque.tipo}
                      onChange={e => handleBlockChange(dayIndex, blockIndex, 'tipo', e.target.value)}
                      className="bg-[#202020] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors mr-2"
                    >
                      <option value="normal">normal</option>
                      <option value="superset">superset</option>
                      <option value="biserie">biserie</option>
                      <option value="circuito">circuito</option>
                      <option value="amrap">amrap</option>
                      <option value="emom">emom</option>
                    </select>
                    <div className="flex space-x-1">
                      <button
                        type="button"
                        onClick={() => duplicateBlock(dayIndex, blockIndex)}
                        className="text-[#CBFF00] hover:text-[#DBFE52] p-2 rounded-lg transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      {day.bloques.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBlock(dayIndex, blockIndex)}
                          className="text-red-400 hover:text-red-300 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {bloque.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="bg-[#202020] rounded-xl p-4 border border-[#787878]/20">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[#CBFF00] font-medium">Ejercicio {itemIndex + 1}</span>
                          <div className="flex space-x-1">
                            <button
                              type="button"
                              onClick={() => duplicateItem(dayIndex, blockIndex, itemIndex)}
                              className="text-[#CBFF00] hover:text-[#DBFE52] p-1 transition-colors"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            {bloque.items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeItem(dayIndex, blockIndex, itemIndex)}
                                className="text-red-400 hover:text-red-300 p-1 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-3 mb-3">
                          <input
                            type="text"
                            value={item.ejercicio}
                            onChange={e => handleItemChange(dayIndex, blockIndex, itemIndex, 'ejercicio', e.target.value)}
                            className="w-full bg-[#2D2D2D] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                            placeholder="Nombre del ejercicio"
                          />
                          <input
                            type="text"
                            value={item.videoUrl}
                            onChange={e => handleItemChange(dayIndex, blockIndex, itemIndex, 'videoUrl', e.target.value)}
                            className="w-full bg-[#2D2D2D] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                            placeholder="Link de video (YouTube)"
                          />
                          <textarea
                            value={item.notes}
                            onChange={e => handleItemChange(dayIndex, blockIndex, itemIndex, 'notes', e.target.value)}
                            className="w-full bg-[#2D2D2D] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors resize-none"
                            placeholder="Notas (opcional)"
                            rows={2}
                          />
                        </div>

                        <div className="space-y-2">
                          {item.variantes.map((variant, variantIndex) => (
                            <div key={variantIndex} className="grid md:grid-cols-6 gap-2 items-start">
                              <input
                                type="text"
                                value={variant.series}
                                onChange={e =>
                                  handleVariantChange(dayIndex, blockIndex, itemIndex, variantIndex, 'series', e.target.value)
                                }
                                placeholder="Series"
                                className="bg-[#2D2D2D] border border-[#787878]/30 rounded-lg px-2 py-1 text-white"
                              />
                              <input
                                type="text"
                                value={variant.reps}
                                onChange={e =>
                                  handleVariantChange(dayIndex, blockIndex, itemIndex, variantIndex, 'reps', e.target.value)
                                }
                                placeholder="Reps"
                                className="bg-[#2D2D2D] border border-[#787878]/30 rounded-lg px-2 py-1 text-white"
                              />
                              <input
                                type="text"
                                value={variant.descanso}
                                onChange={e =>
                                  handleVariantChange(dayIndex, blockIndex, itemIndex, variantIndex, 'descanso', e.target.value)
                                }
                                placeholder="Desc."
                                className="bg-[#2D2D2D] border border-[#787878]/30 rounded-lg px-2 py-1 text-white"
                              />
                              <input
                                type="text"
                                value={variant.cadencia}
                                onChange={e =>
                                  handleVariantChange(dayIndex, blockIndex, itemIndex, variantIndex, 'cadencia', e.target.value)
                                }
                                placeholder="Cad."
                                className="bg-[#2D2D2D] border border-[#787878]/30 rounded-lg px-2 py-1 text-white"
                              />
                              <input
                                type="text"
                                value={variant.rir}
                                onChange={e =>
                                  handleVariantChange(dayIndex, blockIndex, itemIndex, variantIndex, 'rir', e.target.value)
                                }
                                placeholder="RIR"
                                className="bg-[#2D2D2D] border border-[#787878]/30 rounded-lg px-2 py-1 text-white"
                              />
                              <div className="flex space-x-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    duplicateVariant(dayIndex, blockIndex, itemIndex, variantIndex)
                                  }
                                  className="text-[#CBFF00] hover:text-[#DBFE52] p-1 rounded transition-colors"
                                >
                                  <Copy className="h-4 w-4" />
                                </button>
                                {item.variantes.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeVariant(dayIndex, blockIndex, itemIndex, variantIndex)
                                    }
                                    className="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addVariant(dayIndex, blockIndex, itemIndex)}
                            className="mt-2 bg-[#CBFF00] hover:bg-[#DBFE52] text-[#2D2D2D] px-2 py-1 rounded-lg text-sm flex items-center space-x-1 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Agregar variante</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => addItem(dayIndex, blockIndex)}
                    className="mt-4 bg-[#CBFF00] hover:bg-[#DBFE52] text-[#2D2D2D] px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Agregar ejercicio</span>
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addBlock(dayIndex)}
                className="bg-[#CBFF00] hover:bg-[#DBFE52] text-[#2D2D2D] px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Agregar bloque</span>
              </button>
            </div>
          ))}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={addDay}
              className="bg-[#CBFF00] hover:bg-[#DBFE52] text-[#2D2D2D] px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Agregar día</span>
            </button>
            <button
              type="submit"
              className="bg-[#CBFF00] hover:bg-[#DBFE52] text-[#2D2D2D] px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Guardar plantilla</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TemplateModal;

