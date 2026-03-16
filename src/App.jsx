import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider, useToast } from "./context/ToastContext.jsx";
import { setToastInstance } from "./utils/toast.js";
import { SnackbarProvider } from "./components/Tutorial/Snackbar.jsx";
import { AuthProvider } from "./store/authStore.jsx";
import { getRouteConfig } from "./lib/routeObfuscator.js";
import Home from "./pages/Home.jsx";
import HomeSaaS from "./pages/HomeSaaS.jsx";
import RoutineEditor from "./pages/RoutineEditor.jsx";
import ProtectedRoute from "./components/Auth/ProtectedRoute.jsx";
import LoginModal from "./components/Auth/LoginModal.jsx";

// Derive the protected path at runtime — never a plain string in source
const { path: EDITOR_PATH } = getRouteConfig();

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

      {/* Global login modal — always mounted, controlled via authStore */}
      <LoginModal />

      <main>
        <Routes>
          {/* SaaS Landing - B2B for Trainers (Main Page) */}
          <Route path="/" element={<HomeSaaS />} />

          {/* Home/Landing - Technical */}
          <Route path="/technical" element={<Home />} />

          {/* Protected Routine Editor — path derived at runtime */}
          <Route
            path={EDITOR_PATH}
            element={
              <ProtectedRoute>
                <RoutineEditor />
              </ProtectedRoute>
            }
          />

          {/* Catch all — redirect to SaaS home */}
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
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </Router>
      </ToastProvider>
    </SnackbarProvider>
  );
}

export default App;
