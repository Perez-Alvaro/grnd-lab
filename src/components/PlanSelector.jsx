import React from 'react';
import { ArrowLeft, Check, Star, MessageCircle, Crown } from 'lucide-react';

function PlanSelector({ routine, onSelect, onBack }) {
  const plans = [
    {
      id: 'basic',
      name: 'Plan Básico',
      price: 20000,
      description: 'Ideal para iniciar tu cambio físico',
      features: [
        'Rutina de entrenamiento personalizada',
        'Instrucciones de ejercicios y consejos de técnica',
        'Descarga en PDF con la rutina completa',
        'Demostraciones en video de YouTube',
        'Entrega por email en minutos'
      ],
      popular: false,
      buttonText: 'Obtener Plan Básico',
      buttonClass: 'bg-[#787878] hover:bg-[#787878]/80'
    },
    {
      id: 'premium',
      name: 'Plan Premium',
      price: 25000,
      description: 'Rutina a medida con soporte personalizado',
      features: [
        'Todo en el Plan Básico',
        'Modificaciones personalizadas de la rutina',
        'Contacto directo con Matías',
        'Soporte y guía por grupo de WhatsApp',
        'Recomendaciones de nutrición',
        
      ],
      popular: true,
      buttonText: 'Obtener Plan Premium',
      buttonClass: 'bg-[#CBFF00] hover:bg-[#DBFE52] text-[#2D2D2D]'
    }
  ];

  const routinePreview = {
    male: {
      volume: { title: 'Programa de Ganancia Muscular', focus: 'Fuerza y Masa' },
      fat_loss: { title: 'Programa Masculino de Pérdida de Grasa', focus: 'Definido y Fuerte' },
      maintenance: { title: 'Programa Masculino de Mantenimiento', focus: 'Mantén tu estado físico' }
    },
    female: {
      volume: { title: 'Programa Femenino de Tonificación', focus: 'Curvas y Fuerza' },
      fat_loss: { title: 'Programa Femenino de Pérdida de Grasa', focus: 'Delgada y Esculpida' },
      maintenance: { title: 'Programa Femenino de Mantenimiento', focus: 'Mantén tu forma' }
    }
  };

  const genderLabel = { male: 'masculino', female: 'femenino' };
  const objectiveLabel = { volume: 'volumen', fat_loss: 'pérdida de grasa', maintenance: 'mantenimiento corporal' };

  const preview = routinePreview[routine.gender][routine.objective];

  return (
    <section className="max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-[#787878] hover:text-[#CBFF00] mb-8 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Volver a la selección de rutina</span>
      </button>

      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">
          ¡Tu rutina ya casi es tuya!
        </h2>
        <div className="bg-[#2D2D2D] rounded-xl p-6 max-w-md mx-auto border border-[#CBFF00]/30">
          <h3 className="text-xl font-semibold text-[#CBFF00] mb-2">{preview.title}</h3>
          <p className="text-[#787878] mb-2">{preview.focus}</p>
          <div className="flex justify-center space-x-4 text-sm">
            <span className="bg-[#787878]/20 px-3 py-1 rounded-full">
              {routine.frequency} días/semana
            </span>
            <span className="bg-[#787878]/20 px-3 py-1 rounded-full capitalize">
              {genderLabel[routine.gender]}
            </span>
            <span className="bg-[#787878]/20 px-3 py-1 rounded-full capitalize">
              {objectiveLabel[routine.objective]}
            </span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-[#2D2D2D] rounded-2xl p-8 border-2 transition-all duration-300 hover:transform hover:scale-105 ${
              plan.popular 
                ? 'border-[#CBFF00] relative' 
                : 'border-[#787878]/20 hover:border-[#CBFF00]/50'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-[#CBFF00] text-[#2D2D2D] px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                  <Crown className="h-4 w-4" />
                  <span>Más Popular</span>
                </div>
              </div>
            )}

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2 flex items-center justify-center space-x-2">
                {plan.popular && <Star className="h-6 w-6 text-[#CBFF00]" />}
                <span>{plan.name}</span>
              </h3>
              <p className="text-[#787878] mb-4">{plan.description}</p>
              <div className="text-4xl font-bold text-[#CBFF00]">
                ${plan.price}
                <span className="text-lg text-[#787878] font-normal"> ARS</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-[#CBFF00] mt-0.5 flex-shrink-0" />
                  <span className="text-[#787878]">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => onSelect(plan)}
              className={`w-full font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#CBFF00]/30 ${plan.buttonClass}`}
            >
              {plan.buttonText}
            </button>

            {plan.id === 'premium' && (
              <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-[#787878]">
                <MessageCircle className="h-4 w-4" />
                <span>Incluye soporte por WhatsApp</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default PlanSelector;