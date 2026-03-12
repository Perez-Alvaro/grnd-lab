import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider, useToast } from "./context/ToastContext.jsx";
import { setToastInstance } from "./utils/toast.js";
import { SnackbarProvider } from "./components/Tutorial/Snackbar.jsx";
import Home from "./pages/Home.jsx";
import HomeSaaS from "./pages/HomeSaaS.jsx";
import RoutineEditor from "./pages/RoutineEditor.jsx";
import EditorLogin from "./components/Auth/EditorLogin.jsx";

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
          {/* SaaS Landing - B2B for Trainers (Main Page) */}
          <Route path="/" element={<HomeSaaS />} />

          {/* Home/Landing - Technical */}
          <Route path="/technical" element={<Home />} />

          {/* Routine Editor */}
          <Route path="/editor" element={<EditorLogin><RoutineEditor /></EditorLogin>} />

          {/* Catch all - redirect to SaaS home */}
          <Route path="*" element={<HomeSaaS />} />
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
