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
    if (!formData.objective) newErrors.objective = 'Please select your fitness objective';
    if (!formData.gender) newErrors.gender = 'Please select your gender';
    if (!formData.frequency) newErrors.frequency = 'Please select your weekly frequency';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSelect(formData);
    }
  };

  const CustomSelect = ({ icon: Icon, label, value, options, onChange, error, placeholder }) => (
    <div className="space-y-2">
      <label className="flex items-center space-x-2 text-sm font-medium text-[#787878]">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </label>
      <div className="relative">
        <select
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
      }
    </div>
  );

  const objectiveOptions = [
    { value: 'volume', label: 'Muscle Building (Volume)' },
    { value: 'fat_loss', label: 'Fat Loss & Toning' }
  ];

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
  ];

  const frequencyOptions = [
    { value: '2', label: '2 days per week' },
    { value: '3', label: '3 days per week' },
    { value: '5', label: '5 days per week' }
  ];

  return (
    <section className="max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">
          Let's Build Your
          <span className="block text-[#CBFF00]">Perfect Routine</span>
        </h2>
        <p className="text-[#787878] text-lg">
          Answer a few questions to get a personalized fitness plan tailored to your goals
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#2D2D2D] rounded-2xl p-8 border border-[#787878]/20">
        <div className="space-y-8">
          <CustomSelect
            icon={Target}
            label="What's your primary fitness objective?"
            value={formData.objective}
            options={objectiveOptions}
            onChange={(value) => handleInputChange('objective', value)}
            error={errors.objective}
            placeholder="Select your goal"
          />

          <CustomSelect
            icon={User}
            label="Gender"
            value={formData.gender}
            options={genderOptions}
            onChange={(value) => handleInputChange('gender', value)}
            error={errors.gender}
            placeholder="Select your gender"
          />

          <CustomSelect
            icon={Calendar}
            label="How many days per week can you train?"
            value={formData.frequency}
            options={frequencyOptions}
            onChange={(value) => handleInputChange('frequency', value)}
            error={errors.frequency}
            placeholder="Select your frequency"
          />

          <button
            type="submit"
            className="w-full bg-[#CBFF00] hover:bg-[#DBFE52] text-[#2D2D2D] font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#CBFF00]/30"
          >
            Find My Perfect Routine
          </button>
        </div>
      </form>
    </section>
  );
}

export default RoutineSelector;