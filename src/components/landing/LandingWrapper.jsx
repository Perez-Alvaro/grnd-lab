import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "./HeroSection.jsx";
import Introduction from "./Introduction.jsx";
import Asesorias from "./Asesorias.jsx";
import Testimonios from "./Testimonios.jsx";
import PasarelaCliente from "../PasarelaCliente.jsx";
import Footer from "../Shared/Footer.jsx";

function LandingWrapper() {
  const asesoriasRef = useRef(null);
  const pasarelaRef = useRef(null);
  const navigate = useNavigate();

  const scrollIntoView = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
      return true;
    }
    return false;
  };

  const handleViewPlans = () => {
    if (!scrollIntoView(pasarelaRef)) {
      navigate("/purchase-flow");
    }
  };

  const handleRequestAdvisory = () => {
    if (!scrollIntoView(asesoriasRef)) {
      navigate("/landing#asesorias");
    }
  };

  return (
    <div className="bg-base text-white">
      {/* Hero Section - Full Width sin restricciones */}
      <div id="hero">
        <HeroSection
          onViewPlans={handleViewPlans}
          onRequestAdvisory={handleRequestAdvisory}
        />
      </div>

      {/* Introduction / Elevator Pitch */}
      <Introduction />

      {/* Resto del contenido - Con max-width y padding */}
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-3 py-8 sm:gap-12 sm:px-4 sm:py-10 md:gap-16 md:px-6 md:py-16">
        {/* 1. Plan Selection System */}
        <div ref={pasarelaRef}>
          <PasarelaCliente />
        </div>

        {/* 2. 1:1 Programs (Asesorías) */}
        <div ref={asesoriasRef}>
          <Asesorias />
        </div>

        {/* 3. Testimonials */}
        <Testimonios />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default LandingWrapper;
