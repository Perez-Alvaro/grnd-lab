import React from "react";
import { motion } from "framer-motion";

function Introduction() {
    return (
        <section className="relative overflow-hidden bg-black py-16 sm:py-20 md:py-28 lg:py-32 border-t border-zinc-900">
            {/* Optional subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/50 to-transparent" />

            <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 md:px-8">
                {/* Overline with animated bars */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-6 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.4em] text-emerald-400 sm:mb-8 sm:text-sm"
                >
                    <motion.span
                        initial={{ width: 0 }}
                        whileInView={{ width: "3rem" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-px bg-emerald-500/40 sm:w-16"
                    />
                    <span>Tu transformación empieza acá</span>
                    <motion.span
                        initial={{ width: 0 }}
                        whileInView={{ width: "3rem" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-px bg-emerald-500/40 sm:w-16"
                    />
                </motion.div>

                {/* Main heading - Strong typography with animation */}
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-6 text-4xl font-bold !text-white sm:mb-8 sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
                >
                    Metodología clara. Progresión por bloques.{" "}
                    <motion.span
                        initial={{ backgroundPosition: "200% center" }}
                        whileInView={{ backgroundPosition: "0% center" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 bg-clip-text text-transparent"
                        style={{ backgroundSize: "200% auto" }}
                    >
                        Resultados que podés medir.
                    </motion.span>
                </motion.h2>

                {/* Elevator pitch - Strong body text with fade-in */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    className="mx-auto max-w-3xl text-base leading-relaxed !text-zinc-300 sm:text-lg md:text-xl lg:text-2xl"
                >
                    Programación por bloques, seguimiento semanal y técnica aplicada. Sin promesas vacías — solo estrategia, progreso real y un método que funciona.
                </motion.p>
            </div>
        </section>
    );
}

export default Introduction;
