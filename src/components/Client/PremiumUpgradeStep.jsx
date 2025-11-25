import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

function PremiumUpgradeStep({
  routine,
  planType,
  onSelectPlan,
  premiumAddonPrice = 6000,
}) {
  if (!routine) {
    return null;
  }

  const isPremium = planType === "premium";
  const totalPremium = routine.price + premiumAddonPrice;

  const goToCheckout = (selectedPlan) => {
    onSelectPlan(selectedPlan);
    const checkoutSection = document.getElementById("checkout-section");
    if (checkoutSection) {
      checkoutSection.scrollIntoView({ behavior: "smooth", block: "start" });
      checkoutSection.classList.add("animate-glow");
      setTimeout(() => checkoutSection.classList.remove("animate-glow"), 1000);
    }
  };

  const essentialFeatures = [
    "Rutina personalizada por bloques",
    "Progresión semanal estructurada",
    "Descripciones técnicas de ejercicios",
    "Acceso a plataforma online"
  ];

  const premiumFeatures = [
    ...essentialFeatures,
    "📘 Ebook Nutrición MZ (PDF)",
    "💬 Comunidad privada MZ",
    "🎯 Seguimiento nutricional básico",
    "⚡ Soporte prioritario"
  ];

  return (
    <section className="mt-10 sm:mt-12 md:mt-16 bg-black border-t border-zinc-800 py-16 sm:py-20 md:py-24 -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-xs sm:text-sm uppercase tracking-widest text-emerald-400 mb-4">
            Paso 03 - Opcional
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase text-white mb-6 leading-tight">
            Upgrade Your
            <br />
            Training Standard
          </h2>
          <p className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto">
            Sumá el Ebook de Nutrición MZ y acceso exclusivo a la Comunidad junto a Matías Ortiz.
          </p>
        </motion.div>

        {/* Plans Comparison */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12">

          {/* Essential Plan */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`relative rounded-2xl border p-6 md:p-8 transition-all duration-300 ${!isPremium
              ? "border-emerald-500 ring-2 ring-emerald-500/50 bg-emerald-500/5"
              : "border-zinc-800 bg-black/50"
              }`}
          >
            <div className="mb-6">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Essential
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl md:text-5xl font-black text-white">
                  ${routine.price.toLocaleString("es-AR")}
                </span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {essentialFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 text-zinc-300">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Premium Plan - Highlighted */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`relative rounded-2xl border p-6 md:p-8 transition-all duration-300 ${isPremium
              ? "border-emerald-500 ring-2 ring-emerald-500/50 bg-emerald-500/5"
              : "border-zinc-800 bg-black/50"
              }`}
          >
            {/* Premium Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="inline-block rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-black">
                Recomendado
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Premium
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl md:text-5xl font-black text-emerald-400">
                  ${totalPremium.toLocaleString("es-AR")}
                </span>
              </div>
              <p className="text-sm text-zinc-500 mt-1">
                +${premiumAddonPrice.toLocaleString("es-AR")} adicionales
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {premiumFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 text-zinc-300">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            type="button"
            onClick={() => goToCheckout("essential")}
            className="w-full sm:w-auto rounded-full border-2 border-emerald-500 bg-transparent px-10 py-4 text-base font-bold uppercase tracking-wide text-emerald-500 transition-all duration-300 hover:bg-emerald-500/10 hover:border-emerald-400 hover:scale-105"
          >
            Continuar con Essential
          </button>
          <button
            type="button"
            onClick={() => goToCheckout("premium")}
            className="w-full sm:w-auto rounded-full bg-emerald-500 px-10 py-4 text-base font-bold uppercase tracking-wide text-black shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:bg-emerald-600 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/40"
          >
            Upgrade to Premium +${premiumAddonPrice.toLocaleString("es-AR")}
          </button>
        </motion.div>

        {/* Footer note */}
        <p className="text-center text-sm text-zinc-500 mt-8">
          Podrás cambiar esta selección antes de confirmar tu pago.
        </p>
      </div>
    </section>
  );
}

export default PremiumUpgradeStep;
