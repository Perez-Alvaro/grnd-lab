import { useCallback } from "react";

export const usePDFExport = () =>
  useCallback(async (planData, type = 'desktop') => {
    if (!planData) {
      console.warn("No plan data supplied to PDF export.");
      return null;
    }
    
    // Si es tipo mobile, usar el generador mobile
    if (type === 'mobile') {
      const { downloadRoutinePDFMobile } = await import("../services/pdfGeneratorMobile.js");
      return downloadRoutinePDFMobile(planData);
    }
    
    // Por defecto, usar el generador desktop
    const { generateTrainingPlanPDF } = await import("../pdf/PlanRenderer.js");
    return generateTrainingPlanPDF(planData);
  }, []);

export default usePDFExport;
