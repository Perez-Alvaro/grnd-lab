import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import { Button, FadeIn } from "./Shared/reactbits/index.js";
import GenderSelector from "./Client/GenderSelector.jsx";
import GoalSelector from "./Client/GoalSelector.jsx";
import RoutineCarousel from "./Client/RoutineCarousel.jsx";
import RoutinePreviewModal from "./Client/RoutinePreviewModal.jsx";
import PaymentSection from "./Client/PaymentSection.jsx";
import PremiumUpgradeStep from "./Client/PremiumUpgradeStep.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import mockupImage from "@/assets/mockup.jpg";

const PREMIUM_UPGRADE_PRICE = 6000;

const PasarelaCliente = React.forwardRef(function PasarelaCliente(_, ref) {
  const { state } = useAppContext();
  const genderRef = useRef(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState("Todos");
  const [filteredRoutines, setFilteredRoutines] = useState([]);
  const [previewRoutine, setPreviewRoutine] = useState(null);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [planType, setPlanType] = useState("essential");

  const trainerRoutines = useMemo(() => {
    console.log('🔍 [PasarelaCliente] state.routines:', state.routines);

    // Filtrar solo rutinas activas para la landing
    const activeRoutines = (state.routines || []).filter((routine) => routine.active === true);

    const mapped = activeRoutines.map((routine) => ({
      id: routine.id,
      name: routine.title || routine.name || "Plan sin título",
      title: routine.title || routine.name || "Plan sin título",
      description: routine.description || routine.notes || "",
      duration: routine.duration_weeks || routine.durationWeeks || "",
      frequency: routine.frequency || (Array.isArray(routine.days) ? String(routine.days.length) : ""),
      tags: routine.tags || [],
      image: routine.image || "",
      gender: routine.gender || routine.genre || "",
      objective: routine.objective || "",
      level: routine.level || "",
      price: routine.price ?? 0,
      preview: routine,
    }));

    console.log('📋 [PasarelaCliente] Mapped active routines:', mapped);
    return mapped;
  }, [state.routines]);

  const objectives = useMemo(() => {
    const uniqueObjectives = new Set();
    trainerRoutines.forEach((routine) => {
      if (routine.objective) {
        uniqueObjectives.add(routine.objective);
      }
    });
    return Array.from(uniqueObjectives);
  }, [trainerRoutines]);

  useEffect(() => {
    if (selectedGoal !== "Todos" && !objectives.includes(selectedGoal)) {
      setSelectedGoal("Todos");
    }
  }, [objectives, selectedGoal]);

  useEffect(() => {
    console.log('🔄 [Filter Effect] selectedGender:', selectedGender, 'selectedGoal:', selectedGoal);

    if (!selectedGender) {
      console.log('⚠️ [Filter] No gender selected, clearing routines');
      setFilteredRoutines([]);
      return;
    }

    const routines = trainerRoutines.filter((routine) => {
      const matchesGender = !routine.gender || routine.gender === selectedGender;
      const matchesGoal =
        selectedGoal === "Todos" || !routine.objective
          ? true
          : routine.objective === selectedGoal;

      console.log(`🔍 [Filter] Routine "${routine.name}":`, {
        routineGender: routine.gender,
        routineObjective: routine.objective,
        matchesGender,
        matchesGoal,
        passed: matchesGender && matchesGoal
      });

      return matchesGender && matchesGoal;
    });

    console.log('✅ [Filter] Filtered routines:', routines);
    setFilteredRoutines(routines);
  }, [selectedGender, selectedGoal, trainerRoutines]);

  useEffect(() => {
    if (
      selectedRoutine &&
      !filteredRoutines.some((routine) => routine.id === selectedRoutine.id)
    ) {
      setSelectedRoutine(null);
    }
  }, [filteredRoutines, selectedRoutine]);

  useEffect(() => {
    if (!selectedRoutine) {
      setPlanType("essential");
    }
  }, [selectedRoutine]);

  const readyForRoutines = useMemo(
    () => Boolean(selectedGender && (selectedGoal || selectedGoal === "Todos")),
    [selectedGender, selectedGoal],
  );

  const handleStart = () => {
    genderRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectRoutine = useCallback((routine) => {
    setSelectedRoutine(routine);
    setPlanType("essential");
    document
      .getElementById("checkout-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const sectionMotionProps = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.5, ease: "easeOut" },
  };

  return (
    <div ref={ref} className="flex w-full flex-col items-center bg-black text-white">
      <section className="w-full max-w-7xl px-3 py-8 sm:px-4 sm:py-10 md:px-6 md:py-16 lg:py-20">
        {/* Hero Section with Two-Column Layout */}
        <div className="relative overflow-hidden rounded-3xl bg-black py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-6 sm:px-8 md:grid-cols-2 md:gap-12 lg:gap-20 lg:px-12">
            {/* Left Column - Phone Mockup */}
            <FadeIn delay={0} className="relative flex items-center justify-center md:justify-start">
              <img
                src={mockupImage}
                alt="App Preview"
                className="h-auto w-[280px] sm:w-[320px] lg:w-[380px]"
              />
            </FadeIn>

            {/* Right Column - Text Content */}
            <FadeIn delay={200} className="flex flex-col gap-6 text-center md:text-left">
              <h1 className="text-3xl font-black uppercase leading-tight !text-white sm:text-4xl md:text-5xl">
                Elegí tu entrenamiento. Superá tus límites.
              </h1>
              <p className="mx-auto max-w-xl text-base !text-gray-400 sm:text-lg md:mx-0 md:text-xl">
                Planes técnicamente diseñados por Matías. Seleccioná tu perfil,
                objetivo y desbloqueá rutinas con enfoque técnico y resultados medibles.
              </p>

              {/* Pagination Dots */}
              <div className="flex items-center justify-center gap-2 md:justify-start">
                <div className="h-2.5 w-2.5 rounded-full bg-gray-600" />
                <div className="h-2.5 w-8 rounded-full bg-white" />
                <div className="h-2.5 w-2.5 rounded-full bg-gray-600" />
                <div className="h-2.5 w-2.5 rounded-full bg-gray-600" />
              </div>

              {/* CTA Button */}
              <div className="flex justify-center md:justify-start">
                <Button
                  size="lg"
                  rounded="full"
                  className="bg-emerald-500 px-8 py-4 text-sm font-bold uppercase tracking-wider text-black transition-all hover:-translate-y-0.5 hover:scale-105 hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/50 sm:px-10 sm:py-5 sm:text-base"
                  onClick={handleStart}
                >
                  Empecemos
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>

        <div ref={genderRef} className="mt-10 sm:mt-12 md:mt-14 lg:mt-20">
          <GenderSelector
            selectedGender={selectedGender}
            onSelect={setSelectedGender}
          />
        </div>

        <motion.div {...sectionMotionProps}>
          <GoalSelector
            objectives={objectives}
            selectedGoal={selectedGoal}
            onSelect={setSelectedGoal}
            readyForRoutines={readyForRoutines}
          />
        </motion.div>

        <motion.div id="rutinas" {...sectionMotionProps}>
          <RoutineCarousel
            routines={filteredRoutines}
            onPreview={setPreviewRoutine}
            onSelect={handleSelectRoutine}
          />
        </motion.div>

        {selectedRoutine && (
          <motion.div id="premium-offer" {...sectionMotionProps}>
            <PremiumUpgradeStep
              routine={selectedRoutine}
              planType={planType}
              onSelectPlan={setPlanType}
              premiumAddonPrice={PREMIUM_UPGRADE_PRICE}
            />
          </motion.div>
        )}

        <motion.div id="pago" {...sectionMotionProps}>
          <PaymentSection
            routine={selectedRoutine}
            planType={planType}
            premiumAddonPrice={PREMIUM_UPGRADE_PRICE}
          />
        </motion.div>
      </section>

      <RoutinePreviewModal
        routine={previewRoutine?.preview || previewRoutine}
        open={Boolean(previewRoutine)}
        onClose={() => setPreviewRoutine(null)}
        onSelect={(routine) => {
          handleSelectRoutine(routine);
          setPreviewRoutine(null);
        }}
      />
    </div>
  );
});

export default PasarelaCliente;
