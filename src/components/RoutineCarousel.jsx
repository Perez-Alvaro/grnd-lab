import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardMedia,
  Carousel,
  CarouselItem,
  Container,
  FadeIn,
  Tag
} from './reactbits/index.js';

function RoutineCard({ routine, onPreview, onSelect }) {
  return (
    <Card interactive className="flex h-full flex-col overflow-hidden">
      <CardMedia className="relative h-56">
        <img src={routine.image} alt={routine.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
          {routine.highlights.map((highlight) => (
            <Tag key={highlight} tone="lime" className="bg-white/10 text-white border-white/30">
              {highlight}
            </Tag>
          ))}
        </div>
      </CardMedia>
      <CardBody className="flex flex-1 flex-col gap-4">
        <div>
          <h3 className="text-xl font-semibold text-neutral-900">{routine.name}</h3>
          <p className="mt-2 text-sm text-neutral-600">{routine.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {routine.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between text-sm text-neutral-500">
          <span>{routine.duration}</span>
          <span className="font-semibold text-neutral-800">Nivel {routine.level}</span>
        </div>
      </CardBody>
      <CardFooter className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-neutral-400">Inversión</span>
            <p className="text-2xl font-bold text-neutral-900">${routine.price.toLocaleString('es-AR')}</p>
          </div>
          <Button variant="ghost" color="neutral" size="sm" onClick={() => onPreview(routine)}>
            Ver detalles
          </Button>
        </div>
        <Button color="lime" variant="outline" size="md" className="w-full" onClick={() => onSelect(routine)}>
          Seleccionar
        </Button>
      </CardFooter>
    </Card>
  );
}

function RoutineCarousel({ routines, onPreview, onSelect }) {
  if (!routines.length) {
    return (
      <Container className="max-w-5xl">
        <FadeIn className="rounded-3xl border border-dashed border-neutral-300 bg-white/60 p-12 text-center">
          <h3 className="text-2xl font-semibold text-neutral-800">Esperando tu selección ✨</h3>
          <p className="mt-3 text-neutral-600">
            Elegí género y objetivo para desbloquear las rutinas personalizadas que diseñamos para vos.
          </p>
        </FadeIn>
      </Container>
    );
  }

  return (
    <section id="rutinas" className="w-full py-20">
      <Container className="max-w-6xl">
        <FadeIn className="text-center">
          <span className="text-sm uppercase tracking-[0.45em] text-neutral-500">Paso 03</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-neutral-900">Tu universo de rutinas curadas</h2>
          <p className="mt-4 text-lg text-neutral-600">
            Filtramos planes emocionales según lo que necesitás ahora mismo. Exploralos y elegí tu match perfecto.
          </p>
        </FadeIn>

        <FadeIn delay={180} className="mt-12">
          <Carousel itemWidth={360} className="mx-auto">
            {routines.map((routine) => (
              <CarouselItem key={routine.id} className="h-full">
                <RoutineCard routine={routine} onPreview={onPreview} onSelect={onSelect} />
              </CarouselItem>
            ))}
          </Carousel>
        </FadeIn>
      </Container>
    </section>
  );
}

export default RoutineCarousel;
