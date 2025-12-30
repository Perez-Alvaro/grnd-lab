import { useCallback } from "react";
import { generateTrainingPlanPDF } from "../pdf/PlanRenderer.js";
import { downloadRoutinePDFMobile } from "../services/pdfGeneratorMobile.js";

export const usePDFExport = () =>
  useCallback(async (planData, type = 'desktop') => {
    if (!planData) {
      console.warn("No plan data supplied to PDF export.");
      return null;
    }
    
    // Si es tipo mobile, usar el generador mobile
    if (type === 'mobile') {
      return downloadRoutinePDFMobile(planData);
    }
    
    // Por defecto, usar el generador desktop
    return generateTrainingPlanPDF(planData);
  }, []);

export default usePDFExport;
