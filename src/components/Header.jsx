import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dumbbell, Shield } from 'lucide-react';

function Header() {
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur">
      <div className="container mx-auto px-4 py-4 text-white">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="rounded-xl bg-[#B5FF00] p-2 transition-transform group-hover:scale-105">
              <Dumbbell className="h-6 w-6 text-black" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              Fit<span className="text-[#B5FF00]">ter</span>
            </h1>
          </Link>

          <nav className="flex items-center space-x-4">
            {location.pathname !== '/admin' && (
              <Link
                to="/admin"
                className="flex items-center space-x-2 rounded-full border border-[#B5FF00] px-4 py-2 text-sm font-medium text-[#B5FF00] transition-colors hover:bg-[#B5FF00]/10"
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
