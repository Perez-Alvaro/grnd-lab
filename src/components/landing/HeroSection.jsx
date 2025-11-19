import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";

const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1600&q=80";

function HeroSection({ onViewPlans, onRequestAdvisory }) {
  return (
    <section
      className="relative flex min-h-[80vh] w-full items-center overflow-hidden rounded-[32px] border border-brand-border bg-[#050505] px-4 py-16 sm:px-8 md:min-h-[100vh]"
    >
      <div className="absolute inset-0">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE_URL})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-[#050505]/20" />
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#050505] via-transparent to-transparent" />
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#050505] via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-2xl space-y-8 rounded-[28px] border border-white/10 bg-black/50 p-8 backdrop-blur-md">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.5em] text-cyan-200">
          <Sparkles className="h-4 w-4 text-[#00C0A3]" />
          <span>Elite Coaching</span>
        </div>
        <img src="/mz-logo-mark.svg" alt="Logo MZ" className="h-14 w-auto" />
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-[#00C0A3]">
            Personal Trainer
          </p>
          <h1 className="text-4xl font-semibold text-white md:text-6xl">
            Matias Ortiz
          </h1>
          <p className="text-lg text-gray-200 md:text-xl">
            Entrenamientos clínicamente diseñados, métricas reales y un flujo
            premium para seleccionar tu plan perfecto.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={onViewPlans}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0EF2A0] px-8 py-3 text-sm font-semibold uppercase tracking-wide text-[#050505] transition-all hover:-translate-y-0.5 hover:bg-[#0AA66A]"
          >
            Ver planes de entrenamiento
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onRequestAdvisory}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#0EF2A0] px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-all hover:-translate-y-0.5 hover:border-[#00C0A3] hover:text-[#0EF2A0]"
          >
            Quiero asesoría personalizada
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
