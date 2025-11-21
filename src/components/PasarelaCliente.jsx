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
import training4 from "@/assets/training-4.jpg";

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
    return (state.routines || []).map((routine) => ({
      id: routine.id,
      name: routine.title || routine.name || "Plan sin título",
      title: routine.title || routine.name || "Plan sin título",
      description: routine.description || routine.notes || "",
      duration: routine.durationWeeks ? String(routine.durationWeeks) : "",
      frequency: Array.isArray(routine.days) ? String(routine.days.length) : "",
      tags: routine.tags || [],
      image: routine.image || "",
      gender: routine.gender || routine.genre || "",
      objective: routine.objective || "",
      price: routine.price ?? 0,
      preview: routine,
    }));
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
    if (!selectedGender) {
      setFilteredRoutines([]);
      return;
    }

    const routines = trainerRoutines.filter((routine) => {
      const matchesGender = !routine.gender || routine.gender === selectedGender;
      const matchesGoal =
        selectedGoal === "Todos" || !routine.objective
          ? true
          : routine.objective === selectedGoal;
      return matchesGender && matchesGoal;
    });

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
    <div ref={ref} className="flex w-full flex-col items-center bg-base text-white">
      <section className="w-full max-w-6xl px-3 py-8 sm:px-4 sm:py-10 md:px-6 md:py-12 lg:py-16">
        <div
          className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-[#050505] via-[#0b0b0b] to-[#101010] sm:rounded-3xl"
        >
          <div className="absolute inset-0 opacity-30">
            <img src={training4} alt="Training background" className="h-full w-full object-cover mix-blend-screen" />
          </div>
          <div className="relative z-10 flex flex-col items-center gap-4 px-5 py-12 text-center sm:items-start sm:gap-5 sm:px-8 sm:py-14 sm:text-left md:gap-6 md:px-12 md:py-16 lg:px-16 lg:py-20">
            <FadeIn className="flex w-full flex-col gap-4 sm:gap-5 md:gap-6">
              <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#00C0A3] sm:justify-start sm:gap-3 sm:text-xs sm:tracking-[0.4em]">
                <span className="h-px w-12 bg-[#0EF2A0]/40 sm:flex-1" />
                <span>TRANSFORMÁ TU CUERPO HOY</span>
                <span className="h-px w-12 bg-[#0EF2A0]/40 sm:flex-1" />
              </div>
              <h1 className="text-3xl font-bold uppercase leading-tight !text-white sm:text-4xl md:text-5xl lg:text-6xl">
                Elegí tu entrenamiento. Superá tus límites.
              </h1>
              <p className="mx-auto max-w-2xl text-sm !text-gray-300 sm:mx-0 sm:text-base md:text-lg">
                Planes técnicamente diseñados por Matías. Seleccioná tu perfil,
                objetivo y desbloqueá rutinas con enfoque técnico y resultados medibles.
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:gap-4">
                <Button
                  size="lg"
                  rounded="full"
                  className="w-full bg-[#0EF2A0] px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[#050505] transition-transform hover:-translate-y-0.5 hover:bg-[#0AA66A] sm:w-auto sm:px-8 sm:py-4 sm:text-sm md:text-base"
                  onClick={handleStart}
                >
                  Comenzar selección
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
