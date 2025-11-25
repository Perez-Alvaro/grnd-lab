import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
    {
        id: 1,
        question: "¿Cómo funciona el sistema de selección de rutinas?",
        answer: "Primero seleccionás tu perfil (genero biológico), luego tu objetivo (hipertrofia, pérdida de grasa, etc.) y el sistema te muestra las rutinas diseñadas específicamente para vos. Todas están creadas y supervisadas por Matías Ortiz."
    },
    {
        id: 2,
        question: "¿Qué incluye el plan Essential?",
        answer: "El plan Essential incluye: rutina completa periodizada por bloques en formato PDF, progresión semana a semana, y descripciones técnicas de cada ejercicio."
    },
    {
        id: 3,
        question: "¿Qué incluye el plan Premium?",
        answer: "El plan Premium incluye todo lo del Essential + ebook de nutrición en PDF + acceso a la comunidad privada de WhatsApp con Matías para soporte directo."
    },
    {
        id: 4,
        question: "¿Puedo cambiar de plan después de comprar?",
        answer: "Sí, podés hacer upgrade de Essential a Premium en cualquier momento. Solo contactá a Matías mostrándole tu mail y nombre de compra, y él te brindará acceso al ebook y la comunidad."
    },
    {
        id: 5,
        question: "¿Necesito experiencia previa en el gym?",
        answer: "No es obligatorio. Los planes están pensados para distintos niveles de experiencia. Cada ejercicio viene con progresiones técnicas y variantes según dónde estés parado hoy."
    },
    {
        id: 6,
        question: "¿Cuánto dura cada programa?",
        answer: "Los programas tienen duraciones entre 1 y 4 semanas dependiendo del objetivo. Están diseñados por bloques que podés renovar o modificar según tu evolución."
    }
];

function FAQItem({ faq, isOpen, onClick }) {
    return (
        <motion.div
            initial={false}
            className="border-b border-zinc-800 last:border-b-0 py-2"
        >
            <button
                onClick={onClick}
                className="w-full px-6 py-6 md:px-8 md:py-7 flex justify-between items-center text-left gap-6 group"
            >
                <span className="text-lg md:text-xl font-bold !text-white group-hover:text-emerald-400 transition-colors duration-300 leading-relaxed">
                    {faq.question}
                </span>
                <ChevronDown
                    className={`flex-shrink-0 w-6 h-6 text-emerald-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <p className="px-6 pb-6 md:px-8 md:pb-7 pt-2 !text-zinc-300 text-base md:text-lg leading-relaxed">
                            {faq.answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function FAQ() {
    const [openId, setOpenId] = useState(null);

    const toggleFAQ = (id) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <section className="bg-black py-20 md:py-28 lg:py-32 border-t border-zinc-900">
            <div className="max-w-4xl mx-auto px-6 sm:px-8">

                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="!text-emerald-400 text-xs sm:text-sm uppercase tracking-widest mb-4"
                    >
                        FAQ
                    </motion.p>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="!text-white text-4xl sm:text-5xl md:text-6xl font-black uppercase mb-6 leading-tight"
                    >
                        Preguntas
                        <br />
                        Frecuentes
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="!text-zinc-400 text-base md:text-lg"
                    >
                        Todo lo que necesitás saber sobre los programas MZ Training
                    </motion.p>
                </div>

                {/* FAQ List */}
                <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl overflow-hidden">
                    <div className="divide-y divide-zinc-800">
                        {faqs.map((faq) => (
                            <FAQItem
                                key={faq.id}
                                faq={faq}
                                isOpen={openId === faq.id}
                                onClick={() => toggleFAQ(faq.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* Contact CTA */}
                <div className="mt-12 md:mt-16 text-center">
                    <p className="!text-zinc-400 text-base md:text-lg mb-6">
                        ¿Algo más que quieras saber?
                    </p>
                    <a
                        href="https://wa.me/5493512800414"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-full border-2 border-emerald-500 bg-transparent px-10 py-4 text-base font-bold uppercase tracking-wide !text-emerald-500 transition-all duration-300 hover:bg-emerald-500/10 hover:border-emerald-400 hover:scale-105"
                    >
                        Hablemos por WhatsApp
                    </a>
                </div>
            </div>
        </section>
    );
}

export default FAQ;
