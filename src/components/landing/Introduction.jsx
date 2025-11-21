import React from "react";
import Lightning from "./Lightning.jsx";

function Introduction() {
    return (
        <section className="relative overflow-hidden py-16 sm:py-20 md:py-28 lg:py-32">
            {/* Lightning Background - Cyan MZ color */}
            <div className="absolute inset-0">
                <Lightning
                    hue={170}
                    xOffset={0}
                    speed={0.5}
                    intensity={0.8}
                    size={1.2}
                />
            </div>

            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/70 via-[#050505]/50 to-[#050505]/70" />

            <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 md:px-8">
                {/* Overline */}
                <div className="mb-6 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.4em] text-[#0EF2A0] sm:mb-8 sm:text-sm">
                    <span className="h-px w-12 bg-[#0EF2A0]/60 sm:w-16" />
                    <span>Sumate al team MZ</span>
                    <span className="h-px w-12 bg-[#0EF2A0]/60 sm:w-16" />
                </div>

                {/* Main heading - Strong typography */}
                <h2 className="mb-6 text-4xl font-bold !text-white sm:mb-8 sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                    Entrenamiento diseñado para{" "}
                    <span className="bg-gradient-to-r from-[#0EF2A0] via-[#00C0A3] to-[#0EF2A0] bg-clip-text text-transparent">
                        resultados reales
                    </span>
                </h2>

                {/* Elevator pitch - Strong body text */}
                <p className="mx-auto max-w-3xl text-base leading-relaxed !text-gray-300 sm:text-lg md:text-xl lg:text-2xl">
                    Ciencia del deporte, registro de datos y programación personalizada.
                    Sin métodos genéricos, sin fórmulas mágicas — solo estrategia, técnica y progreso medible.
                </p>
            </div>
        </section>
    );
}

export default Introduction;
