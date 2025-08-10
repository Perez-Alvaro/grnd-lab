import React from 'react';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

function PaymentSuccess() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-[#2D2D2D] rounded-2xl p-8 border border-[#CBFF00]/30">
          <CheckCircle className="h-20 w-20 text-[#CBFF00] mx-auto mb-6" />
          
          <h1 className="text-4xl font-bold mb-4">
            ¡Bienvenido a Fitter!
          </h1>

          <p className="text-[#787878] text-lg mb-8">
            ¡Tu pago fue exitoso y tu rutina personalizada está en camino!
          </p>

          <div className="bg-[#F8FE9F]/10 border border-[#F8FE9F]/20 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-[#F8FE9F] mb-4">¿Qué sigue?</h3>
            <div className="text-left space-y-3 text-[#787878]">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-[#CBFF00] rounded-full mt-2 flex-shrink-0"></div>
                <p>Revisa tu correo para ver tu rutina personalizada (PDF)</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-[#CBFF00] rounded-full mt-2 flex-shrink-0"></div>
                <p>Accede a videos en YouTube con demostraciones de todos los ejercicios</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-[#CBFF00] rounded-full mt-2 flex-shrink-0"></div>
                <p>Usuarios Premium: Matías se pondrá en contacto contigo en 24 horas</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center space-x-2 bg-[#CBFF00] hover:bg-[#DBFE52] text-[#2D2D2D] font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Volver al inicio</span>
            </Link>

            <button className="bg-[#787878]/20 hover:bg-[#787878]/30 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
              Contactar soporte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;