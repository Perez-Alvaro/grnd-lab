import React, { useState } from 'react';
import RoutineSelector from '../components/RoutineSelector.jsx';
import PlanSelector from '../components/PlanSelector.jsx';
import PaymentForm from '../components/PaymentForm.jsx';
import Hero from '../components/Hero.jsx';

function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleRoutineSelect = (routine) => {
    setSelectedRoutine(routine);
    setCurrentStep(2);
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setCurrentStep(3);
  };

  const handleBackToRoutineSelection = () => {
    setCurrentStep(1);
    setSelectedRoutine(null);
  };

  const handleBackToPlanSelection = () => {
    setCurrentStep(2);
    setSelectedPlan(null);
  };

  return (
    <div className="min-h-screen">
      {currentStep === 1 && <Hero />}
      
      <div className="container mx-auto px-4 py-8">
        {currentStep === 1 && (
          <RoutineSelector onSelect={handleRoutineSelect} />
        )}
        
        {currentStep === 2 && (
          <PlanSelector
            routine={selectedRoutine}
            onSelect={handlePlanSelect}
            onBack={handleBackToRoutineSelection}
          />
        )}
        
        {currentStep === 3 && (
          <PaymentForm
            routine={selectedRoutine}
            plan={selectedPlan}
            onBack={handleBackToPlanSelection}
          />
        )}
      </div>
    </div>
  );
}

export default Home;