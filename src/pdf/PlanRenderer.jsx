/* eslint-disable react-refresh/only-export-components */
import { Document, Page, pdf } from "@react-pdf/renderer";
import CoverPage from "./sections/CoverPage.js";
import WeekSection from "./sections/WeekSection.js";
import ProgressPage from "./sections/ProgressPage.js";
import { createBaseStyles } from "./utils/pdfStyles.js";
import { normalizePlanData } from "./utils/pdfLayout.js";

const PlanDocument = ({ plan }) => {
  const styles = createBaseStyles();

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <CoverPage plan={plan} styles={styles} />
      </Page>
      <Page size="A4" style={styles.page} wrap>
        {plan.weeks.map((week, index) => (
          <WeekSection
            key={week.number}
            week={week}
            styles={styles}
            breakBefore={index > 0}
          />
        ))}
      </Page>
      {plan.progress ? (
        <Page size="A4" style={styles.page} wrap>
          <ProgressPage progress={plan.progress} styles={styles} />
        </Page>
      ) : null}
    </Document>
  );
};

export const generateTrainingPlanPDF = async (planData) => {
  const normalizedPlan = normalizePlanData(planData);
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
