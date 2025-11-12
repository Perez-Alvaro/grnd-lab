/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";

const PlanContext = createContext(null);

export const PlanProvider = ({ value, children }) => (
  <PlanContext.Provider value={value}>{children}</PlanContext.Provider>
);

export const usePlanContext = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error(
      "usePlanContext debe utilizarse dentro de un PlanProvider.",
    );
  }
  return context;
};

export default PlanContext;
