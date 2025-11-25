import React from "react";
import { ChevronRight } from "lucide-react";
import heroImage from "@/assets/hero.png";
import Navbar from "../Shared/Navbar.jsx";

function HeroSection({ onViewPlans, onRequestAdvisory }) {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const menuItems = [
    { label: "Inicio", onClick: () => scrollToSection("hero") },
    { label: "Sobre mí", onClick: () => scrollToSection("asesorias") },
    { label: "Planes", onClick: onViewPlans },
    { label: "Testimonios", onClick: () => scrollToSection("testimonios") }
  ];

  return (
    <section className="relative w-full min-h-screen bg-black overflow-hidden" id="hero">

      {/* Navbar */}
      <Navbar menuItems={menuItems} />

      {/* MOBILE: Imagen como background con overlay */}
      <div className="absolute inset-0 md:hidden z-0">
        <img
          src={heroImage}
          alt="matias-ortiz"
          className="h-full w-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black" />
      </div>

      {/* DESKTOP: Imagen a la derecha estilo CBUM */}
      <div className="hidden md:block absolute right-0 top-0 h-full w-1/2 z-0">
        <img
          src={heroImage}
          alt="matias-ortiz"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/20 to-black" />
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="relative z-20 flex flex-col justify-center min-h-screen px-6 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="md:w-1/2 md:pr-8">

          {/* TÍTULO BOLD estilo CBUM - Mobile First */}
          <h1 className="text-white font-black leading-[0.9] tracking-tight
                         text-5xl
                         sm:text-6xl 
                         md:text-7xl 
                         lg:text-8xl 
                         xl:text-9xl">
            ENTRENÁ
            <br />
            CON LOS
            <br />
            MEJORES
          </h1>

          {/* QUOTE MOTIVACIONAL */}
          <div className="mt-8 md:mt-10 lg:mt-12 max-w-xl">
            <p className="text-white/70 text-sm leading-relaxed
                         sm:text-base 
                         md:text-lg
                         lg:leading-relaxed">
              "El progreso no se trata de ser perfecto, sino de ser constante.
              Entrenar con disciplina, superarte con humildad y construir la mejor
              versión de vos mismo. Ese es el estándar."
            </p>

            <p className="mt-4 text-xs font-bold text-white/90 tracking-widest
                         sm:text-sm 
                         md:mt-6">
              — MATÍAS ORTIZ · COACH ONLINE
            </p>
          </div>

          {/* CTAs - Mobile First */}
          <div className="mt-10 flex flex-col gap-4
                         sm:flex-row sm:gap-5
                         md:mt-12
                         lg:mt-14">
            <button
              type="button"
              onClick={onViewPlans}
              className="group inline-flex items-center justify-center gap-2 
                         rounded-full bg-emerald-500 px-8 py-3.5
                         text-sm font-bold uppercase tracking-wide text-black 
                         transition-all duration-300 
                         hover:bg-emerald-600 hover:scale-105
                         shadow-lg shadow-emerald-500/25
                         sm:px-10 sm:py-4
                         md:text-base"
            >
              Ver Planes
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
            </button>

            <a
              href="https://wa.me/5493512800414"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 
                         rounded-full border-2 border-emerald-500 bg-transparent px-8 py-3.5
                         text-sm font-bold uppercase tracking-wide text-emerald-500 
                         transition-all duration-300 
                         hover:bg-emerald-500/10 hover:border-emerald-400 hover:scale-105
                         sm:px-10 sm:py-4
                         md:text-base"
            >
              Asesoría 1:1
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator - opcional */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 hidden md:block">
        <div className="flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="h-12 w-[2px] bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
