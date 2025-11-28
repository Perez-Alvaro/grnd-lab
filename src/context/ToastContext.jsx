import React, { createContext, useContext, useState, useCallback } from "react";
import { ToastContainer } from "../components/Shared/Toast.jsx";

const ToastContext = createContext(null);

let toastIdCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, type, message }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = {
    success: (message) => addToast("success", message),
    error: (message) => addToast("error", message),
    warning: (message) => addToast("warning", message),
    info: (message) => addToast("info", message),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast debe usarse dentro de ToastProvider");
  }
  return context;
}

export default ToastContext;
