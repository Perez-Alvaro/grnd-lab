import React, { useState, useRef, useEffect } from "react";
import { Menu, X, Settings, Shield, LogOut, LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/context/UnifiedAuthContext";

/**
 * Unified Navbar Component
 * Supports both client-facing navigation and admin functionality
 * Features:
 * - Responsive design (mobile/desktop)
 * - Client navigation menu items
 * - Admin authentication controls (2FA, logout)
 * - Public auth buttons (login/register)
 */
function Navbar({ menuItems = [], className = "" }) {
    // ==================== STATE MANAGEMENT ====================
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const settingsRef = useRef(null);
    const navigate = useNavigate();
    const { user, signOut } = useAdminAuth();

    // ==================== EFFECTS ====================
    // Close settings dropdown when clicking outside
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

    // ==================== EVENT HANDLERS ====================
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

    const handleLogin = () => {
        navigate('/mz-admin-access');
    };

    const handleRegister = () => {
        navigate('/mz-admin-access');
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    // ==================== RENDER HELPERS ====================
    const renderDesktopMenu = () => {
        if (!menuItems || menuItems.length === 0) return null;

        return (
            <div className="hidden md:flex items-center gap-6">
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        onClick={item.onClick}
                        className="text-sm font-medium text-white/70 transition-colors hover:text-emerald-500 hover:scale-105"
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        );
    };

    const renderAdminControls = () => (
        <div className="hidden sm:block relative" ref={settingsRef}>
            <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className="flex items-center justify-center rounded-full border border-emerald-500/50 p-2.5 text-emerald-500 transition-all hover:bg-emerald-500/10 hover:border-emerald-400 hover:rotate-90"
                title="Configuración"
                aria-label="Abrir menú de configuración"
            >
                <Settings className="h-5 w-5" />
            </button>

            {settingsOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-xl border border-zinc-800 bg-black/95 backdrop-blur-lg shadow-2xl overflow-hidden">
                    <div className="p-2">
                        <button
                            onClick={handleMFASettings}
                            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-white transition-colors hover:bg-emerald-500/10"
                        >
                            <Shield className="h-4 w-4 text-emerald-400" />
                            <div className="flex-1">
                                <p className="font-medium">Autenticación 2FA</p>
                                <p className="text-xs text-zinc-400">Configurar seguridad</p>
                            </div>
                        </button>

                        <div className="my-1 border-t border-zinc-800" />

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
    );

    const renderPublicAuthButtons = () => (
        <>
            <button
                onClick={handleLogin}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors hover:bg-zinc-800/50"
            >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
            </button>

            <button
                onClick={handleRegister}
                className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-500 text-sm font-bold text-black transition-all hover:bg-emerald-600 hover:scale-105"
            >
                <UserPlus className="h-4 w-4" />
                <span>Register</span>
            </button>
        </>
    );

    const renderMobileMenuToggle = () => (
        <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 text-white hover:bg-zinc-800/50 rounded-lg transition-colors"
            aria-label="Toggle menu"
        >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
    );

    const renderMobileMenu = () => {
        if (!mobileMenuOpen) return null;

        return (
            <div className="sm:hidden border-t border-zinc-800 bg-black/95 backdrop-blur-lg">
                <ul className="flex flex-col px-6 py-4 gap-2">
                    {/* Navigation Menu Items */}
                    {menuItems && menuItems.length > 0 && menuItems.map((item, index) => (
                        <li key={`menu-${index}`}>
                            <button
                                onClick={() => {
                                    item.onClick();
                                    closeMobileMenu();
                                }}
                                className="flex w-full items-center px-4 py-3 rounded-lg text-left text-sm text-white/80 transition-colors hover:bg-emerald-500/10 hover:text-emerald-400"
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}

                    {/* Divider */}
                    {menuItems && menuItems.length > 0 && (
                        <div className="my-1 border-t border-zinc-800" />
                    )}

                    {/* Auth Options */}
                    {!user ? (
                        <>
                            {/* Public Auth Buttons */}
                            <li>
                                <button
                                    onClick={() => {
                                        handleLogin();
                                        closeMobileMenu();
                                    }}
                                    className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-left text-sm text-white transition-colors hover:bg-zinc-800/50"
                                >
                                    <LogIn className="h-4 w-4" />
                                    <span>Login</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => {
                                        handleRegister();
                                        closeMobileMenu();
                                    }}
                                    className="flex w-full items-center gap-3 px-4 py-3 rounded-lg bg-emerald-500 text-left text-sm font-bold text-black transition-colors hover:bg-emerald-600"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    <span>Register</span>
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            {/* Admin Controls */}
                            <li>
                                <button
                                    onClick={() => {
                                        handleMFASettings();
                                        closeMobileMenu();
                                    }}
                                    className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-left text-sm text-emerald-400 transition-colors hover:bg-emerald-500/10"
                                >
                                    <Shield className="h-4 w-4" />
                                    <span>Configurar 2FA</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        closeMobileMenu();
                                    }}
                                    className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-left text-sm text-red-400 transition-colors hover:bg-red-500/10"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Cerrar sesión</span>
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        );
    };

    // ==================== MAIN RENDER ====================
    return (
        <nav className={`sticky top-0 w-full z-50 border-b border-zinc-800/50 bg-black/80 backdrop-blur-md ${className}`}>
            <div className="mx-auto px-6 py-4 flex justify-between items-center sm:px-8 md:px-10 lg:px-12">
                {/* Desktop Navigation Menu */}
                {renderDesktopMenu()}

                {/* Right Side Controls */}
                <div className="flex items-center gap-3">
                    {user ? renderAdminControls() : renderPublicAuthButtons()}
                    {renderMobileMenuToggle()}
                </div>
            </div>

            {/* Mobile Menu */}
            {renderMobileMenu()}
        </nav>
    );
}

export default Navbar;
