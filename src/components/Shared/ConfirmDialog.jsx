import React from "react";
import { AlertTriangle, Trash2, Power, PowerOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./reactbits/index.js";

/**
 * Modal de confirmación personalizado con la estética de la aplicación
 *
 * @param {boolean} open - Si el modal está abierto
 * @param {function} onClose - Callback cuando se cierra
 * @param {function} onConfirm - Callback cuando se confirma
 * @param {string} title - Título del modal
 * @param {string} description - Descripción/mensaje
 * @param {string} confirmText - Texto del botón confirmar (default: "Confirmar")
 * @param {string} cancelText - Texto del botón cancelar (default: "Cancelar")
 * @param {string} variant - Variante de color: "danger", "warning", "success" (default: "danger")
 * @param {string} icon - Icono a mostrar: "delete", "toggle-on", "toggle-off", "warning" (default: "warning")
 */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "¿Estás seguro?",
  description = "Esta acción no se puede deshacer.",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger", // "danger" | "warning" | "success"
  icon = "warning", // "delete" | "toggle-on" | "toggle-off" | "warning"
}) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const iconComponents = {
    delete: Trash2,
    "toggle-on": Power,
    "toggle-off": PowerOff,
    warning: AlertTriangle,
  };

  const IconComponent = iconComponents[icon] || AlertTriangle;

  const variantStyles = {
    danger: {
      iconBg: "bg-red-500/20",
      iconColor: "text-red-400",
      confirmBg: "bg-red-500 hover:bg-red-600",
      confirmText: "text-white",
      border: "border-red-500/40",
    },
    warning: {
      iconBg: "bg-yellow-500/20",
      iconColor: "text-yellow-400",
      confirmBg: "bg-yellow-500 hover:bg-yellow-600",
      confirmText: "text-black",
      border: "border-yellow-500/40",
    },
    success: {
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
      confirmBg: "bg-emerald-500 hover:bg-emerald-600",
      confirmText: "text-black",
      border: "border-emerald-500/40",
    },
  };

  const styles = variantStyles[variant] || variantStyles.danger;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md bg-[#1A1A1A] border-[#2E2E2E] rounded-2xl p-0 overflow-hidden">
        {/* Icon Section */}
        <div className="flex items-center justify-center pt-8 pb-4">
          <div className={`rounded-full p-4 ${styles.iconBg} border ${styles.border}`}>
            <IconComponent className={`w-8 h-8 ${styles.iconColor}`} />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <DialogHeader className="text-center space-y-2">
            <DialogTitle className="text-2xl font-bold !text-white">
              {title}
            </DialogTitle>
            <DialogDescription className="text-base !text-zinc-400 leading-relaxed">
              {description}
            </DialogDescription>
          </DialogHeader>

          {/* Actions */}
          <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center mt-6">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto rounded-full border-2 border-[#2E2E2E] bg-transparent px-6 py-3 text-sm font-semibold !text-zinc-300 transition-all duration-300 hover:border-zinc-600 hover:bg-zinc-800/50"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`w-full sm:w-auto rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wide ${styles.confirmBg} ${styles.confirmText} shadow-lg transition-all duration-300 hover:scale-105`}
            >
              {confirmText}
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
