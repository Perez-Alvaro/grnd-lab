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
    ? "bg-accent shadow-[0_10px_45px_-30px_rgba(14,242,160,0.8)]"
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
    <section className="mt-8 flex flex-col gap-4 rounded-2xl border border-brand-border bg-surface p-5 text-white shadow-[0_25px_80px_-50px_rgba(0,0,0,0.75)] text-natural-wrap sm:mt-10 sm:gap-5 sm:rounded-3xl sm:p-6 md:mt-12 md:gap-6 md:p-8 lg:p-10">
      <header className="space-y-2 text-center text-natural-wrap md:space-y-3 md:text-left">
        <p className="text-[10px] uppercase tracking-[0.3em] text-accent sm:text-xs sm:tracking-[0.4em]">
          Paso 03.5
        </p>
        <h3 className="mt-2 text-xl font-semibold sm:text-2xl md:text-3xl">
          Plan Premium MZ – Nutrición y Comunidad
        </h3>
        <p className="mt-2 text-xs text-gray-400 sm:text-sm">
          Sumá el Ebook oficial de Nutrición MZ 📘 y acceso exclusivo a la
          Comunidad MZ junto a Matías Ortiz.
        </p>
      </header>

      <FadeIn className="grid gap-4 rounded-xl border border-brand-border bg-base p-5 text-natural-wrap sm:gap-5 sm:rounded-2xl sm:p-6 md:grid-cols-[1.2fr_0.8fr] md:gap-6 md:p-8 lg:gap-8">
        <div className="space-y-3 text-center text-natural-wrap sm:space-y-4 md:text-left">
          <p className="mock-text text-xs sm:text-sm">
            Entrená con un plan integral que combina tu rutina personalizada con
            educación nutricional y acompañamiento real.
          </p>
          <ul className="mock-text space-y-2 text-xs sm:text-sm">
            <li>📘 Ebook oficial de Nutrición MZ en PDF</li>
            <li>💬 Acceso a la comunidad privada MZ (email + WhatsApp)</li>
            <li>🎯 Seguimiento integral junto a tu rutina {routine.name}</li>
          </ul>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-brand-border bg-surface-alt p-4 text-center text-natural-wrap sm:gap-3 sm:rounded-2xl sm:p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 sm:text-xs sm:tracking-[0.3em]">
            Diferencia Premium
          </p>
          <p className="text-3xl font-bold text-accent sm:text-4xl">
            +${premiumAddonPrice.toLocaleString("es-AR")}
          </p>
          <p className="mock-text text-xs sm:text-sm">
            Total Premium: ${totalPremium.toLocaleString("es-AR")}
          </p>
          <div className="flex w-full flex-col gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => goToCheckout("premium")}
              className={`w-full rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-black transition-all hover:-translate-y-0.5 sm:px-5 sm:py-3 sm:text-sm ${upgradeButtonClasses}`}
            >
              {`Mejorar a Plan Premium (+$${premiumAddonLabel})`}
            </button>
            <button
              type="button"
              onClick={() => goToCheckout("essential")}
              className={`w-full rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-wide transition-all hover:-translate-y-0.5 sm:px-5 sm:py-3 sm:text-sm ${continueButtonClasses}`}
            >
              Continuar con Plan Essential
            </button>
          </div>
          <p className="text-[10px] text-gray-500 sm:text-xs">
            Podrás cambiar esta selección antes de pagar.
          </p>
        </div>
      </FadeIn>
    </section>
  );
}

export default PremiumUpgradeStep;
