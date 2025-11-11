import React from 'react';
import { Button, Card, CardBody, Container, FadeIn } from './reactbits/index.js';
import { cn } from '../utils/cn.js';

const goals = [
  {
    id: 'fat_loss',
    title: 'Pérdida de grasa / recomposición',
    description: 'Definí tu silueta con entrenamientos metabólicos, circuitos de fuerza y hábitos sostenibles.'
  },
  {
    id: 'muscle_gain',
    title: 'Volumen / ganancia muscular',
    description: 'Activá fases de sobrecarga progresiva con énfasis en fuerza, potencia y recuperación inteligente.'
  }
];

function GoalSelector({ selectedGoal, onSelect, readyForRoutines }) {
  return (
    <section id="objetivo" className="w-full py-20">
      <Container className="max-w-4xl">
        <FadeIn className="text-center">
          <span className="text-sm uppercase tracking-[0.45em] text-neutral-500">Paso 02</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-neutral-900">¿Cuál es tu objetivo principal?</h2>
          <p className="mt-4 text-lg text-neutral-600">
            Seleccioná el tipo de transformación que buscás para personalizar la propuesta emocional.
          </p>
        </FadeIn>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {goals.map((goal, index) => (
            <FadeIn key={goal.id} delay={index * 140}>
              <Card
                interactive
                className={cn(
                  'border-2 border-transparent bg-white/70 backdrop-blur-sm transition-all duration-500 hover:border-[#d7ff00]/60',
                  selectedGoal === goal.id && 'border-[#d7ff00] bg-[#f7fbe6] shadow-xl'
                )}
              >
                <CardBody className="flex flex-col gap-4">
                  <h3 className="text-2xl font-semibold text-neutral-900">{goal.title}</h3>
                  <p className="text-sm text-neutral-600">{goal.description}</p>
                  <Button
                    variant={selectedGoal === goal.id ? 'solid' : 'outline'}
                    color="lime"
                    size="md"
                    rounded="full"
                    className={cn('mt-2 self-start', selectedGoal === goal.id && 'shadow-lg')}
                    onClick={() => onSelect(goal.id)}
                  >
                    {selectedGoal === goal.id ? 'Objetivo activado' : 'Seleccionar'}
                  </Button>
                </CardBody>
              </Card>
            </FadeIn>
          ))}
        </div>

        {readyForRoutines && (
          <FadeIn delay={260} className="mt-14 flex justify-center">
            <Button
              rounded="full"
              size="lg"
              color="lime"
              className="shadow-md hover:shadow-xl"
              onClick={() => document.getElementById('rutinas')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Ver mis rutinas recomendadas 💪
            </Button>
          </FadeIn>
        )}
      </Container>
    </section>
  );
}

export default GoalSelector;
