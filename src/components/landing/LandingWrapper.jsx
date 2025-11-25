import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "./HeroSection.jsx";
import TransformationGallery from "./TransformationGallery.jsx";
import Introduction from "./Introduction.jsx";
import TrainWithTheBest from "./TrainWithTheBest.jsx";
import ProgramsGrid from "./ProgramsGrid.jsx";
import Asesorias from "./Asesorias.jsx";
import FAQ from "./FAQ.jsx";
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

  return (
    <div className="bg-black text-white">
      {/* Hero Section - Full Width */}
      <div id="hero">
        <HeroSection
          onViewPlans={handleViewPlans}
        />
      </div>

      {/* Transformation Gallery - New CBUM Section */}
      <TransformationGallery />

      {/* Introduction / Elevator Pitch */}
      <Introduction />

      {/* Train With The Best - New CBUM Section */}
      <TrainWithTheBest />

      {/* Programs Grid - New CBUM Section */}
      <ProgramsGrid />

      {/* Main Content Container */}
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-3 py-8 sm:gap-12 sm:px-4 sm:py-10 md:gap-16 md:px-6 md:py-16">

        {/* 1. Plan Selection System */}
        <div ref={pasarelaRef} id="planes">
          <PasarelaCliente />
        </div>
      </div>

      {/* Asesorías - Full Width CBUM Style */}
      <div ref={asesoriasRef} id="asesorias">
        <Asesorias />
      </div>

      {/* FAQ Section - New CBUM Section */}
      <FAQ />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default LandingWrapper;
