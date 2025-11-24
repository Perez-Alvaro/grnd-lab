import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-brand-border bg-[#050505]/90 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 text-white">
        <button
          type="button"
          onClick={() => navigate("/landing")}
          className="flex items-center space-x-3 rounded-full border border-transparent px-2 py-1 transition hover:border-[#0EF2A0]"
        >
          <div className="rounded-2xl bg-[#050505] p-2">
            <img src="/mz-logo-mark.PNG" alt="Logo MZ" className="h-10 w-auto" />
          </div>
          <div className="text-left">
            <p className="text-sm uppercase tracking-[0.4em] text-[#00C0A3]">
              MZ Training
            </p>
            <p className="text-xl font-semibold">
              Matias Ortiz
            </p>
          </div>
        </button>
      </div>
    </header>
  );
}

export default Header;
