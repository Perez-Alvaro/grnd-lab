import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ClientAuthProvider } from "./context/ClientAuthContext.jsx";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute.jsx";
import ClientProtectedRoute from "./components/Auth/ClientProtectedRoute.jsx";
import { DebugAuthPanel } from "./components/Auth/DebugAuthPanel.jsx";
import Header from "./components/Shared/Header.jsx";
import ClientHome from "./pages/ClientHome.jsx";
import TrainerDashboard from "./pages/TrainerDashboard.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import RoutineEditor from "./pages/RoutineEditor.jsx";
import RoutinePreview from "./pages/RoutinePreview.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import MFASetup from "./pages/MFASetup.jsx";
import MFAManagement from "./pages/MFAManagement.jsx";
import ClientRegister from "./pages/ClientRegister.jsx";
import ClientLogin from "./pages/ClientLogin.jsx";
import ClientForgotPassword from "./pages/ClientForgotPassword.jsx";
import ClientDashboard from "./pages/ClientDashboard.jsx";

function App() {
  return (
    <AuthProvider>
      <ClientAuthProvider>
        <AppProvider>
          <Router>
            <div className="min-h-screen bg-neutral-950 text-white font-sans">
              <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={
                  <>
                    <Header />
                    <main><ClientHome /></main>
                  </>
                } />
                <Route path="/rutinas/:id" element={
                  <>
                    <Header />
                    <main><RoutinePreview /></main>
                  </>
                } />
                <Route path="/success" element={
                  <>
                    <Header />
                    <main><PaymentSuccess /></main>
                  </>
                } />

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
                      <>
                        <Header />
                        <main><TrainerDashboard /></main>
                      </>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/plantillas/nueva"
                  element={
                    <ProtectedRoute>
                      <>
                        <Header />
                        <main><RoutineEditor /></main>
                      </>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/plantillas/:id/editar"
                  element={
                    <ProtectedRoute>
                      <>
                        <Header />
                        <main><RoutineEditor /></main>
                      </>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/mfa-setup"
                  element={
                    <ProtectedRoute>
                      <>
                        <Header />
                        <main><MFASetup /></main>
                      </>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/mfa-management"
                  element={
                    <ProtectedRoute>
                      <>
                        <Header />
                        <main><MFAManagement /></main>
                      </>
                    </ProtectedRoute>
                  }
                />
              </Routes>
              
              {/* Debug Panel - Solo en desarrollo */}
              <DebugAuthPanel />
            </div>
          </Router>
        </AppProvider>
      </ClientAuthProvider>
    </AuthProvider>
  );
}

export default App;
