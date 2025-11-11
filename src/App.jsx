import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import Header from './components/Header.jsx';
import Home from './pages/Home.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import PaymentSuccess from './pages/PaymentSuccess.jsx';
import TemplatesEditorPage from './pages/TemplatesEditorPage.jsx';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-neutral-950 text-white font-sans">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/plantillas/nueva" element={<TemplatesEditorPage />} />
              <Route path="/admin/plantillas/:id/editar" element={<TemplatesEditorPage />} />
              <Route path="/success" element={<PaymentSuccess />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;