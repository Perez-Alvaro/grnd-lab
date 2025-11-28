import React from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import matiPhoto from "@/assets/mati.jpg";

function TrainWithMati() {
    const WHATSAPP_URL = "https://wa.me/5493512800414";

    return (
        <section
            id="train-with-mati"
            className="relative bg-black py-20 md:py-28 lg:py-32 border-t border-zinc-900 overflow-hidden"
        >
            {/* Background Gradient Accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 blur-[100px] rounded-full" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8">
                <div className="grid md:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-center">

                    {/* Left Content Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6 }}
                        className="text-left md:pr-8"
                    >
                        {/* Overline */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="!text-emerald-400 text-xs sm:text-sm uppercase tracking-widest mb-4 font-bold"
                        >
                            Sobre Mí
                        </motion.p>

                        {/* Main Title */}
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className="!text-white text-5xl sm:text-6xl md:text-7xl font-black uppercase mb-6 leading-[0.9]"
                        >
                            Entrenemos
                            <br />
                            Juntos
                        </motion.h2>

                        {/* Quote Section */}
                        <div className="border-l-4 border-emerald-500 pl-6 mb-8">
                            <p className="!text-zinc-300 text-base md:text-lg leading-relaxed italic mb-4">
                                "El estándar no se trata de ser perfecto, se trata de ser mejor. Superar contratiempos con humildad, sabiendo que la verdadera victoria está en no rendirse nunca. El éxito es la capacidad de levantarse y construir una vida que refleje tus más altos estándares."
                            </p>
                            <p className="!text-emerald-400 text-sm font-bold uppercase tracking-wider">
                                — Matías Ortiz, Personal Trainer
                            </p>
                        </div>

                        {/* Description */}

                        {/* Key Features Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                            {[
                                "Programación periodizada por bloques de entrenamiento",
                                "Seguimiento semanal y ajustes según tu respuesta",
                                "Técnica como prioridad en cada movimiento",
                                "Progresiones claras y adaptadas a vos",
                                "Soporte directo por WhatsApp",
                                "Resultados medibles, sin promesas mágicas"
                            ].map((point, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    </div>
                                    <span className="!text-white font-medium text-sm md:text-base">
                                        {point}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href={WHATSAPP_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-3 rounded-full bg-emerald-500 px-8 py-4 text-base font-black uppercase tracking-wide text-black transition-all duration-300 hover:bg-emerald-600 hover:scale-105 shadow-lg shadow-emerald-500/25"
                            >
                                <MessageCircle className="h-5 w-5" />
                                Asesoría 1:1
                            </a>
                            <a
                                href="#planes"
                                className="inline-flex items-center justify-center rounded-full border-2 border-emerald-500 px-8 py-4 text-base font-bold uppercase tracking-wide !text-emerald-400 transition-all duration-300 hover:bg-emerald-500/10 hover:scale-105"
                            >
                                Ver Planes
                            </a>
                        </div>

                        {/* Small Note */}
                        <p className="mt-6 text-sm !text-zinc-500">
                            Cupos limitados · Respuesta en 24hs
                        </p>
                    </motion.div>

                    {/* Right Image Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-2xl">
                            <img
                                src={matiPhoto}
                                alt="Matías Ortiz - MZ Training"
                                className="w-full h-full object-cover object-center"
                            />

                            {/* Gradient Overlays */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />

                            {/* Emerald Accent Corner */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/40 to-transparent" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-500/30 to-transparent" />

                            {/* Badge Overlay */}
                            <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-sm border border-emerald-500/30 rounded-xl p-4">
                                <p className="!text-emerald-400 text-xs uppercase tracking-wider font-bold mb-1">
                                    Matías Ortiz
                                </p>
                                <p className="!text-white text-sm font-medium">
                                    Personal Trainer & Coach
                                </p>
                                <p className="!text-zinc-400 text-xs mt-2">
                                    +5 años transformando vidas
                                </p>
                            </div>
                        </div>

                        {/* Floating Stats Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="absolute -bottom-6 -right-6 bg-black border border-emerald-500/30 rounded-xl p-4 shadow-xl hidden md:block"
                        >
                            <p className="!text-emerald-400 text-3xl font-black">200+</p>
                            <p className="!text-white text-sm font-medium">Clientes</p>
                            <p className="!text-zinc-500 text-xs">Transformados</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="absolute top-4 right-4 bg-black/90 backdrop-blur-sm border border-emerald-500/30 rounded-xl p-4 shadow-xl hidden md:block"
                        >
                            <p className="!text-emerald-400 text-3xl font-black">100%</p>
                            <p className="!text-white text-sm font-medium">Personalizado</p>
                            <p className="!text-zinc-500 text-xs">A tu medida</p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default TrainWithMati;
