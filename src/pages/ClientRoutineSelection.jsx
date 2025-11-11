import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Container, FadeIn, TransitionBox } from '../components/reactbits/index.js';
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
    <div className="bg-gradient-to-b from-[#f5f6f3] via-[#f7f8f2] to-[#eef0e3] text-neutral-900">
      <section ref={heroRef} className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden py-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#f5f6f3] via-[#f0f2e8] to-[#e7eadb]" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571019613576-2b22c76fd955?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-20" />
        </div>
        <Container className="relative z-10 max-w-4xl text-center">
          <FadeIn className="space-y-6">
            <span className="inline-flex items-center justify-center rounded-full bg-white/70 px-5 py-2 text-sm font-semibold text-neutral-600 shadow-md">
              Nueva pasarela emocional MZ Experience
            </span>
            <h1 className="text-4xl font-extrabold text-neutral-900 md:text-6xl">
              Transformá tu energía con rutinas guiadas paso a paso
            </h1>
            <p className="text-lg text-neutral-700 md:text-xl">
              Deslizá por una experiencia inmersiva, conectá con tu propósito y desbloqueá la rutina que mejor acompaña tu momento vital.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                color="primary"
                rounded="full"
                size="lg"
                className="shadow-xl hover:shadow-2xl"
                onClick={handleStart}
              >
                Comenzar mi transformación
              </Button>
              <Button
                variant="ghost"
                color="neutral"
                rounded="full"
                size="md"
                onClick={() => document.getElementById('rutinas')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Ver rutinas
              </Button>
            </div>
          </FadeIn>
        </Container>
      </section>

      <div ref={genderRef}>
        <GenderSelector selectedGender={selectedGender} onSelect={setSelectedGender} onCta={() => document.getElementById('objetivo')?.scrollIntoView({ behavior: 'smooth' })} />
      </div>

      <TransitionBox variant="fade-up">
        <GoalSelector selectedGoal={selectedGoal} onSelect={setSelectedGoal} readyForRoutines={readyForRoutines} />
      </TransitionBox>

      <RoutineCarousel
        routines={filteredRoutines}
        onPreview={setPreviewRoutine}
        onSelect={(routine) => {
          setPreviewRoutine(routine);
        }}
      />

      <PaymentSection routine={selectedRoutine} />

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
