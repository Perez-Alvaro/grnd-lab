import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider, useToast } from "./context/ToastContext.jsx";
import { setToastInstance } from "./utils/toast.js";
import { SnackbarProvider } from "./components/Tutorial/Snackbar.jsx";
import { AuthProvider } from "./store/authStore.jsx";
import { getRouteConfig } from "./lib/routeObfuscator.js";
import HomeSaaS from "./pages/HomeSaaS.jsx";
import ProtectedRoute from "./components/Auth/ProtectedRoute.jsx";
import SubscriptionGate from "./components/Auth/SubscriptionGate.jsx";
import LoginModal from "./components/Auth/LoginModal.jsx";
import TermsGate from "./components/Legal/TermsGate.jsx";

const RoutineEditor = React.lazy(() => import("./pages/RoutineEditor.jsx"));
const CoachDashboard = React.lazy(() => import("./pages/CoachDashboard.jsx"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard.jsx"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy.jsx"));

function LoadingSpinner() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-8" role="status" aria-label="Cargando">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
    </div>
  );
}

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
  React.useEffect(() => {
    try {
      localStorage.setItem('theme', 'light');
    } catch (err) {
      void err;
      // Ignorar fallas de localStorage
    }
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);
  return (
    <div className="min-h-screen bg-primary-bg text-text-primary font-sans">
      <ToastInitializer />

      {/* Global login modal — always mounted, controlled via authStore */}
      <LoginModal />

      {/* Bloquea la app hasta que el usuario logueado acepte los T&C vigentes. */}
      <TermsGate />

      <main>
        <Suspense fallback={<LoadingSpinner />}>
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

            {/* Política de Privacidad — Ley 25.326 */}
            <Route path="/politica-de-privacidad" element={<PrivacyPolicy />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />

            {/* Catch all — redirect to SaaS home */}
            <Route path="*" element={<HomeSaaS />} />
          </Routes>
        </Suspense>
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
