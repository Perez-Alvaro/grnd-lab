import React from "react";
import { motion } from "framer-motion";
import { OBJECTIVE_MAPPING, OBJECTIVE_DESCRIPTIONS } from "@/constants/objectives.js";
import training1 from "@/assets/training-1.jpg";
import training2 from "@/assets/training-2.jpg";
import training3 from "@/assets/training-3.jpg";

// Map objectives to images and create programs array
const programs = [
    {
        id: 1,
        objective: "Volumen (Fuerza e Hipertrofia)",
        title: "Volumen",
        subtitle: "Fuerza e Hipertrofia",
        image: training1,
        description: "Programación orientada a hipertrofia muscular y fuerza progresiva. Bloques de trabajo con énfasis en volumen técnico y sobrecarga gradual."
    },
    {
        id: 2,
        objective: "Pérdida de Grasa (Fuerza y Resistencia)",
        title: "Pérdida de Grasa",
        subtitle: "Fuerza y Resistencia",
        image: training2,
        description: OBJECTIVE_DESCRIPTIONS['fat_loss']
    },
    {
        id: 3,
        objective: "Recomposición (Fuerza y Movilidad)",
        title: "Recomposición",
        subtitle: "Fuerza y Movilidad",
        image: training3,
        description: "Ganancia muscular con pérdida de grasa simultánea. Fuerza como base, movilidad funcional y progresión técnica como pilares."
    }
];

function ProgramsGrid() {
    const handleProgramClick = () => {
        const planesSection = document.getElementById('planes');
        if (planesSection) {
            planesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <section className="bg-black py-20 md:py-28 lg:py-32 border-t border-zinc-900">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">

                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="!text-emerald-400 text-xs sm:text-sm uppercase tracking-widest mb-4"
                    >
                        Programas Disponibles
                    </motion.p>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="!text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase mb-6 leading-tight"
                    >
                        Seleccioná Tu
                        <br />
                        Meta
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="!text-zinc-400 text-base md:text-lg max-w-2xl mx-auto"
                    >
                        Planes diseñados para cada objetivo específico. Seleccioná el que mejor se adapte a vos.
                    </motion.p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {programs.map((program, index) => (
                        <motion.article
                            key={program.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            onClick={handleProgramClick}
                            className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-zinc-900 cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                        >
                            {/* Background Image */}
                            <img
                                src={program.image}
                                alt={program.title}
                                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40 transition-opacity duration-500 group-hover:from-black group-hover:via-black/90" />

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col justify-end p-8">
                                {/* Description */}
                                <p className="!text-zinc-300 text-sm mb-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                    {program.description}
                                </p>

                                {/* Title */}
                                <h3 className="!text-white text-2xl md:text-3xl font-black uppercase mb-1 leading-tight">
                                    {program.title}
                                </h3>

                                {/* Subtitle */}
                                <p className="!text-emerald-400 text-sm font-semibold uppercase mb-4 tracking-wide">
                                    {program.subtitle}
                                </p>

                                {/* CTA Arrow */}
                                <div className="flex items-center gap-2 !text-emerald-400 font-bold uppercase text-sm tracking-wide">
                                    <span>Comenzá Ahora</span>
                                    <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>

                            {/* Emerald Top Border */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                        </motion.article>
                    ))}
                </div>

                {/* Prominent CTA below grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-12 md:mt-16 text-center"
                >
                    <p className="!text-zinc-300 text-lg md:text-xl mb-6 font-medium">
                        ¿Arrancamos?
                    </p>
                    <button
                        onClick={handleProgramClick}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-12 py-5 text-lg font-black uppercase tracking-wide text-black transition-all duration-300 hover:bg-emerald-600 hover:scale-105 shadow-2xl shadow-emerald-500/40 animate-pulse hover:animate-none"
                    >
                        Seleccioná Tu Rutina Ahora
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </motion.div>
            </div>
        </section>
    );
}

export default ProgramsGrid;
