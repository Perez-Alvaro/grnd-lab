import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext.jsx";
import { ToastProvider, useToast } from "./context/ToastContext.jsx";
import { setToastInstance } from "./utils/toast.js";
import TrainerDashboard from "./pages/TrainerDashboard.jsx";
import RoutineEditor from "./pages/RoutineEditor.jsx";

function ToastInitializer() {
  const toast = useToast();

  React.useEffect(() => {
    setToastInstance(toast);
  }, [toast]);

  return null;
}

function AppContent() {
  return (
    <div className="min-h-screen bg-primary-bg text-text-primary font-sans">
      <ToastInitializer />
      <main>
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/admin" replace />} />

          {/* Admin Dashboard - list of routines */}
          <Route path="/admin" element={<TrainerDashboard />} />

          {/* Routine Editor - new routine */}
          <Route path="/admin/plantillas/nueva" element={<RoutineEditor />} />

          {/* Routine Editor - edit existing */}
          <Route path="/admin/plantillas/:id/editar" element={<RoutineEditor />} />

          {/* Catch all - redirect to admin */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <Router>
          <AppContent />
        </Router>
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
