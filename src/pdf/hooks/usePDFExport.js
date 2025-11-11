import { useCallback } from 'react';
import { generateTrainingPlanPDF } from '../PlanRenderer.jsx';

export const usePDFExport = () =>
  useCallback(async (planData) => {
    if (!planData) {
      console.warn('No plan data supplied to PDF export.');
      return null;
    }
    return generateTrainingPlanPDF(planData);
  }, []);

export default usePDFExport;
