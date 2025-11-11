import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dumbbell, Shield } from 'lucide-react';

function Header() {
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-neutral-200/60 text-neutral-900">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="rounded-xl bg-[#d7ff00] p-2 transition-transform group-hover:scale-105">
              <Dumbbell className="h-6 w-6 text-neutral-900" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900">
              Fit<span className="text-[#d7ff00]">ter</span>
            </h1>
          </Link>

          <nav className="flex items-center space-x-4">
            {location.pathname !== '/admin' && (
              <Link
                to="/admin"
                className="flex items-center space-x-2 rounded-full border border-neutral-200 bg-white/70 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-[#d7ff00] hover:text-neutral-900"
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
