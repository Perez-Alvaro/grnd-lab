import React from "react";
import { motion } from "framer-motion";
import user1 from "@/assets/user1.jpg";
import user2 from "@/assets/user2.jpg";
import user3 from "@/assets/user3.jpg";
import training1 from "@/assets/training-1.jpg";

const transformations = [
    {
        id: 1,
        name: "Nicolás M.",
        result: "-12kg en 16 semanas",
        image: user1,
        badge: "Pérdida de Grasa"
    },
    {
        id: 2,
        name: "Florencia S.",
        result: "+8kg músculo magro",
        image: user2,
        badge: "Hipertrofia"
    },
    {
        id: 3,
        name: "David S.",
        result: "Fuerza +45% en sentadilla",
        image: user3,
        badge: "Fuerza"
    },
    {
        id: 4,
        name: "María L.",
        result: "Recuperación completa",
        image: training1,
        badge: "Rehabilitación"
    }
];

function TransformationGallery({ onViewPlans }) {
    return (
        <section className="bg-black py-20 md:py-28 lg:py-32">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">

                {/* Overline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="!text-emerald-400 text-xs sm:text-sm uppercase tracking-widest text-center mb-4 md:mb-6"
                >
                    Historias Reales
                </motion.p>

                {/* Title with stagger animation */}
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="!text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase text-center mb-12 md:mb-16 lg:mb-20 leading-tight"
                >
                    Tu Transformación
                    <br />
                    Empieza Acá
                </motion.h2>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {transformations.map((item, index) => (
                        <motion.article
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative overflow-hidden rounded-2xl aspect-[3/4] bg-zinc-900"
                        >
                            {/* Image */}
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                {/* Badge */}
                                <div className="inline-block mb-3">
                                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 !text-emerald-400 text-xs font-bold uppercase tracking-wide">
                                        {item.badge}
                                    </span>
                                </div>

                                {/* Name */}
                                <h3 className="!text-white text-xl font-bold mb-2">
                                    {item.name}
                                </h3>

                                {/* Result */}
                                <p className="!text-zinc-300 text-sm font-medium">
                                    {item.result}
                                </p>
                            </div>

                            {/* Hover Accent Line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                        </motion.article>
                    ))}
                </div>

                {/* Optional CTA */}
                <div className="mt-12 md:mt-16 text-center">
                    <p className="!text-zinc-400 text-base md:text-lg mb-6">
                        Sumate a cientos de personas que ya están transformando su cuerpo
                    </p>
                    <button
                        onClick={onViewPlans}
                        className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-10 py-4 text-base font-bold uppercase tracking-wide text-black transition-all duration-300 hover:bg-emerald-600 hover:scale-105 shadow-lg shadow-emerald-500/25 animate-pulse hover:animate-none"
                    >
                        Ver Todos los Planes
                    </button>
                </div>
            </div>
        </section>
    );
}

export default TransformationGallery;
