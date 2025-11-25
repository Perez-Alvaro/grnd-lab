import React from "react";
import { motion } from "framer-motion";
import training1 from "@/assets/training-1.jpg";
import training2 from "@/assets/training-2.jpg";
import training3 from "@/assets/training-3.jpg";

const programs = [
    {
        id: 1,
        title: "Fuerza & Hipertrofia",
        image: training1,
        description: "Bloques periodizados de fuerza y volumen"
    },
    {
        id: 2,
        title: "Pérdida de Grasa & Rendimiento",
        image: training2,
        description: "Entrenamiento híbrido de alta densidad"
    },
    {
        id: 3,
        title: "Movilidad & Rehabilitación",
        image: training3,
        description: "Protocolos correctivos y recuperación"
    }
];

function ProgramsGrid() {
    return (
        <section className="bg-black py-20 md:py-28 lg:py-32 border-t border-zinc-900">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">

                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <p className="text-emerald-400 text-xs sm:text-sm uppercase tracking-widest mb-4">
                        Programas Disponibles
                    </p>

                    <h2 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase mb-6 leading-tight">
                        Elegí Tu
                        <br />
                        Objetivo
                    </h2>

                    <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto">
                        Planes diseñados para cada objetivo específico. Seleccioná el que mejor se adapte a vos.
                    </p>
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
                            className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-zinc-900 cursor-pointer"
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
                                <p className="text-zinc-300 text-sm mb-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                    {program.description}
                                </p>

                                {/* Title */}
                                <h3 className="text-white text-2xl md:text-3xl font-black uppercase mb-4 leading-tight">
                                    {program.title}
                                </h3>

                                {/* CTA Arrow */}
                                <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-sm tracking-wide">
                                    <span>Ver Planes</span>
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
            </div>
        </section>
    );
}

export default ProgramsGrid;
