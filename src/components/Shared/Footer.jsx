import React from "react";
import { Instagram, Mail, Phone } from "lucide-react";

function Footer() {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        {
            name: "Instagram",
            icon: Instagram,
            href: "https://instagram.com/matiasortiztraining",
            label: "@matiasortiztraining"
        },
        {
            name: "Email",
            icon: Mail,
            href: "mailto:contacto@mztraining.com",
            label: "contacto@mztraining.com"
        },
        {
            name: "WhatsApp",
            icon: Phone,
            href: "https://wa.me/5493512800414",
            label: "+54 9 351 280 0414"
        }
    ];

    const legalLinks = [
        { label: "Términos y Condiciones", href: "#" },
        { label: "Política de Privacidad", href: "#" },
        { label: "Política de Reembolso", href: "#" }
    ];

    return (
        <footer className="w-full border-t border-zinc-800 bg-black py-16 px-6">
            <div className="mx-auto max-w-5xl">

                {/* Logo & Brand - Centered */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center gap-3 mb-4">
                        <div className="rounded-2xl bg-zinc-900 p-2">
                            <img src="/mz-logo-mark.PNG" alt="MZ Logo" className="h-10 w-auto" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm uppercase tracking-[0.4em] text-emerald-400">
                                MZ Training
                            </p>
                            <p className="text-lg font-semibold text-white">
                                Matias Ortiz
                            </p>
                        </div>
                    </div>

                    <p className="text-sm text-zinc-400 max-w-md mx-auto">
                        Planes diseñados con ciencia, seguimiento real y técnica aplicada para que alcances tus objetivos.
                    </p>
                </div>

                {/* Social Links - Centered Row */}
                <div className="flex flex-wrap justify-center gap-6 mb-12">
                    {socialLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-emerald-500"
                        >
                            <link.icon className="h-4 w-4" />
                            <span className="hidden sm:inline">{link.label}</span>
                        </a>
                    ))}
                </div>

                {/* Legal Links - Centered Row */}
                <div className="flex flex-wrap justify-center gap-6 mb-8 text-center">
                    {legalLinks.map((link) => (
                        <button
                            key={link.label}
                            className="text-xs text-zinc-500 transition-colors hover:text-emerald-500"
                        >
                            {link.label}
                        </button>
                    ))}
                </div>

                {/* Copyright - Centered */}
                <div className="text-center pt-8 border-t border-zinc-800">
                    <p className="text-sm text-zinc-500">
                        © {currentYear} MZ Training - Matias Ortiz. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
