import React from "react";
import { motion } from "framer-motion";
import training2 from "@/assets/training-2.jpg";

function TrainWithTheBest() {
    return (
        <section className="bg-black py-20 md:py-28 lg:py-32 border-t border-zinc-900">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
                <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">

                    {/* Image Left */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6 }}
                        className="relative aspect-square md:aspect-[4/5] overflow-hidden rounded-2xl"
                    >
                        <img
                            src={training2}
                            alt="Matías Ortiz Training"
                            className="w-full h-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent" />

                        {/* Emerald Accent Corner */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/30 to-transparent" />
                    </motion.div>

                    {/* Content Right */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-left"
                    >
                        {/* Overline */}
                        <p className="text-emerald-400 text-xs sm:text-sm uppercase tracking-widest mb-4">
                            Sobre MZ Training
                        </p>

                        {/* Title */}
                        <h2 className="text-white text-4xl sm:text-5xl md:text-6xl font-black uppercase mb-6 leading-tight">
                            Entrená Con
                            <br />
                            Los Mejores
                        </h2>

                        {/* Description */}
                        <p className="text-zinc-300 text-base md:text-lg leading-relaxed mb-6">
                            Programación periodizada por bloques, seguimiento técnico semanal y ajustes personalizados según tu evolución. No trabajamos con métodos genéricos ni promesas vacías.
                        </p>

                        <p className="text-zinc-300 text-base md:text-lg leading-relaxed mb-8">
                            Cada plan está diseñado con ciencia del deporte, biomecánica aplicada y estrategias nutricionales validadas. Tu progreso es medible, tu técnica es prioritaria y tus resultados son reales.
                        </p>

                        {/* Key Points */}
                        <ul className="space-y-4 mb-8">
                            {[
                                "Programación por bloques periodizados",
                                "Seguimiento semanal y ajustes continuos",
                                "Enfoque técnico en cada ejercicio",
                                "Resultados medibles y progreso real"
                            ].map((point, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    </div>
                                    <span className="text-white font-medium">
                                        {point}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {/* CTA */}
                        <button className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-10 py-4 text-base font-bold uppercase tracking-wide text-black transition-all duration-300 hover:bg-emerald-600 hover:scale-105 shadow-lg shadow-emerald-500/25">
                            Conocer Más
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default TrainWithTheBest;
