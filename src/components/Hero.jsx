import React from 'react';
import { Target, Users, Calendar, Zap } from 'lucide-react';

function Hero() {
  return (
    <section className="bg-gradient-to-br from-[#202020] via-[#2D2D2D] to-[#202020] py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Your Perfect
            <span className="block text-[#CBFF00]">Fitness Routine</span>
            <span className="block text-3xl md:text-4xl text-[#787878] font-normal mt-4">
              Tailored Just for You
            </span>
          </h1>
          <p className="text-xl text-[#787878] max-w-3xl mx-auto leading-relaxed">
            Get personalized workout routines designed by fitness experts. 
            Choose your goals, frequency, and let us create the perfect plan for your fitness journey.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-16">
          <div className="text-center group">
            <div className="bg-[#2D2D2D] p-6 rounded-2xl border border-[#787878]/20 hover:border-[#CBFF00]/50 transition-all duration-300 group-hover:transform group-hover:scale-105">
              <Target className="h-12 w-12 text-[#CBFF00] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Clear Objectives</h3>
              <p className="text-[#787878]">Volume building or fat loss - we've got you covered</p>
            </div>
          </div>
          
          <div className="text-center group">
            <div className="bg-[#2D2D2D] p-6 rounded-2xl border border-[#787878]/20 hover:border-[#CBFF00]/50 transition-all duration-300 group-hover:transform group-hover:scale-105">
              <Users className="h-12 w-12 text-[#DBFE52] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Personalized</h3>
              <p className="text-[#787878]">Routines adapted for your gender and fitness level</p>
            </div>
          </div>
          
          <div className="text-center group">
            <div className="bg-[#2D2D2D] p-6 rounded-2xl border border-[#787878]/20 hover:border-[#CBFF00]/50 transition-all duration-300 group-hover:transform group-hover:scale-105">
              <Calendar className="h-12 w-12 text-[#F8FE9F] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Flexible Schedule</h3>
              <p className="text-[#787878]">2, 3, or 5 days per week - you choose</p>
            </div>
          </div>
          
          <div className="text-center group">
            <div className="bg-[#2D2D2D] p-6 rounded-2xl border border-[#787878]/20 hover:border-[#CBFF00]/50 transition-all duration-300 group-hover:transform group-hover:scale-105">
              <Zap className="h-12 w-12 text-[#CBFF00] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Instant Delivery</h3>
              <p className="text-[#787878]">Get your routine immediately after payment</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-[#F8FE9F]/10 px-6 py-3 rounded-full border border-[#F8FE9F]/20">
            <div className="w-2 h-2 bg-[#CBFF00] rounded-full animate-pulse"></div>
            <span className="text-[#F8FE9F] font-medium">Ready to transform your fitness journey?</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;