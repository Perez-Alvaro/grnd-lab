import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Mail, Shield, CheckCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext.jsx';
import { mockProcessPayment } from '../utils/mockApi.js';

function PaymentForm({ routine, plan, onBack }) {
  const { dispatch } = useAppContext();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: ''
  });
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const { user, sale } = await mockProcessPayment(formData, routine, plan);
    dispatch({ type: 'ADD_USER', payload: user });
    dispatch({ type: 'ADD_SALE', payload: sale });
    setProcessing(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <section className="max-w-2xl mx-auto text-center">
        <div className="bg-[#2D2D2D] rounded-2xl p-8 border border-[#CBFF00]/30">
          <CheckCircle className="h-16 w-16 text-[#CBFF00] mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">¡Pago exitoso!</h2>
          <p className="text-[#787878] mb-6">
            Tu {plan.name} ha sido activado y tu rutina personalizada se está preparando.
          </p>
          
          <div className="bg-[#F8FE9F]/10 border border-[#F8FE9F]/20 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-[#F8FE9F] mb-3">¿Qué sigue?</h3>
            <ul className="text-left space-y-2 text-[#787878]">
              <li>• El PDF de tu rutina se enviará a {formData.email} en menos de 5 minutos</li>
              <li>• Recibirás enlaces de YouTube con demostraciones de ejercicios</li>
              {plan.id === 'premium' && (
                <li>• Matías se comunicará contigo en 24 horas para darte una bienvenida al equipo MZ</li>
              )}
              <li>• Revisa tu carpeta de spam si no ves el correo</li>
            </ul>
          </div>

          {plan.id === 'premium' && (
            <div className="bg-[#CBFF00]/10 border border-[#CBFF00]/20 rounded-xl p-4 mb-6">
              <p className="text-[#CBFF00] font-semibold">
                Soporte Premium: Contacta a Matías directamente al +54 9 3512 80-0414
              </p>
          </div>
          )}

          <button
            onClick={() => window.location.href = '/'}
            className="bg-[#CBFF00] hover:bg-[#DBFE52] text-[#2D2D2D] font-semibold py-3 px-8 rounded-xl transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-[#787878] hover:text-[#CBFF00] mb-8 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Volver a la selección de plan</span>
      </button>

      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4">
          Completa tu pedido
        </h2>
        <div className="bg-[#2D2D2D] rounded-xl p-4 inline-block border border-[#787878]/20">
          <span className="text-[#787878]">{plan.name} - </span>
          <span className="text-2xl font-bold text-[#CBFF00]">${plan.price}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#2D2D2D] rounded-2xl p-8 border border-[#787878]/20">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#787878] mb-2">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#787878]" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full bg-[#202020] border border-[#787878]/30 rounded-xl pl-12 pr-4 py-4 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                placeholder="Enviaremos tu rutina a este mail"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#787878] mb-2">
                Nombre
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full bg-[#202020] border border-[#787878]/30 rounded-xl px-4 py-4 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                placeholder="Manuel"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#787878] mb-2">
                Apellido
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full bg-[#202020] border border-[#787878]/30 rounded-xl px-4 py-4 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                placeholder="Gonzalez"
              />
            </div>
          </div>

          <div className="bg-[#787878]/10 border border-[#787878]/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CreditCard className="h-6 w-6 text-[#CBFF00]" />
              <h3 className="font-semibold">Información de pago</h3>
            </div>
            <div className="bg-[#CBFF00]/10 border border-[#CBFF00]/20 rounded-lg p-4">
              <p className="text-[#CBFF00] text-sm font-medium">
                🔄 Esta es una versión demo. En producción se implementaría la integración de pago con MercadoPago.
              </p>
            </div>
          </div>

          <div className="bg-[#F8FE9F]/10 border border-[#F8FE9F]/20 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-[#F8FE9F]" />
              <span className="font-semibold text-[#F8FE9F]">Seguro y Automático</span>
            </div>
            <ul className="text-sm text-[#787878] space-y-1">
              <li>• Procesamiento de pago cifrado SSL</li>
              <li>• Envío de email inmediato después del pago</li>
              <li>• Si te equivocas, podes solicitar otro tipo de rutina</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full bg-[#CBFF00] hover:bg-[#DBFE52] disabled:bg-[#787878] text-[#2D2D2D] font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#CBFF00]/30 disabled:transform-none disabled:cursor-not-allowed"
          >
            {processing ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#2D2D2D] border-t-transparent"></div>
                <span>Procesando pago...</span>
            </div>
          ) : (
              `Completar pedido - $${plan.price}`
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

export default PaymentForm;