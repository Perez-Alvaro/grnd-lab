import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext.jsx";
import Header from "./components/Shared/Header.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import PurchaseFlow from "./pages/PurchaseFlow.jsx";
import TrainerDashboard from "./pages/TrainerDashboard.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import RoutineEditor from "./pages/RoutineEditor.jsx";
import RoutinePreview from "./pages/RoutinePreview.jsx";

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-base text-white font-sans">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Navigate to="/landing" replace />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/purchase-flow" element={<PurchaseFlow />} />
              <Route path="/admin" element={<TrainerDashboard />} />
              <Route path="/admin/plantillas/nueva" element={<RoutineEditor />} />
              <Route path="/admin/plantillas/:id/editar" element={<RoutineEditor />} />
              <Route path="/rutinas/:id" element={<RoutinePreview />} />
              <Route path="/success" element={<PaymentSuccess />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
