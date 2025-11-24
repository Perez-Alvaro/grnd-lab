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
            href: "https://wa.me/5491123456789",
            label: "+54 911 2345 6789"
        }
    ];

    return (
        <footer className="w-full border-t border-neutral-800 bg-[#050505] py-12 px-6">
            <div className="mx-auto max-w-6xl">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-[#0a0a0a] p-2">
                                <img src="/mz-logo-mark.PNG" alt="MZ Logo" className="h-10 w-auto" />
                            </div>
                            <div>
                                <p className="text-sm uppercase tracking-[0.4em] text-[#00C0A3]">
                                    MZ Training
                                </p>
                                <p className="text-lg font-semibold text-white">
                                    Matias Ortiz
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400">
                            Transformá tu cuerpo con planes técnicamente diseñados para resultados medibles.
                        </p>
                    </div>

                    {/* Contact Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                            Contacto
                        </h3>
                        <ul className="space-y-3">
                            {socialLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 text-sm text-gray-400 transition-colors hover:text-[#0EF2A0]"
                                    >
                                        <link.icon className="h-4 w-4" />
                                        <span>{link.label}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                            Información
                        </h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li>
                                <button className="transition-colors hover:text-[#0EF2A0]">
                                    Términos y Condiciones
                                </button>
                            </li>
                            <li>
                                <button className="transition-colors hover:text-[#0EF2A0]">
                                    Política de Privacidad
                                </button>
                            </li>
                            <li>
                                <button className="transition-colors hover:text-[#0EF2A0]">
                                    Política de Reembolso
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 border-t border-neutral-800 pt-8 text-center">
                    <p className="text-sm text-gray-500">
                        © {currentYear} MZ Training - Matias Ortiz. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
