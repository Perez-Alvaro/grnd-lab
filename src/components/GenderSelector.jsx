import React from 'react';
import { Button, Card, Container, FadeIn } from './reactbits/index.js';
import { cn } from '../utils/cn.js';

const genderCards = [
  {
    id: 'male',
    label: 'Hombre',
    image: 'https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'female',
    label: 'Mujer',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80'
  }
];

function GenderSelector({ selectedGender, onSelect, onCta }) {
  return (
    <section id="genero" className="w-full py-20">
      <Container className="max-w-5xl">
        <FadeIn className="text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-900">Elegí quién sos hoy</h2>
          <p className="mt-4 text-lg text-neutral-600">
            Cada viaje se diseña diferente. Seleccioná la energía que te representa para activar tu camino.
          </p>
        </FadeIn>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {genderCards.map((card, index) => (
            <FadeIn key={card.id} delay={index * 120} className="h-full">
              <Card
                interactive
                className={cn(
                  'group relative h-full overflow-hidden border-2 border-transparent transition-all duration-500',
                  selectedGender === card.id ? 'ring-4 ring-[#d7ff00] ring-offset-4 ring-offset-transparent' : 'hover:border-[#d7ff00]/60'
                )}
              >
                <div className="absolute inset-0">
                  <img
                    src={card.image}
                    alt={card.label}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>
                <div className="relative z-10 flex h-full flex-col items-start justify-end p-10">
                  <span className="text-sm uppercase tracking-[0.4em] text-white/70">Paso 01</span>
                  <h3 className="mt-4 text-3xl font-bold text-white drop-shadow-lg">{card.label}</h3>
                  <p className="mt-3 max-w-xs text-sm text-white/80">
                    Entrenamientos creados con biomecánica específica y narrativa motivadora para acompañarte.
                  </p>
                  <Button
                    variant="outline"
                    color="primary"
                    rounded="full"
                    size="md"
                    className={cn(
                      'mt-6 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-white/40',
                      selectedGender === card.id && 'bg-[#d7ff00] text-neutral-900 border-transparent hover:bg-[#e4ff4d]'
                    )}
                    onClick={() => onSelect(card.id)}
                  >
                    {selectedGender === card.id ? 'Seleccionado' : 'Elegir'}
                  </Button>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={280} className="mt-12 flex justify-center">
          <Button
            rounded="full"
            size="lg"
            color="lime"
            className="shadow-lg hover:shadow-xl"
            onClick={onCta}
            disabled={!selectedGender}
          >
            Continuar con mi energía
          </Button>
        </FadeIn>
      </Container>
    </section>
  );
}

export default GenderSelector;
