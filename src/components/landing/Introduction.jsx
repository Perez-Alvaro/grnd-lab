import React from "react";

function Introduction() {
    return (
        <section className="relative overflow-hidden bg-black py-16 sm:py-20 md:py-28 lg:py-32 border-t border-zinc-900">
            {/* Optional subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/50 to-transparent" />

            <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 md:px-8">
                {/* Overline */}
                <div className="mb-6 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.4em] text-emerald-400 sm:mb-8 sm:text-sm">
                    <span className="h-px w-12 bg-emerald-500/40 sm:w-16" />
                    <span>Tu transformación empieza acá</span>
                    <span className="h-px w-12 bg-emerald-500/40 sm:w-16" />
                </div>

                {/* Main heading - Strong typography */}
                <h2 className="mb-6 text-4xl font-bold !text-white sm:mb-8 sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                    Planes que se adaptan a{" "}
                    <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
                        vos
                    </span>
                    {" "}diseñados para{" "}
                    <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
                        resultados medibles
                    </span>
                </h2>

                {/* Elevator pitch - Strong body text */}
                <p className="mx-auto max-w-3xl text-base leading-relaxed !text-zinc-300 sm:text-lg md:text-xl lg:text-2xl">
                    Programación por bloques, seguimiento semanal y técnica aplicada. Sin promesas vacías — solo estrategia, progreso real y un método que funciona.
                </p>
            </div>
        </section>
    );
}

export default Introduction;
