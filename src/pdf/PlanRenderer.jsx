/* eslint-disable react-refresh/only-export-components */
import { Document, Page, pdf } from "@react-pdf/renderer";
import CoverPage from "./sections/CoverPage.js";
import { WorkoutDayContent, EmptyWeekContent } from "./sections/WeekSection.js";
import ProgressPage from "./sections/ProgressPage.js";
import { createBaseStyles } from "./utils/pdfStyles.js";
import { normalizePlanData } from "./utils/pdfLayout.js";
import {
  PAGE_WIDTH,
  estimateWorkoutPageHeight,
  estimateEmptyWeekPageHeight,
} from "./utils/pageSizing.js";

// Aplana semanas → días en una lista de páginas. Cada día = una <Page> propia;
// el encabezado de semana solo se muestra en el primer día de cada semana.
const buildDayPages = (weeks) => {
  const pages = [];
  for (const week of weeks) {
    if (!week.days?.length) {
      pages.push({ week, day: null, dayNumber: 0, showWeekHeader: true });
      continue;
    }
    week.days.forEach((day, di) => {
      pages.push({
        week,
        day,
        dayNumber: day.dayNumber ?? di + 1,
        showWeekHeader: di === 0,
      });
    });
  }
  return pages;
};

const PlanDocument = ({ plan }) => {
  const styles = createBaseStyles();
  const dayPages = buildDayPages(plan.weeks);

  return (
    <Document>
      {/* Portada + índice: página fija A4 (su contenido no desborda). */}
      <Page size="A4" orientation="portrait" style={styles.page} wrap>
        <CoverPage plan={plan} styles={styles} />
      </Page>

      {/* Una página por día, con alto dinámico para que nada se corte. */}
      {dayPages.map(({ week, day, dayNumber, showWeekHeader }, idx) => (
        <Page
          key={idx}
          size={{
            width: PAGE_WIDTH,
            height: day
              ? estimateWorkoutPageHeight(day, { showWeekHeader })
              : estimateEmptyWeekPageHeight(),
          }}
          style={styles.page}
          wrap={false}
        >
          {day ? (
            <WorkoutDayContent
              week={week}
              day={day}
              dayNumber={dayNumber}
              showWeekHeader={showWeekHeader}
              styles={styles}
            />
          ) : (
            <EmptyWeekContent week={week} styles={styles} />
          )}
        </Page>
      ))}

      {/* Progreso: página fija A4. */}
      {plan.progress ? (
        <Page size="A4" orientation="portrait" style={styles.page} wrap>
          <ProgressPage progress={plan.progress} styles={styles} />
        </Page>
      ) : null}
    </Document>
  );
};

export const generateTrainingPlanPDF = async (planData) => {
  const normalizedPlan = await normalizePlanData(planData);
  const blob = await pdf(<PlanDocument plan={normalizedPlan} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const safeTitle = normalizedPlan.title || "plan-entrenamiento";
  link.download = `${safeTitle.replace(/\s+/g, "_").toLowerCase()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return blob;
};

export default PlanDocument;
