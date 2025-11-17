import React from "react";
import { FadeIn } from "../Shared/reactbits/index.js";

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

  const upgradeButtonClasses = isPremium
    ? "bg-accent shadow-[0_10px_45px_-30px_rgba(181,255,0,0.8)]"
    : "bg-accent hover:bg-accent-strong";
  const continueButtonClasses = isPremium
    ? "border-brand-border text-gray-300 hover:border-gray-500"
    : "border-accent text-accent";
  const premiumAddonLabel = premiumAddonPrice.toLocaleString("es-AR");

  const goToCheckout = (selectedPlan) => {
    onSelectPlan(selectedPlan);
    const checkoutSection = document.getElementById("checkout-section");
    if (checkoutSection) {
      checkoutSection.scrollIntoView({ behavior: "smooth", block: "start" });
      checkoutSection.classList.add("animate-glow");
      setTimeout(() => checkoutSection.classList.remove("animate-glow"), 1000);
    }
  };

  return (
    <section className="mt-12 flex flex-col gap-6 rounded-3xl border border-brand-border bg-surface p-6 text-white shadow-[0_25px_80px_-50px_rgba(0,0,0,0.75)] md:p-10">
      <header className="text-center md:text-left space-y-2 md:space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-accent">
          Paso 03.5
        </p>
        <h3 className="mt-2 text-3xl font-semibold">
          Plan Premium MZ – Nutrición y Comunidad
        </h3>
        <p className="mt-2 text-sm text-gray-400">
          Sumá el Ebook oficial de Nutrición MZ 📘 y acceso exclusivo a la
          Comunidad MZ junto a Matías Ortiz.
        </p>
      </header>

      <FadeIn className="grid gap-6 rounded-2xl border border-brand-border bg-base p-6 md:grid-cols-[1.2fr_0.8fr] md:gap-8 md:p-8">
        <div className="space-y-4">
          <p className="text-sm text-gray-300">
            Entrená con un plan integral que combina tu rutina personalizada con
            educación nutricional y acompañamiento real.
          </p>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>📘 Ebook oficial de Nutrición MZ en PDF</li>
            <li>💬 Acceso a la comunidad privada MZ (email + WhatsApp)</li>
            <li>🎯 Seguimiento integral junto a tu rutina {routine.name}</li>
          </ul>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-brand-border bg-surface-alt p-5 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
            Diferencia Premium
          </p>
          <p className="text-4xl font-bold text-accent">
            +${premiumAddonPrice.toLocaleString("es-AR")}
          </p>
          <p className="text-sm text-gray-400">
            Total Premium: ${totalPremium.toLocaleString("es-AR")}
          </p>
          <div className="flex w-full flex-col gap-3">
            <button
              type="button"
              onClick={() => goToCheckout("premium")}
              className={`w-full rounded-full px-5 py-3 text-sm font-semibold uppercase tracking-wide text-black transition-all hover:-translate-y-0.5 ${upgradeButtonClasses}`}
            >
              {`Mejorar a Plan Premium (+$${premiumAddonLabel})`}
            </button>
            <button
              type="button"
              onClick={() => goToCheckout("essential")}
              className={`w-full rounded-full border px-5 py-3 text-sm font-semibold uppercase tracking-wide transition-all hover:-translate-y-0.5 ${continueButtonClasses}`}
            >
              Continuar con Plan Essential
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Podrás cambiar esta selección antes de pagar.
          </p>
        </div>
      </FadeIn>
    </section>
  );
}

export default PremiumUpgradeStep;
