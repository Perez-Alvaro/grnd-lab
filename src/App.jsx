import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider, useToast } from "./context/ToastContext.jsx";
import { setToastInstance } from "./utils/toast.js";
import { SnackbarProvider } from "./components/Tutorial/Snackbar.jsx";
import { AuthProvider } from "./store/authStore.jsx";
import { getRouteConfig } from "./lib/routeObfuscator.js";
import HomeSaaS from "./pages/HomeSaaS.jsx";
import RoutineEditor from "./pages/RoutineEditor.jsx";
import CoachDashboard from "./pages/CoachDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ProtectedRoute from "./components/Auth/ProtectedRoute.jsx";
import SubscriptionGate from "./components/Auth/SubscriptionGate.jsx";
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

          {/* Coach Dashboard — atletas y rutinas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <CoachDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Dashboard — solo role=admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Routine Editor — path derived at runtime.
              SubscriptionGate deshabilita el editor sin pago vigente. */}
          <Route
            path={EDITOR_PATH}
            element={
              <ProtectedRoute>
                <SubscriptionGate>
                  <RoutineEditor />
                </SubscriptionGate>
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
