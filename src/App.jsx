import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider, useToast } from "./context/ToastContext.jsx";
import { setToastInstance } from "./utils/toast.js";
import { SnackbarProvider } from "./components/Tutorial/Snackbar.jsx";
import Home from "./pages/Home.jsx";
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
          {/* Home/Landing */}
          <Route path="/" element={<Home />} />

          {/* Routine Editor */}
          <Route path="/editor" element={<RoutineEditor />} />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <SnackbarProvider>
      <ToastProvider>
        <Router>
          <AppContent />
        </Router>
      </ToastProvider>
    </SnackbarProvider>
  );
}

export default App;
