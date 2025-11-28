import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppProvider } from "./context/AppContext.jsx";
import { UnifiedAuthProvider } from "./context/UnifiedAuthContext.jsx";
import { ToastProvider, useToast } from "./context/ToastContext.jsx";
import { setToastInstance } from "./utils/toast.js";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute.jsx";
import ClientProtectedRoute from "./components/Auth/ClientProtectedRoute.jsx";
import { DebugAuthPanel } from "./components/Auth/DebugAuthPanel.jsx";
import Header from "./components/Shared/Header.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import PurchaseFlow from "./pages/PurchaseFlow.jsx";
import TrainerDashboard from "./pages/TrainerDashboard.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import PaymentFailure from "./pages/PaymentFailure.jsx";
import PaymentPending from "./pages/PaymentPending.jsx";
import RoutineEditor from "./pages/RoutineEditor.jsx";
import RoutinePreview from "./pages/RoutinePreview.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import MFASetup from "./pages/MFASetup.jsx";
import MFAManagement from "./pages/MFAManagement.jsx";
import ClientRegister from "./pages/ClientRegister.jsx";
import ClientLogin from "./pages/ClientLogin.jsx";
import ClientForgotPassword from "./pages/ClientForgotPassword.jsx";
import ClientDashboard from "./pages/ClientDashboard.jsx";
import ClientHome from "./pages/ClientHome.jsx";

function ToastInitializer() {
  const toast = useToast();

  useEffect(() => {
    setToastInstance(toast);
  }, [toast]);

  return null;
}

function AppContent() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-base text-white font-sans">
      <ToastInitializer />
      {/* Ocultar Header en landing page y admin dashboard (usan shared Navbar) */}
      {location.pathname !== '/landing' && location.pathname !== '/admin' && <Header />}
      <main>
        <Routes>
          {/* Ruta principal redirige a landing */}
          <Route path="/" element={<Navigate to="/landing" replace />} />
          
          {/* Rutas públicas */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/purchase-flow" element={<PurchaseFlow />} />
          <Route path="/rutinas/:id" element={<RoutinePreview />} />

          {/* Rutas de resultado de pago Mercado Pago */}
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failure" element={<PaymentFailure />} />
          <Route path="/payment/pending" element={<PaymentPending />} />
          
          {/* Ruta legacy de success (redirect a la nueva) */}
          <Route path="/success" element={<PaymentSuccess />} />

          {/* Rutas de autenticación de clientes */}
          <Route path="/register" element={<ClientRegister />} />
          <Route path="/login" element={<ClientLogin />} />
          <Route path="/forgot-password" element={<ClientForgotPassword />} />

          {/* Rutas protegidas de cliente */}
          <Route
            path="/client/dashboard"
            element={
              <ClientProtectedRoute>
                <ClientDashboard />
              </ClientProtectedRoute>
            }
          />

          {/* Ruta de login de admin (oculta) */}
          <Route path="/mz-admin-access" element={<AdminLogin />} />

          {/* Rutas protegidas de administrador */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <TrainerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/plantillas/nueva"
            element={
              <ProtectedRoute>
                <RoutineEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/plantillas/:id/editar"
            element={
              <ProtectedRoute>
                <RoutineEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/mfa-setup"
            element={
              <ProtectedRoute>
                <MFASetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/mfa-management"
            element={
              <ProtectedRoute>
                <MFAManagement />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      
      {/* Debug Panel - Solo en desarrollo */}
      <DebugAuthPanel />
    </div>
  );
}

function App() {
  return (
    <UnifiedAuthProvider>
      <AppProvider>
        <ToastProvider>
          <Router>
            <AppContent />
          </Router>
        </ToastProvider>
      </AppProvider>
    </UnifiedAuthProvider>
  );
}

export default App;
