import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Dumbbell, Settings, Shield, LogOut, User, ChevronDown, Home } from "lucide-react";
import { useAdminAuth, useClientAuth } from "@/context/UnifiedAuthContext";
// import { MFAModal } from "@/components/Trainer/SecuritySection"; // TODO: Crear componente MFAModal

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  // Admin auth context
  const { user: adminUser, signOut: adminSignOut, getMFAFactors } = useAdminAuth();

  // Client auth context
  const { user: clientUser, profile: clientProfile, signOut: clientSignOut } = useClientAuth();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showMFAModal, setShowMFAModal] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const checkMFA = async () => {
      if (adminUser) {
        const { data } = await getMFAFactors();
        setMfaEnabled(data?.totp && data.totp.length > 0);
      }
    };
    checkMFA();
  }, [adminUser, getMFAFactors]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const checkMFAStatus = async () => {
    if (adminUser) {
      const { data } = await getMFAFactors();
      setMfaEnabled(data?.totp && data.totp.length > 0);
    }
  };

  const handleAdminLogout = async () => {
    setShowDropdown(false);
    try {
      const { error } = await adminSignOut();
      if (error) {
        console.error('Error al cerrar sesión:', error);
        // Intentar limpiar manualmente si hay error
        localStorage.clear();
        sessionStorage.clear();
      }
      // Redirigir al login de admin
      navigate('/mz-admin-access', { replace: true });
    } catch (error) {
      console.error('Error inesperado al cerrar sesión:', error);
      // Limpiar storage en caso de error
      localStorage.clear();
      sessionStorage.clear();
      navigate('/mz-admin-access', { replace: true });
    }
  };

  const handleClientLogout = async () => {
    setShowDropdown(false);
    try {
      const { error } = await clientSignOut();
      if (error) {
        console.error('Error al cerrar sesión:', error);
      }
      // Limpiar storage local
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      // Redirigir al home
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error inesperado al cerrar sesión:', error);
      navigate('/', { replace: true });
    }
  };

  const handleSettings = () => {
    setShowDropdown(false);
    setShowMFAModal(true);
  };

  const handleMFAModalClose = () => {
    setShowMFAModal(false);
    checkMFAStatus();
  };

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
            {/* Public Navigation - Login/Register buttons */}
            {!adminUser && !clientUser && !location.pathname.startsWith("/admin") && !location.pathname.startsWith("/mz-admin-access") && !location.pathname.startsWith("/client") && !location.pathname.startsWith("/login") && !location.pathname.startsWith("/register") && (
              <>
                <Link
                  to="/login"
                  className="rounded-lg border border-neutral-700 bg-transparent px-4 py-2 text-sm font-medium text-white transition-all hover:bg-neutral-800 hover:border-[#B5FF00]/30"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-[#B5FF00] px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-[#a0e600]"
                >
                  Registrarse
                </Link>
              </>
            )}

            {/* Client Navigation */}
            {clientUser && clientProfile && !location.pathname.startsWith("/admin") && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 rounded-lg border border-neutral-700 bg-neutral-800/50 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-neutral-800 hover:border-[#B5FF00]/30"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{clientProfile.full_name || 'Mi Cuenta'}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-64 rounded-lg border border-neutral-800 bg-neutral-900 shadow-2xl">
                    {/* User Info */}
                    <div className="border-b border-neutral-800 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B5FF00]/10">
                          <User className="h-5 w-5 text-[#B5FF00]" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-semibold text-white">
                            {clientProfile.full_name || 'Cliente'}
                          </p>
                          <p className="truncate text-xs text-neutral-400">
                            {clientUser?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        to="/client/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
                      >
                        <Home className="h-4 w-4" />
                        <span>Mi Dashboard</span>
                      </Link>

                      <div className="mx-2 my-2 border-t border-neutral-800" />

                      <button
                        onClick={handleClientLogout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-400 transition-colors hover:bg-red-500/10"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Admin Navigation */}
            {adminUser && location.pathname.startsWith("/admin") && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 rounded-lg border border-neutral-700 bg-neutral-800/50 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-neutral-800 hover:border-[#B5FF00]/30"
                >
                  <Settings className="h-4 w-4" />
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-64 rounded-lg border border-neutral-800 bg-neutral-900 shadow-2xl">
                    {/* User Info */}
                    <div className="border-b border-neutral-800 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B5FF00]/10">
                          <User className="h-5 w-5 text-[#B5FF00]" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-semibold text-white">
                            Administrador
                          </p>
                          <p className="truncate text-xs text-neutral-400">
                            {adminUser?.email || "admin@fitter.com"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={handleSettings}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
                      >
                        <Shield className="h-4 w-4" />
                        <div className="flex-1">
                          <p className="font-medium">Autenticación 2FA</p>
                          <p className="text-xs text-neutral-500">
                            {mfaEnabled ? "✓ Activado" : "Desactivado"}
                          </p>
                        </div>
                      </button>

                      <div className="mx-2 my-2 border-t border-neutral-800" />

                      <button
                        onClick={handleAdminLogout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-400 transition-colors hover:bg-red-500/10"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* MFA Modal */}
      {/* TODO: Crear componente MFAModal */}
      {/* <MFAModal
        isOpen={showMFAModal}
        onClose={handleMFAModalClose}
        mfaEnabled={mfaEnabled}
        onStatusChange={checkMFAStatus}
      /> */}
    </header>
  );
}

export default Header;
