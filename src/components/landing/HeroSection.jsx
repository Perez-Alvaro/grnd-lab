import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";

const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1600&q=80";

function HeroSection({ onViewPlans, onRequestAdvisory }) {
  return (
    <section
      className="relative flex min-h-[70vh] w-full items-center overflow-hidden rounded-2xl border border-brand-border bg-[#050505] px-3 py-12 sm:min-h-[80vh] sm:rounded-3xl sm:px-6 sm:py-16 md:min-h-[100vh] md:rounded-[32px] md:px-8"
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

      <div className="relative z-10 w-full max-w-2xl space-y-5 rounded-2xl border border-white/10 bg-black/50 p-5 backdrop-blur-md sm:space-y-6 sm:rounded-3xl sm:p-6 md:space-y-8 md:rounded-[28px] md:p-8">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-cyan-200 sm:gap-3 sm:text-xs sm:tracking-[0.5em]">
          <Sparkles className="h-3 w-3 text-[#00C0A3] sm:h-4 sm:w-4" />
          <span>Elite Coaching</span>
        </div>
        <img src="/mz-logo-mark.PNG" alt="Logo MZ" className="h-10 w-auto sm:h-12 md:h-14" />
        <div className="space-y-2 sm:space-y-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#00C0A3] sm:text-xs sm:tracking-[0.3em]">
            Personal Trainer
          </p>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Matias Ortiz
          </h1>
          <p className="text-sm text-[#00C0A3] sm:text-base md:text-lg lg:text-xl">
            Entrenamientos clínicamente diseñados, métricas reales y un flujo
            premium para seleccionar tu plan perfecto.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
          <button
            type="button"
            onClick={onViewPlans}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0EF2A0] px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[#050505] transition-all hover:-translate-y-0.5 hover:bg-[#0AA66A] sm:w-auto sm:px-8 sm:text-sm"
          >
            Ver planes de entrenamiento
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
          <button
            type="button"
            onClick={onRequestAdvisory}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#0EF2A0] px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white transition-all hover:-translate-y-0.5 hover:border-[#00C0A3] hover:text-[#0EF2A0] sm:w-auto sm:px-8 sm:text-sm"
          >
            Quiero asesoría personalizada
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
