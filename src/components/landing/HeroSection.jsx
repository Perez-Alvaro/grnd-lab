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
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Imagen de fondo corregida - SIEMPRE VISIBLE */}
      <img
        src={heroImage}
        alt="matias-ortiz-hero"
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
      />

      {/* Gradiente leve para contraste - MAX 40% */}
      <div className="absolute inset-0 bg-black/40 z-[1]"></div>

      {/* Shared Navbar Component */}
      <Navbar menuItems={menuItems} />

      {/* Contenido del hero - CENTRADO VERTICALMENTE */}
      <div className="relative z-[10] flex flex-col items-center justify-center min-h-screen text-center px-4">
        {/* Título principal - Mobile first */}
        <h1 className="text-4xl font-light tracking-[0.3em] text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl xl:tracking-[0.45em]">
          MATIAS ORTIZ
        </h1>

        {/* Subtítulo - color cyan MZ */}
        <p className="mt-4 text-base tracking-widest !text-[#0EF2A0] sm:text-lg md:text-xl lg:text-2xl">
          PERSONAL TRAINER
        </p>

        {/* Descripción opcional */}
        <p className="mx-auto mt-4 max-w-2xl px-4 text-base !text-white/90 sm:text-base md:mt-6 md:text-lg">
          ¿LISTO PARA DEJAR DE PONER EXCUSAS?
        </p>

        {/* CTA - Mobile: uno debajo del otro, Desktop: lado a lado */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <button
            type="button"
            onClick={onViewPlans}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#0EF2A0] px-10 py-3 font-semibold uppercase tracking-wide text-black shadow-lg shadow-[#0EF2A0]/20 transition-all hover:scale-105 hover:bg-[#0AA66A] hover:shadow-xl hover:shadow-[#0EF2A0]/30"
          >
            Comenzá Ya
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
          </button>

          <button
            type="button"
            onClick={onRequestAdvisory}
            className="group inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#0EF2A0] bg-transparent px-10 py-3 font-semibold uppercase tracking-wide text-[#0EF2A0] transition-all hover:scale-105 hover:bg-[#0EF2A0]/10"
          >
            Asesoría Personalizada
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>

      {/* Indicador de scroll opcional */}
      <div className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 animate-bounce">
        <div className="h-8 w-5 rounded-full border-2 border-white/40">
          <div className="mx-auto mt-2 h-1.5 w-1.5 animate-pulse rounded-full bg-[#0EF2A0]" />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
