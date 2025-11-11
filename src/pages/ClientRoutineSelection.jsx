import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, FadeIn, TransitionBox } from '../components/reactbits/index.js';
import GenderSelector from '../components/GenderSelector.jsx';
import GoalSelector from '../components/GoalSelector.jsx';
import RoutineCarousel from '../components/RoutineCarousel.jsx';
import RoutinePreviewModal from '../components/RoutinePreviewModal.jsx';
import PaymentSection from '../components/PaymentSection.jsx';
import { clientRoutines } from '../data/clientRoutines.js';

function ClientRoutineSelection() {
  const heroRef = useRef(null);
  const genderRef = useRef(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [filteredRoutines, setFilteredRoutines] = useState([]);
  const [previewRoutine, setPreviewRoutine] = useState(null);
  const [selectedRoutine, setSelectedRoutine] = useState(null);

  useEffect(() => {
    if (selectedGender && selectedGoal) {
      setFilteredRoutines(
        clientRoutines.filter((routine) => routine.gender === selectedGender && routine.goal === selectedGoal)
      );
    } else {
      setFilteredRoutines([]);
    }
  }, [selectedGender, selectedGoal]);

  const readyForRoutines = useMemo(() => Boolean(selectedGender && selectedGoal), [selectedGender, selectedGoal]);

  const handleStart = () => {
    genderRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex w-full flex-col items-center bg-neutral-950 text-white">
      <section className="w-full max-w-6xl px-6 py-12 md:py-16">
        <div
          ref={heroRef}
          className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800"
        >
          <div className="absolute inset-0 opacity-30">
            <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center mix-blend-screen" />
          </div>
          <div className="relative z-10 flex flex-col items-start gap-6 px-8 py-16 md:px-16 md:py-20">
            <FadeIn className="flex w-full flex-col gap-6 text-left">
              <div className="flex items-center gap-3 text-sm uppercase tracking-[0.4em] text-[#B5FF00]">
                <span className="h-px flex-1 bg-[#B5FF00]/40" />
                <span>Gateway Cliente</span>
                <span className="h-px flex-1 bg-[#B5FF00]/40" />
              </div>
              <h1 className="text-4xl font-bold uppercase leading-tight text-white md:text-6xl">
                Elegí tu entrenamiento. Superá tus límites.
              </h1>
              <p className="max-w-2xl text-base text-neutral-300 md:text-lg">
                Planes diseñados por entrenadores certificados. Seleccioná tu perfil, objetivo y desbloqueá rutinas con enfoque técnico y resultados medibles.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Button
                  size="lg"
                  rounded="full"
                  className="bg-[#B5FF00] px-8 py-4 text-base font-semibold uppercase tracking-wide text-black transition-transform hover:-translate-y-0.5 hover:bg-[#c7ff3d]"
                  onClick={handleStart}
                >
                  Comenzar selección
                </Button>
                <Button
                  variant="outline"
                  color="neutral"
                  rounded="full"
                  className="border border-[#B5FF00]/40 bg-transparent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-neutral-200 hover:border-[#B5FF00] hover:bg-[#B5FF00]/10"
                  onClick={() => document.getElementById('rutinas')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Ver planes disponibles
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>

        <div ref={genderRef} className="mt-14 md:mt-20">
          <GenderSelector selectedGender={selectedGender} onSelect={setSelectedGender} />
        </div>

        <TransitionBox variant="fade-up">
          <GoalSelector selectedGoal={selectedGoal} onSelect={setSelectedGoal} readyForRoutines={readyForRoutines} />
        </TransitionBox>

        <TransitionBox id="rutinas" variant="fade-up" delay={120}>
          <RoutineCarousel routines={filteredRoutines} onPreview={setPreviewRoutine} />
        </TransitionBox>

        <TransitionBox id="pago" variant="fade-up" delay={160}>
          <PaymentSection routine={selectedRoutine} />
        </TransitionBox>
      </section>

      <RoutinePreviewModal
        routine={previewRoutine}
        open={Boolean(previewRoutine)}
        onClose={() => setPreviewRoutine(null)}
        onSelect={(routine) => {
          setSelectedRoutine(routine);
          setPreviewRoutine(null);
          document.getElementById('pago')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />
    </div>
  );
}

export default ClientRoutineSelection;
