import React from "react";

const testimonials = [
  {
    name: "Ezequiel P.",
    goal: "+6 kg de masa magra",
    quote:
      "Matías ajustó mis cargas cada semana y optimizó el volumen cuando mis métricas de HRV bajaron. Fue como tener un laboratorio deportivo en el bolsillo.",
    avatar:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Rocío L.",
    goal: "-8% grasa corporal",
    quote:
      "El plan integró conditioning inteligente y hábitos nutricionales sencillos. En 12 semanas sentí más energía y mis marcadores de fuerza subieron.",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Lucas M.",
    goal: "Rehabilitación de rodilla",
    quote:
      "Volví a competir gracias al foco en movilidad y trabajo isométrico. Todo se midió con feedback semanal y ajustes claros.",
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80",
  },
];

function Testimonios() {
  return (
    <section className="space-y-6 sm:space-y-8">
      <header className="space-y-2 text-center sm:space-y-3 md:text-left">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#00C0A3] sm:text-xs sm:tracking-[0.4em]">
          Resultados Reales
        </p>
        <h2 className="text-2xl font-semibold text-white sm:text-3xl md:text-4xl">
          Testimonios breves
        </h2>
        <p className="text-sm text-gray-300 sm:text-base md:text-lg">
          3 frases, métricas concretas y atletas que sostienen el rendimiento.
        </p>
      </header>

      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 sm:gap-4 md:grid md:grid-cols-2 md:gap-5 md:snap-none md:overflow-visible md:pb-0 lg:grid-cols-3 lg:gap-6">
        {testimonials.map((testimonial) => (
          <article
            key={testimonial.name}
            className="min-w-[90%] snap-center rounded-2xl border border-[#0AA66A]/60 bg-[#0b0b0b]/80 p-5 text-white transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_-30px_rgba(0,192,163,0.9)] sm:min-w-[85%] sm:rounded-3xl sm:p-6 md:min-w-0"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <img
                src={testimonial.avatar}
                alt={`Foto de ${testimonial.name}`}
                className="h-12 w-12 rounded-full object-cover sm:h-14 sm:w-14"
              />
              <div>
                <p className="text-sm font-semibold text-white sm:text-base">
                  {testimonial.name}
                </p>
                <p className="text-xs text-[#0EF2A0] sm:text-sm">{testimonial.goal}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-300 sm:mt-4 sm:text-sm">{testimonial.quote}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Testimonios;
