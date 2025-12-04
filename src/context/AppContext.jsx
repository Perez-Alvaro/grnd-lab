/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useReducer } from "react";

const STORAGE_KEY = "routine_forge_routines";

const AppContext = createContext();

const initialState = {
  routines: [],
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
    case "SET_ROUTINES":
      return { ...state, routines: action.payload };
    case "ADD_ROUTINE": {
      const routinesAfterAdd = [...state.routines, action.payload];
      return { ...state, routines: routinesAfterAdd };
    }
    case "UPDATE_ROUTINE": {
      const updatedRoutines = state.routines.map((t) =>
        t.id === action.payload.id ? action.payload : t,
      );
      return { ...state, routines: updatedRoutines };
    }
    case "DELETE_ROUTINE": {
      const routinesAfterDelete = state.routines.filter(
        (t) => t.id !== action.payload,
      );
      return { ...state, routines: routinesAfterDelete };
    }
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load routines from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const routines = JSON.parse(stored);
        dispatch({ type: "SET_ROUTINES", payload: routines });
      }
    } catch (error) {
      console.error("Error loading routines from localStorage:", error);
      dispatch({ type: "SET_ERROR", payload: error });
    }
  }, []);

  // Save routines to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.routines));
    } catch (error) {
      console.error("Error saving routines to localStorage:", error);
    }
  }, [state.routines]);

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
