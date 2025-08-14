import React, { useState } from 'react';
import { ChevronDown, Target, User, Calendar } from 'lucide-react';

function RoutineSelector({ onSelect }) {
  const [formData, setFormData] = useState({
    objective: '',
    gender: '',
    frequency: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.objective) newErrors.objective = 'Por favor selecciona tu objetivo de entrenamiento';
    if (!formData.gender) newErrors.gender = 'Por favor selecciona tu género';
    if (!formData.frequency) newErrors.frequency = 'Por favor selecciona tu frecuencia semanal';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSelect(formData);
    }
  };

  const CustomSelect = ({ id, icon: Icon, label, value, options, onChange, error, placeholder }) => (
    <div className="space-y-2">
      <label htmlFor={id} className="flex items-center space-x-2 text-sm font-medium text-[#787878]">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-[#2D2D2D] border ${error ? 'border-red-500' : 'border-[#787878]/30'} rounded-xl px-4 py-4 text-white appearance-none cursor-pointer hover:border-[#CBFF00]/50 focus:border-[#CBFF00] focus:outline-none transition-colors`}
        >
          <option value="">{placeholder}</option>
          {options.map(option => (
            <option key={option.value} value={option.value} className="bg-[#2D2D2D]">
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#787878] pointer-events-none" />
      </div>
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}


    </div>
  );

  const objectiveOptions = [
    { value: 'fat_loss', label: 'Pérdida de grasa / recomposición' },
    { value: 'hypertrophy', label: 'Hipertrofia (ganancia muscular)' },
    { value: 'strength', label: 'Fuerza pura / Powerlifting básico' },
    { value: 'power', label: 'Potencia / Atletas' },
    { value: 'functional', label: 'Entrenamiento funcional / calistenia' },
    { value: 'hybrid', label: 'Entrenamiento híbrido (fuerza + resistencia)' },
    { value: 'swimmers', label: 'Preparación física – Nadadores (alto rendimiento)' }
  ];

  const genderOptions = [
    { value: 'male', label: 'Masculino' },
    { value: 'female', label: 'Femenino' }
  ];

  const frequencyOptions = [
    { value: '3', label: '3 días por semana' },
    { value: '4', label: '4 días por semana' },
    { value: '5', label: '5 días por semana' }
  ];

  return (
    <section className="max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">
          Armemos tu
          <span className="block text-[#CBFF00]">Rutina Perfecta</span>
        </h2>
        <p className="text-[#787878] text-lg">
          Respondé algunas preguntas para obtener un plan de entrenamiento personalizado adaptado a tus objetivos
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#2D2D2D] rounded-2xl p-8 border border-[#787878]/20">
        <div className="space-y-8">
          <CustomSelect
            id="objective"
            icon={Target}
            label="¿Cuál es tu objetivo principal de entrenamiento?"
            value={formData.objective}
            options={objectiveOptions}
            onChange={(value) => handleInputChange('objective', value)}
            error={errors.objective}
            placeholder="Seleccioná tu objetivo"
          />

          <CustomSelect
            id="gender"
            icon={User}
            label="Género"
            value={formData.gender}
            options={genderOptions}
            onChange={(value) => handleInputChange('gender', value)}
            error={errors.gender}
            placeholder="Seleccioná tu género"
          />

          <CustomSelect
            id="frequency"
            icon={Calendar}
            label="¿Cuántos días por semana podés entrenar?"
            value={formData.frequency}
            options={frequencyOptions}
            onChange={(value) => handleInputChange('frequency', value)}
            error={errors.frequency}
            placeholder="Seleccioná tu frecuencia"
          />

          <button
            type="submit"
            className="w-full bg-[#CBFF00] hover:bg-[#DBFE52] text-[#2D2D2D] font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#CBFF00]/30"
          >
            Crear mi plan ahora
          </button>
        </div>
      </form>
    </section>
  );
}

export default RoutineSelector;