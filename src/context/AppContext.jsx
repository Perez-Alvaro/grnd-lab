/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useReducer } from "react";
import API from "../api/endpoints.js";

const AppContext = createContext();

const initialState = {
  routines: [],
  users: [],
  sales: [],
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
      };
    case "ADD_ROUTINE":
      return { ...state, routines: [...state.routines, action.payload] };
    case "UPDATE_ROUTINE":
      return {
        ...state,
        routines: state.routines.map((t) =>
          t.id === action.payload.id ? action.payload : t,
        ),
      };
    case "DELETE_ROUTINE":
      return {
        ...state,
        routines: state.routines.filter((t) => t.id !== action.payload),
      };
    case "ADD_USER":
      return { ...state, users: [...state.users, action.payload] };
    case "ADD_SALE":
      return { ...state, sales: [...state.sales, action.payload] };
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
        const [routines, sales, users] = await Promise.all([
          API.getRoutines(),
          API.getSales(),
          API.getUsers(),
        ]);

        if (!mounted) return;

        dispatch({
          type: "SET_DATA",
          payload: { routines, sales, users },
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
