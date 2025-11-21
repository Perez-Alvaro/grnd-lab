import React, { useState } from "react";
import { Menu, X } from "lucide-react";

function Navbar({ menuItems = [], className = "" }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav
            className={`absolute top-0 w-full px-6 py-6 flex justify-center items-center z-[20] sm:px-8 md:px-10 lg:px-12 ${className}`}
        >
            {/* Menu Desktop - Navegación horizontal a la derecha */}
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
                    </ul>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
