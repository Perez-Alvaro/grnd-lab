import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dumbbell, Shield } from 'lucide-react';

function Header() {
  const location = useLocation();
  
  return (
    <header className="bg-[#2D2D2D] border-b border-[#787878]/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-[#CBFF00] p-2 rounded-lg group-hover:scale-105 transition-transform">
              <Dumbbell className="h-6 w-6 text-[#2D2D2D]" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              Fit<span className="text-[#CBFF00]">Plan</span>Selector
            </h1>
          </Link>
          
          <nav className="flex items-center space-x-4">
            {location.pathname !== '/admin' && (
              <Link
                to="/admin"
                className="flex items-center space-x-2 px-4 py-2 bg-[#787878]/20 hover:bg-[#787878]/30 rounded-lg transition-colors"
              >
                <Shield className="h-4 w-4" />
                <span>Administrador</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;