import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "./HeroSection.jsx";
import Asesorias from "./Asesorias.jsx";
import Testimonios from "./Testimonios.jsx";
import PasarelaCliente from "../PasarelaCliente.jsx";

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
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-10 sm:px-6 md:py-16">
        <HeroSection
          onViewPlans={handleViewPlans}
          onRequestAdvisory={handleRequestAdvisory}
        />

        <div ref={asesoriasRef}>
          <Asesorias />
        </div>

        <Testimonios />

        <div ref={pasarelaRef}>
          <PasarelaCliente />
        </div>
      </div>
    </div>
  );
}

export default LandingWrapper;
