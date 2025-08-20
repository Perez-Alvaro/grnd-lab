
import React, { useState, useEffect, useCallback } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, Copy, ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext.jsx';
import TemplatePreview from '../components/TemplatePreview.jsx';
import EditorActionBar from '../components/editor/EditorActionBar.jsx';
import migrateTemplate from '../utils/migrateTemplate.ts';
import { generateRoutinePdf } from '../utils/pdf.jsx';
import { toast } from '../utils/toast.js';

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
  color: '',
  items: [{ ...emptyExercise }]
};

export default function TemplatesEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useAppContext();

  const existing = id ? state.templates.find(t => String(t.id) === String(id)) : null;
  const migrated = migrateTemplate(existing);
  const initialDays = migrated?.days || [{ title: 'Día 1', bloques: [{ ...emptyBlock }] }];

  const [formData, setFormData] = useState({
    name: migrated?.name || '',
    gender: migrated?.gender || '',
    frequency: migrated?.frequency || '',
    objective: migrated?.objective || '',
    tags: migrated?.tags?.join(', ') || '',
    notes: migrated?.notes || '',
    days: initialDays
  });
  const [dirty, setDirty] = useState(false);

  const draftKey = 'plantilla_draft';


  const [headerOpen, setHeaderOpen] = useState(
    JSON.parse(localStorage.getItem('fps-editor-header-open') ?? 'true')
  );

  useEffect(() => {
    localStorage.setItem('fps-editor-header-open', JSON.stringify(headerOpen));
  }, [headerOpen]);

  const [dayOpen, setDayOpen] = useState(() =>
    initialDays.map((_, index) => {
      const stored = localStorage.getItem(`fps-editor-day-${index}-open`);
      if (stored !== null) return JSON.parse(stored);
      return index === 0 ? true : (window.innerHeight < 800 ? false : true);
    })
  );

  useEffect(() => {
    dayOpen.forEach((open, idx) => {
      localStorage.setItem(`fps-editor-day-${idx}-open`, JSON.stringify(open));
    });
  }, [dayOpen]);

  useEffect(() => {
    const draft = localStorage.getItem(draftKey);
    if (draft) {
      if (window.confirm('¿Desea recuperar los cambios guardados?')) {
        setFormData(JSON.parse(draft));
      } else {
        localStorage.removeItem(draftKey);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleBeforeUnload = e => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [dirty]);


  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setDirty(true);
  };

  const handleDayChange = (index, field, value) => {
    const newDays = [...formData.days];
    newDays[index] = { ...newDays[index], [field]: value };
    setFormData(prev => ({ ...prev, days: newDays }));
    setDirty(true);
  };

  const addDay = () => {
    setFormData(prev => ({
      ...prev,
      days: [...prev.days, { title: `Día ${prev.days.length + 1}`, bloques: [{ ...emptyBlock }] }]
    }));
    setDayOpen(prev => [
      ...prev,
      window.innerHeight < 800 ? false : true
    ]);
    setDirty(true);
  };

  const duplicateDay = index => {
    const day = formData.days[index];
    const copy = JSON.parse(JSON.stringify(day));
    copy.title = `${day.title} (copia)`;
    const newDays = [...formData.days];
    newDays.splice(index + 1, 0, copy);
    setFormData(prev => ({ ...prev, days: newDays }));
    setDayOpen(prev => {
      const states = [...prev];
      states.splice(index + 1, 0, prev[index]);
      return states;
    });
    setDirty(true);
  };

  const removeDay = index => {
    if (formData.days.length > 1) {
      setFormData(prev => ({ ...prev, days: prev.days.filter((_, i) => i !== index) }));
      setDayOpen(prev => prev.filter((_, i) => i !== index));
      setDirty(true);
    }
  };

  const handleBlockChange = (dayIndex, blockIndex, field, value) => {
    const newDays = [...formData.days];
    const blocks = [...newDays[dayIndex].bloques];
    blocks[blockIndex] = { ...blocks[blockIndex], [field]: value };
    newDays[dayIndex] = { ...newDays[dayIndex], bloques: blocks };
    setFormData(prev => ({ ...prev, days: newDays }));
    setDirty(true);
  };

  const addBlock = dayIndex => {
    const newDays = [...formData.days];
    newDays[dayIndex].bloques.push(JSON.parse(JSON.stringify(emptyBlock)));
    setFormData(prev => ({ ...prev, days: newDays }));
    setDirty(true);
  };

  const duplicateBlock = (dayIndex, blockIndex) => {
    const newDays = [...formData.days];
    const block = JSON.parse(JSON.stringify(newDays[dayIndex].bloques[blockIndex]));
    newDays[dayIndex].bloques.splice(blockIndex + 1, 0, block);
    setFormData(prev => ({ ...prev, days: newDays }));
    setDirty(true);
  };

  const removeBlock = (dayIndex, blockIndex) => {
    const newDays = [...formData.days];
    if (newDays[dayIndex].bloques.length > 1) {
      newDays[dayIndex].bloques.splice(blockIndex, 1);
      setFormData(prev => ({ ...prev, days: newDays }));
      setDirty(true);
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
    setDirty(true);
  };

  const addItem = (dayIndex, blockIndex) => {
    const newDays = [...formData.days];
    newDays[dayIndex].bloques[blockIndex].items.push(JSON.parse(JSON.stringify(emptyExercise)));
    setFormData(prev => ({ ...prev, days: newDays }));
    setDirty(true);
  };

  const duplicateItem = (dayIndex, blockIndex, itemIndex) => {
    const newDays = [...formData.days];
    const ex = JSON.parse(JSON.stringify(newDays[dayIndex].bloques[blockIndex].items[itemIndex]));
    newDays[dayIndex].bloques[blockIndex].items.splice(itemIndex + 1, 0, ex);
    setFormData(prev => ({ ...prev, days: newDays }));
    setDirty(true);
  };

  const removeItem = (dayIndex, blockIndex, itemIndex) => {
    const newDays = [...formData.days];
    const block = newDays[dayIndex].bloques[blockIndex];
    if (block.items.length > 1) {
      block.items.splice(itemIndex, 1);
      setFormData(prev => ({ ...prev, days: newDays }));
      setDirty(true);
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
    setDirty(true);
  };

  const addVariant = (dayIndex, blockIndex, itemIndex) => {
    const newDays = [...formData.days];
    newDays[dayIndex].bloques[blockIndex].items[itemIndex].variantes.push({ ...emptyVariant });
    setFormData(prev => ({ ...prev, days: newDays }));
    setDirty(true);
  };

  const duplicateVariant = (dayIndex, blockIndex, itemIndex, variantIndex) => {
    const newDays = [...formData.days];
    const variants = newDays[dayIndex].bloques[blockIndex].items[itemIndex].variantes;
    const v = { ...variants[variantIndex] };
    variants.splice(variantIndex + 1, 0, v);
    setFormData(prev => ({ ...prev, days: newDays }));
    setDirty(true);
  };

  const removeVariant = (dayIndex, blockIndex, itemIndex, variantIndex) => {
    const newDays = [...formData.days];
    const variants = newDays[dayIndex].bloques[blockIndex].items[itemIndex].variantes;
    if (variants.length > 1) {
      variants.splice(variantIndex, 1);
      setFormData(prev => ({ ...prev, days: newDays }));
      setDirty(true);
    }
  };


  const handleSave = useCallback(() => {
    if (!dirty) return;
    localStorage.setItem(draftKey, JSON.stringify(formData));
    setDirty(false);
    toast.success('Cambios guardados temporalmente');
  }, [dirty, draftKey, formData]);


  const handlePdf = () => {
    const data = {
      planName: formData.name,
      objective: formData.objective,
      frecuencia: `${formData.frequency} días/semana`,
      dias: formData.days
    };
    generateRoutinePdf(data);
  };

  const handleBack = () => {
    if (dirty && !window.confirm('Hay cambios sin guardar. ¿Salir de todos modos?')) {
      return;
    }
    navigate('/admin');
  };

  useEffect(() => {
    const onKey = e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();

        if (dirty) {
          handleSave();

        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);

  }, [dirty, handleSave]);


  const previewData = {
    ...formData,
    tags: formData.tags
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean)
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 h-full">
        <div className="md:col-span-7 border-r border-[#787878]/20 h-[calc(100vh-4rem)] overflow-y-auto p-6">

          <form onSubmit={e => e.preventDefault()} className="space-y-6">

            <section className="rounded-lg border border-[#787878]/20 bg-[#202020]">
              <header className="flex items-center justify-between p-3">
                <h2 className="text-lg font-semibold">Datos de la plantilla</h2>
                <button
                  type="button"
                  aria-expanded={headerOpen}
                  onClick={() => setHeaderOpen(o => !o)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#CBFF00]"
                >
                  <ChevronDown className={`transition-transform ${headerOpen ? 'rotate-180' : ''}`} />
                  <span className="sr-only">{headerOpen ? 'Colapsar' : 'Expandir'} cabecera</span>
                </button>
              </header>

              <div
                className={`overflow-hidden transition-all duration-200 ${headerOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-3 space-y-6">
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
                </div>
              </div>
            </section>

            {formData.days.map((day, dayIndex) => (
              <section
                key={dayIndex}
                className="rounded-lg border border-[#787878]/20 bg-[#202020] mb-6"
              >
                <header className="flex items-center justify-between p-3">
                  <button
                    type="button"
                    className="flex items-center gap-2 text-left"
                    aria-expanded={dayOpen[dayIndex]}
                    onClick={() =>
                      setDayOpen(prev => {
                        const states = [...prev];
                        states[dayIndex] = !states[dayIndex];
                        return states;
                      })
                    }
                  >
                    <ChevronDown
                      className={`transition-transform ${
                        dayOpen[dayIndex] ? 'rotate-180' : ''
                      }`}
                    />
                    <span className="text-base font-semibold">
                      Día {dayIndex + 1}
                      {day.title ? ` – ${day.title}` : ''}
                    </span>
                  </button>
                  <div className="flex items-center gap-2">
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
                </header>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    dayOpen[dayIndex] ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-3">
                    <input
                      type="text"
                      value={day.title}
                      onChange={e => handleDayChange(dayIndex, 'title', e.target.value)}
                      className="mb-4 w-full bg-[#2D2D2D] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                      placeholder={`Día ${dayIndex + 1} - título`}
                    />
                    {day.bloques.map((bloque, blockIndex) => (
                      <div
                        key={blockIndex}
                        className="mb-6 bg-[#2D2D2D] rounded-lg p-4 border border-[#787878]/20"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <input
                            type="text"
                            value={bloque.titulo}
                            onChange={e =>
                              handleBlockChange(dayIndex, blockIndex, 'titulo', e.target.value)
                            }
                            className="w-full bg-[#202020] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors mr-2"
                            placeholder="Título del bloque"
                          />
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
                                  onChange={e =>
                                    handleItemChange(dayIndex, blockIndex, itemIndex, 'ejercicio', e.target.value)
                                  }
                                  className="w-full bg-[#2D2D2D] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                                  placeholder="Nombre del ejercicio"
                                />
                                <input
                                  type="text"
                                  value={item.videoUrl}
                                  onChange={e =>
                                    handleItemChange(dayIndex, blockIndex, itemIndex, 'videoUrl', e.target.value)
                                  }
                                  className="w-full bg-[#2D2D2D] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                                  placeholder="Link de video (YouTube)"
                                />
                                <textarea
                                  value={item.notes}
                                  onChange={e =>
                                    handleItemChange(dayIndex, blockIndex, itemIndex, 'notes', e.target.value)
                                  }
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
                                        className="text-[#CBFF00] hover:text-[#DBFE52] p-1 transition-colors"
                                      >
                                        <Copy className="h-4 w-4" />
                                      </button>
                                      {item.variantes.length > 1 && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            removeVariant(dayIndex, blockIndex, itemIndex, variantIndex)
                                          }
                                          className="text-red-400 hover:text-red-300 p-1 transition-colors"
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
                                  className="mt-2 text-sm flex items-center space-x-1 text-[#CBFF00] hover:text-[#DBFE52]"
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
                          className="mt-4 text-sm flex items-center space-x-1 text-[#CBFF00] hover:text-[#DBFE52]"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Agregar ejercicio</span>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addBlock(dayIndex)}
                      className="text-sm flex items-center space-x-1 text-[#CBFF00] hover:text-[#DBFE52]"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Agregar bloque</span>
                    </button>
                  </div>
                </div>
              </section>
            ))}

            <div className="flex justify-start">
              <button
                type="button"
                onClick={addDay}
                className="bg-[#CBFF00] hover:bg-[#DBFE52] text-[#2D2D2D] px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Agregar día</span>
              </button>
            </div>
        </form>
        </div>
        <div className="md:col-span-5 h-[calc(100vh-4rem)] overflow-y-auto p-6">
          <TemplatePreview template={previewData} />
        </div>
      </div>

        <EditorActionBar
          dirty={dirty}
          onSave={handleSave}
          onPdf={handlePdf}
          onBack={handleBack}
        />

    </>
  );
}

