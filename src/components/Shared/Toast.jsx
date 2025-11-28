import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

/**
 * Componente Toast individual
 */
function Toast({ id, type = "success", message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 4000); // 4 segundos

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const config = {
    success: {
      icon: CheckCircle,
      bgColor: "bg-emerald-500/20",
      borderColor: "border-emerald-500/40",
      textColor: "text-emerald-400",
      iconColor: "text-emerald-400",
    },
    error: {
      icon: XCircle,
      bgColor: "bg-red-500/20",
      borderColor: "border-red-500/40",
      textColor: "text-red-400",
      iconColor: "text-red-400",
    },
    warning: {
      icon: AlertTriangle,
      bgColor: "bg-yellow-500/20",
      borderColor: "border-yellow-500/40",
      textColor: "text-yellow-400",
      iconColor: "text-yellow-400",
    },
    info: {
      icon: Info,
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500/40",
      textColor: "text-blue-400",
      iconColor: "text-blue-400",
    },
  };

  const { icon: Icon, bgColor, borderColor, textColor, iconColor } = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex items-center gap-3 rounded-xl border ${borderColor} ${bgColor} backdrop-blur-sm px-4 py-3 shadow-2xl min-w-[320px] max-w-md`}
    >
      <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0`} />
      <p className={`text-sm font-medium ${textColor} flex-1`}>{message}</p>
      <button
        onClick={() => onClose(id)}
        className={`${textColor} hover:opacity-70 transition-opacity flex-shrink-0`}
        aria-label="Cerrar notificación"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

/**
 * Contenedor de Toasts
 */
export function ToastContainer({ toasts, onClose }) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              id={toast.id}
              type={toast.type}
              message={toast.message}
              onClose={onClose}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default Toast;
