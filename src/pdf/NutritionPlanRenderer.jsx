/* eslint-disable react-refresh/only-export-components */
import { Document, Page, pdf } from "@react-pdf/renderer";
import NutritionCoverPage from "./sections/NutritionCoverPage.jsx";
import NutritionWeekSection from "./sections/NutritionWeekSection.jsx";
import ShoppingListPage, { hasAppendix } from "./sections/ShoppingListPage.jsx";
import { createNutritionStyles } from "./utils/nutritionPdfStyles.js";

/**
 * Normaliza el plan interno del editor ({ metadata:{planMeta,...}, weeks[].days[].meals[] })
 * al shape que consumen las secciones del PDF.
 */
export const normalizeNutritionPlan = (planData) => {
  const meta = planData?.metadata || planData || {};
  const pm = meta.planMeta || {};
  const weeksSource = Array.isArray(planData?.weeks) ? planData.weeks : [];

  const weeks = weeksSource.map((w, i) => ({
    number: i + 1,
    title: w?.title || `Semana ${i + 1}`,
    summary: w?.summary || "",
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
    author: meta.author || "",
    planMeta: pm,
    mealPrepGuide: meta.mealPrepGuide || [],
    shoppingList: meta.shoppingList || {},
    quickReference: meta.quickReference || [],
    notasSemana: meta.notas_semana || [],
    weeks: weeks.length ? weeks : [{ number: 1, title: "Semana 1", summary: "", notes: "", days: [] }],
  };
};

const NutritionPlanDocument = ({ plan }) => {
  const styles = createNutritionStyles();
  return (
    <Document>
      <Page size="A4" orientation="portrait" style={styles.page} wrap>
        <NutritionCoverPage plan={plan} styles={styles} />
      </Page>
      <Page size="A4" orientation="portrait" style={styles.page} wrap>
        {plan.weeks.map((week, index) => (
          <NutritionWeekSection
            key={week.number}
            week={week}
            styles={styles}
            breakBefore={index > 0}
          />
        ))}
      </Page>
      {hasAppendix(plan) ? (
        <Page size="A4" orientation="portrait" style={styles.page} wrap>
          <ShoppingListPage plan={plan} styles={styles} />
        </Page>
      ) : null}
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
