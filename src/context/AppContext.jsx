/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useReducer } from "react";
import API from "@/api/endpoints.js";

const calculateVariation = (current, previous) => {
  if (previous === 0) {
    return current > 0 ? 100 : null;
  }
  return ((current - previous) / previous) * 100;
};

const recalculateMetrics = (sales, routines, users) => {
  if (!sales.length && !routines.length && !users.length) {
    return {
      totalUsuarios: 0,
      totalIngresos: 0,
      ingresosMensuales: 0,
      rutinasActivas: 0,
      descargasMes: 0,
      ticketPromedio: 0,
      variacionIngresos: null,
      variacionDescargas: null,
      meses: {
        actual: null,
        anterior: null,
      },
      seriesMensuales: [],
    };
  }

  const salesByMonth = new Map();
  sales.forEach((sale) => {
    const key = sale.date.slice(0, 7);
    if (!salesByMonth.has(key)) {
      salesByMonth.set(key, { revenue: 0, downloads: 0 });
    }
    const entry = salesByMonth.get(key);
    entry.revenue += sale.amount;
    entry.downloads += 1;
  });

  const monthKeys = Array.from(salesByMonth.keys()).sort();
  const latest = monthKeys.length ? monthKeys[monthKeys.length - 1] : null;
  const previous = monthKeys.length > 1 ? monthKeys[monthKeys.length - 2] : null;

  const totalIngresos = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const ingresosMensuales = latest
    ? salesByMonth.get(latest)?.revenue ?? 0
    : 0;
  const descargasMes = latest
    ? salesByMonth.get(latest)?.downloads ?? 0
    : 0;

  const ingresosPrevios = previous
    ? salesByMonth.get(previous)?.revenue ?? 0
    : 0;
  const descargasPrevias = previous
    ? salesByMonth.get(previous)?.downloads ?? 0
    : 0;

  const ticketPromedio = sales.length ? totalIngresos / sales.length : 0;

  return {
    totalUsuarios: users.length,
    totalIngresos,
    ingresosMensuales,
    rutinasActivas: routines.length,
    descargasMes,
    ticketPromedio,
    variacionIngresos: calculateVariation(ingresosMensuales, ingresosPrevios),
    variacionDescargas: calculateVariation(descargasMes, descargasPrevias),
    meses: {
      actual: latest,
      anterior: previous,
    },
    seriesMensuales: monthKeys.map((key) => ({
      key,
      revenue: salesByMonth.get(key)?.revenue ?? 0,
      downloads: salesByMonth.get(key)?.downloads ?? 0,
    })),
  };
};

const AppContext = createContext();

const initialState = {
  routines: [],
  users: [],
  sales: [],
  metrics: null,
  selectedRoutine: null,
  loading: false,
  error: null,
};

function appReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_SELECTED_ROUTINE":
      return { ...state, selectedRoutine: action.payload };
    case "SET_DATA":
      return {
        ...state,
        routines: action.payload.routines,
        users: action.payload.users,
        sales: action.payload.sales,
        metrics: action.payload.metrics,
      };
    case "ADD_ROUTINE": {
      const routinesAfterAdd = [...state.routines, action.payload];
      return {
        ...state,
        routines: routinesAfterAdd,
        metrics: recalculateMetrics(state.sales, routinesAfterAdd, state.users),
      };
    }
    case "UPDATE_ROUTINE": {
      const updatedRoutines = state.routines.map((t) =>
        t.id === action.payload.id ? action.payload : t,
      );
      return {
        ...state,
        routines: updatedRoutines,
        metrics: recalculateMetrics(state.sales, updatedRoutines, state.users),
      };
    }
    case "DELETE_ROUTINE": {
      const routinesAfterDelete = state.routines.filter(
        (t) => t.id !== action.payload,
      );
      return {
        ...state,
        routines: routinesAfterDelete,
        metrics: recalculateMetrics(state.sales, routinesAfterDelete, state.users),
      };
    }
    case "ADD_USER": {
      const usersAfterAdd = [...state.users, action.payload];
      return {
        ...state,
        users: usersAfterAdd,
        metrics: recalculateMetrics(state.sales, state.routines, usersAfterAdd),
      };
    }
    case "ADD_SALE": {
      const salesAfterAdd = [...state.sales, action.payload];
      return {
        ...state,
        sales: salesAfterAdd,
        metrics: recalculateMetrics(salesAfterAdd, state.routines, state.users),
      };
    }
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const [routines, sales, users, metrics] = await Promise.all([
          API.getRoutines(),
          API.getSales(),
          API.getUsers(),
          API.getMetrics(),
        ]);

        if (!mounted) return;

        dispatch({
          type: "SET_DATA",
          payload: {
            routines,
            sales,
            users,
            metrics,
          },
        });
        dispatch({ type: "SET_ERROR", payload: null });
      } catch (error) {
        if (mounted) {
          dispatch({ type: "SET_ERROR", payload: error });
        }
      } finally {
        if (mounted) {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
