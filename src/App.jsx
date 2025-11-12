import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext.jsx";
import Header from "./components/Shared/Header.jsx";
import ClientHome from "./pages/ClientHome.jsx";
import TrainerDashboard from "./pages/TrainerDashboard.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import RoutineEditor from "./pages/RoutineEditor.jsx";
import RoutinePreview from "./pages/RoutinePreview.jsx";

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-neutral-950 text-white font-sans">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<ClientHome />} />
              <Route path="/admin" element={<TrainerDashboard />} />
              <Route
                path="/admin/plantillas/nueva"
                element={<RoutineEditor />}
              />
              <Route
                path="/admin/plantillas/:id/editar"
                element={<RoutineEditor />}
              />
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
