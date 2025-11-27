import React from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import training2 from "@/assets/training-2.jpg";

function Asesorias() {
  const WHATSAPP_URL = "https://wa.me/5493512800414?text=Hola%20Mati%2C%20vi%20tus%20asesor%C3%ADas%20por%20la%20p%C3%A1gina%20y%20me%20encantar%C3%ADa%20saber%20m%C3%A1s";

  return (
    <section
      id="asesorias"
      className="relative overflow-hidden bg-black py-20 md:py-28 lg:py-32 border-y border-zinc-900"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={training2}
          alt="Personal Training"
          className="w-full h-full object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 text-center">

        {/* Overline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs sm:text-sm uppercase tracking-widest !text-emerald-400 mb-6"
        >
          Entrenamiento Personalizado
        </motion.p>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase !text-white mb-6 leading-tight"
        >
          Asesoría 1:1
          <br />
          <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
            Con Matías Ortiz
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl lg:text-2xl !text-zinc-300 mb-4 leading-relaxed max-w-3xl mx-auto"
        >
          Plan diseñado 100% para vos. Ajustes semanales según tu evolución. Seguimiento técnico directo conmigo para alcanzar tu objetivo de forma sostenible.
        </motion.p>

        {/* Features List */}
        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-base md:text-lg !text-zinc-400 mb-10 space-y-2 max-w-2xl mx-auto"
        >
          <li>✓ Plan diseñado 100% a medida</li>
          <li>✓ Ajustes semanales según tu evolución</li>
          <li>✓ Seguimiento nutricional básico</li>
          <li>✓ Soporte directo por WhatsApp</li>
        </motion.ul>

        {/* Big CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 rounded-full bg-emerald-500 px-10 py-5 text-lg font-black uppercase tracking-wide text-black shadow-2xl shadow-emerald-500/30 transition-all duration-300 hover:bg-emerald-600 hover:scale-105 hover:shadow-3xl hover:shadow-emerald-500/50"
          >
            <MessageCircle className="h-6 w-6" />
            Consultar por WhatsApp
          </a>
        </motion.div>

        {/* Small note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6 text-sm !text-zinc-500"
        >
          Cupos limitados · Respuesta en 24hs
        </motion.p>
      </div>
    </section >
  );
}

export default Asesorias;
