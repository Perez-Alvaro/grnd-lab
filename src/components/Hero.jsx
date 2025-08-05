import React from 'react';
import { Target, Users, Calendar, Zap } from 'lucide-react';

function Hero() {
  return (
    <section className="bg-gradient-to-br from-[#202020] via-[#2D2D2D] to-[#202020] py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Tu
            <span className="block text-[#CBFF00]">Rutina Fitness Perfecta</span>
            <span className="block text-3xl md:text-4xl text-[#787878] font-normal mt-4">
              Diseñada solo para ti
            </span>
          </h1>
          <p className="text-xl text-[#787878] max-w-3xl mx-auto leading-relaxed">
            Obtén rutinas de entrenamiento personalizadas diseñadas por expertos.
            Elige tus objetivos, frecuencia y déjanos crear el plan perfecto para tu viaje fitness.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-16">
          <div className="text-center group">
            <div className="bg-[#2D2D2D] p-6 rounded-2xl border border-[#787878]/20 hover:border-[#CBFF00]/50 transition-all duration-300 group-hover:transform group-hover:scale-105">
              <Target className="h-12 w-12 text-[#CBFF00] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Objetivos Claros</h3>
              <p className="text-[#787878]">Aumento de volumen o pérdida de grasa: te tenemos cubierto</p>
            </div>
          </div>
          
          <div className="text-center group">
            <div className="bg-[#2D2D2D] p-6 rounded-2xl border border-[#787878]/20 hover:border-[#CBFF00]/50 transition-all duration-300 group-hover:transform group-hover:scale-105">
              <Users className="h-12 w-12 text-[#DBFE52] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Personalizado</h3>
              <p className="text-[#787878]">Rutinas adaptadas a tu género y nivel</p>
            </div>
          </div>
          
          <div className="text-center group">
            <div className="bg-[#2D2D2D] p-6 rounded-2xl border border-[#787878]/20 hover:border-[#CBFF00]/50 transition-all duration-300 group-hover:transform group-hover:scale-105">
              <Calendar className="h-12 w-12 text-[#F8FE9F] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Horario Flexible</h3>
              <p className="text-[#787878]">2, 3 o 5 días por semana: tú eliges</p>
            </div>
          </div>
          
          <div className="text-center group">
            <div className="bg-[#2D2D2D] p-6 rounded-2xl border border-[#787878]/20 hover:border-[#CBFF00]/50 transition-all duration-300 group-hover:transform group-hover:scale-105">
              <Zap className="h-12 w-12 text-[#CBFF00] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Entrega Instantánea</h3>
              <p className="text-[#787878]">Recibe tu rutina inmediatamente después del pago</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-[#F8FE9F]/10 px-6 py-3 rounded-full border border-[#F8FE9F]/20">
            <div className="w-2 h-2 bg-[#CBFF00] rounded-full animate-pulse"></div>
            <span className="text-[#F8FE9F] font-medium">¿Listo para transformar tu camino fitness?</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;