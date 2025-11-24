import React, { useState, useRef, useEffect } from "react";
import { Menu, X, Settings, Shield, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/context/UnifiedAuthContext";

function Navbar({ menuItems = [], className = "" }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const settingsRef = useRef(null);
    const navigate = useNavigate();
    const { user, signOut } = useAdminAuth();

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target)) {
                setSettingsOpen(false);
            }
        };

        if (settingsOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [settingsOpen]);

    const handleLogout = async () => {
        setSettingsOpen(false);
        try {
            const { error } = await signOut();
            if (error) {
                console.error('Error al cerrar sesión:', error);
            }
            navigate('/mz-admin-access', { replace: true });
        } catch (error) {
            console.error('Error inesperado al cerrar sesión:', error);
            navigate('/mz-admin-access', { replace: true });
        }
    };

    const handleMFASettings = () => {
        setSettingsOpen(false);
        navigate('/admin/mfa-management');
    };

    return (
        <nav
            className={`absolute top-0 w-full px-6 py-6 flex justify-center items-center z-[20] sm:px-8 md:px-10 lg:px-12 ${className}`}
        >
            {/* Menu Desktop - Navegación horizontal centrada */}
            <ul className="hidden items-center gap-8 text-white md:flex lg:gap-12">
                {menuItems.map((item, index) => (
                    <li key={index}>
                        <button
                            onClick={item.onClick}
                            className="text-xs uppercase tracking-widest transition-colors hover:text-[#0EF2A0] lg:text-sm"
                        >
                            {item.label}
                        </button>
                    </li>
                ))}
            </ul>

            {/* Settings Button - Desktop (posición absoluta a la derecha) */}
            {user && (
                <div className="hidden md:block absolute right-6 lg:right-12" ref={settingsRef}>
                    <button
                        onClick={() => setSettingsOpen(!settingsOpen)}
                        className="flex items-center justify-center rounded-full border border-[#00C0A3]/50 p-2.5 text-[#0EF2A0] transition-all hover:bg-[#00C0A3]/10 hover:border-[#0EF2A0] hover:rotate-90"
                        title="Configuración"
                        aria-label="Abrir menú de configuración"
                    >
                        <Settings className="h-5 w-5" />
                    </button>

                    {/* Dropdown Menu */}
                    {settingsOpen && (
                        <div className="absolute right-0 mt-3 w-56 rounded-xl border border-white/10 bg-black/95 backdrop-blur-lg shadow-2xl overflow-hidden">
                            <div className="p-2">
                                <button
                                    onClick={handleMFASettings}
                                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-white transition-colors hover:bg-[#00C0A3]/10"
                                >
                                    <Shield className="h-4 w-4 text-[#0EF2A0]" />
                                    <div className="flex-1">
                                        <p className="font-medium">Autenticación 2FA</p>
                                        <p className="text-xs text-gray-400">Configurar seguridad</p>
                                    </div>
                                </button>
                                
                                <div className="my-1 border-t border-white/10" />
                                
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-red-400 transition-colors hover:bg-red-500/10"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <div className="flex-1">
                                        <p className="font-medium">Cerrar sesión</p>
                                        <p className="text-xs text-red-300/60">Salir del panel</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Menu Mobile - Botón hamburguesa */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white md:hidden"
                aria-label="Toggle menu"
            >
                {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <Menu className="h-6 w-6" />
                )}
            </button>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="absolute top-full right-6 mt-2 rounded-2xl border border-white/10 bg-black/90 p-4 backdrop-blur-lg md:hidden">
                    <ul className="flex flex-col gap-4">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => {
                                        item.onClick();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full text-left text-sm uppercase tracking-wider text-white transition-colors hover:text-[#0EF2A0]"
                                >
                                    {item.label}
                                </button>
                            </li>
                        ))}
                        
                        {/* Admin Controls - Mobile */}
                        {user && (
                            <>
                                <li className="border-t border-white/10 pt-4">
                                    <button
                                        onClick={() => {
                                            handleMFASettings();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="flex w-full items-center gap-2 text-left text-sm text-[#0EF2A0] transition-colors hover:text-[#00C0A3]"
                                    >
                                        <Shield className="h-4 w-4" />
                                        <span>Configurar 2FA</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="flex w-full items-center gap-2 text-left text-sm text-red-400 transition-colors hover:text-red-300"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Cerrar sesión</span>
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
