import React from "react";
import user1 from "@/assets/user1.jpg";
import user2 from "@/assets/user2.jpg";
import user3 from "@/assets/user3.jpg";

const testimonials = [
  {
    name: "Nicolás Miranda",
    quote:
      "Me siento re bien organizado desde que comencé el plan. Entreno mejor y siento que estoy más cerca de mis objetivos.",
    avatar: user1,
  },
  {
    name: "Florencia Stork",
    quote:
      "Con el programa pude cumplir mis objetivos y desafiarme a seguir mejorando cada día.",
    avatar: user2,
  },
  {
    name: "David Svetliza",
    quote:
      "Logré sentirme fuerte, ágil y mejorar mi técnica. Ahora entreno mejor y con más eficacia.",
    avatar: user3,
  },
];

function Testimonios() {
  return (
    <section id="testimonios" className="space-y-6 sm:space-y-8">
      <header className="space-y-2 text-center sm:space-y-3 md:text-left">
        <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 sm:text-xs sm:tracking-[0.4em]">
          Resultados Reales
        </p>
        <h2 className="text-2xl font-semibold !text-white sm:text-3xl md:text-4xl">
          Testimonios
        </h2>
        <p className="text-sm !text-gray-300 sm:text-base md:text-lg">
          Clientes que están logrando sus objetivos con el método MZ.
        </p>
      </header>

      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 sm:gap-4 md:grid md:grid-cols-2 md:gap-5 md:snap-none md:overflow-visible md:pb-0 lg:grid-cols-3 lg:gap-6">
        {testimonials.map((testimonial) => (
          <article
            key={testimonial.name}
            className="min-w-[90%] snap-center rounded-2xl border border-emerald-500/20 bg-zinc-950/80 p-5 text-white transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/20 hover:border-emerald-500/40 sm:min-w-[85%] sm:rounded-3xl sm:p-6 md:min-w-0"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <img
                src={testimonial.avatar}
                alt={`Foto de ${testimonial.name}`}
                className="h-12 w-12 rounded-full object-cover sm:h-14 sm:w-14"
              />
              <div>
                <p className="text-sm font-semibold !text-white sm:text-base">
                  {testimonial.name}
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs !text-gray-300 sm:mt-4 sm:text-sm">{testimonial.quote}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Testimonios;
