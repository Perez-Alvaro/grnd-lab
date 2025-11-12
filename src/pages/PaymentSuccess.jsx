import React from "react";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

function PaymentSuccess() {
  return (
    <div className="bg-[#0E0E0E]">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#2E2E2E] bg-[#0E0E0E] p-10 text-center shadow-[0_50px_120px_-60px_rgba(0,0,0,0.8)]">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#B5FF00] bg-[#101010]">
            <CheckCircle className="h-10 w-10 text-[#B5FF00]" />
          </div>
          <h1 className="text-4xl font-bold text-white">
            ¡Bienvenido a Fitter!
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            ¡Tu pago fue exitoso y tu rutina personalizada está en camino!
          </p>

          <div className="mt-10 rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-6 text-left">
            <h3 className="text-lg font-semibold text-[#B5FF00]">
              ¿Qué sigue?
            </h3>
            <ul className="mt-4 space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <span className="mt-1 block h-2 w-2 rounded-full bg-[#B5FF00]" />
                <span>
                  Revisá tu correo para descargar la rutina personalizada en
                  PDF.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 block h-2 w-2 rounded-full bg-[#B5FF00]" />
                <span>
                  Accedé a los videos técnicos con demostraciones de cada
                  ejercicio.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 block h-2 w-2 rounded-full bg-[#B5FF00]" />
                <span>
                  Clientes Premium: recibirás seguimiento personalizado en las
                  próximas 24 horas.
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#B5FF00] px-6 py-3 font-semibold text-black transition-all hover:-translate-y-0.5 hover:bg-[#D0FF4D]"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Volver al inicio</span>
            </Link>
            <button className="inline-flex items-center justify-center gap-2 rounded-full border border-[#B5FF00] px-6 py-3 font-medium text-[#B5FF00] transition-colors hover:bg-[#B5FF00]/10">
              Contactar soporte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
