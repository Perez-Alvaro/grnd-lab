/* eslint-disable react-refresh/only-export-components */
import { Document, Page, pdf } from "@react-pdf/renderer";
import NutritionCoverPage from "./sections/NutritionCoverPage.jsx";
import { NutritionDayPage, NutritionEmptyWeekPage } from "./sections/NutritionWeekSection.jsx";
import ShoppingListPage, { hasAppendix } from "./sections/ShoppingListPage.jsx";
import LegalPage from "./sections/LegalPage.jsx";
import { createNutritionStyles } from "./utils/nutritionPdfStyles.js";

/**
 * Normaliza el plan interno del editor ({ metadata:{planMeta,...}, weeks[].days[].meals[] })
 * al shape que consumen las secciones del PDF.
 */
export const normalizeNutritionPlan = (planData) => {
  const meta = planData?.metadata || planData || {};
  const pm = meta.planMeta || {};
  const brandName =
    meta.brandName ||
    meta.author ||
    meta.coach ||
    (typeof window !== "undefined" && window?.localStorage?.getItem?.("mock:coach-brand-name")) ||
    "Mock";
  const weeksSource = Array.isArray(planData?.weeks) ? planData.weeks : [];

  const weeks = weeksSource.map((w, i) => ({
    number: i + 1,
    title: w?.title || `Semana ${i + 1}`,
    summary: w?.summary || "",
    brandName,
    notes: Array.isArray(w?.notes) ? w.notes.filter(Boolean).join("\n") : w?.notes || "",
    days: (w?.days || []).map((d, di) => ({
      name: d?.name || `Día ${di + 1}`,
      esDiaEntreno: !!d?.esDiaEntreno,
      totalDia: d?.totalDia || {},
      meals: (d?.meals || []).map((m) => ({ ...m, variantes: m?.variantes || [] })),
    })),
  }));

  return {
    title: meta.name || "Plan nutricional",
    author: meta.author || brandName || "",
    brandName,
    planMeta: pm,
    mealPrepGuide: meta.mealPrepGuide || [],
    shoppingList: meta.shoppingList || {},
    quickReference: meta.quickReference || [],
    notasSemana: meta.notas_semana || [],
    weeks: weeks.length ? weeks : [{ number: 1, title: "Semana 1", summary: "", brandName, notes: "", days: [] }],
  };
};

const NutritionPlanDocument = ({ plan }) => {
  const styles = createNutritionStyles();
  return (
    <Document>
      <Page size="A4" orientation="portrait" style={styles.page} wrap>
        <NutritionCoverPage plan={plan} styles={styles} />
      </Page>
      {/* Una página por día, con encabezado corrido "Día · Semana" en cada
          página para que el lector nunca pierda el contexto. */}
      {plan.weeks.flatMap((week) =>
        week.days.length
          ? week.days.map((day, di) => (
              <NutritionDayPage
                key={`w${week.number}-d${di}`}
                week={week}
                day={day}
                brandName={plan.brandName}
                isFirstDayOfWeek={di === 0}
                styles={styles}
              />
            ))
          : [<NutritionEmptyWeekPage key={`w${week.number}`} week={week} styles={styles} />],
      )}
      {hasAppendix(plan) ? (
        <Page size="A4" orientation="portrait" style={styles.page} wrap>
          <ShoppingListPage plan={plan} styles={styles} />
        </Page>
      ) : null}

      {/* Términos y condiciones: SIEMPRE la última página del documento. */}
      <Page size="A4" orientation="portrait" style={styles.page} wrap>
        <LegalPage variant="nutrition" author={plan.author} />
      </Page>
    </Document>
  );
};

export const generateNutritionPlanPDF = async (planData) => {
  const plan = normalizeNutritionPlan(planData);
  const blob = await pdf(<NutritionPlanDocument plan={plan} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const safeTitle = plan.title || "plan-nutricional";
  link.download = `${safeTitle.replace(/\s+/g, "_").toLowerCase()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return blob;
};

export default NutritionPlanDocument;
