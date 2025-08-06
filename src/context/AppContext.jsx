import React, { createContext, useContext, useReducer } from 'react';
import templates from '../data/templates.json';
import users from '../data/users.json';
import sales from '../data/sales.json';

const AppContext = createContext();

const initialState = {
  templates,
  users,
  sales,
  selectedPlan: null,
  loading: false,
  error: null
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SELECTED_PLAN':
      return { ...state, selectedPlan: action.payload };
    case 'ADD_TEMPLATE':
      return { ...state, templates: [...state.templates, action.payload] };
    case 'UPDATE_TEMPLATE':
      return {
        ...state,
        templates: state.templates.map(t =>
          t.id === action.payload.id ? action.payload : t
        )
      };
    case 'DELETE_TEMPLATE':
      return {
        ...state,
        templates: state.templates.filter(t => t.id !== action.payload)
      };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'ADD_SALE':
      return { ...state, sales: [...state.sales, action.payload] };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}