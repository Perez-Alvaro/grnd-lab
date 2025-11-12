import { forwardRef, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../../utils/cn.js";

export const Button = forwardRef(function Button(
  {
    className = "",
    variant = "solid",
    color = "primary",
    size = "md",
    rounded = "md",
    ...props
  },
  ref,
) {
  const base =
    "inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";
  const roundedMap = {
    none: "",
    md: "rounded-xl",
    lg: "rounded-2xl",
    full: "rounded-full",
  };
  const sizeMap = {
    sm: "text-sm px-4 py-2",
    md: "text-base px-5 py-3",
    lg: "text-lg px-7 py-4",
  };

  const palette = {
    primary: {
      solid:
        "bg-[#B5FF00] text-black hover:bg-[#D0FF4D] focus-visible:ring-[#B5FF00]/60",
      outline:
        "border-2 border-[#B5FF00] text-[#B5FF00] hover:bg-[#B5FF00]/10 focus-visible:ring-[#B5FF00]/40",
      ghost:
        "text-[#B5FF00] hover:bg-[#B5FF00]/10 focus-visible:ring-[#B5FF00]/40",
    },
    lime: {
      solid:
        "bg-[#B5FF00] text-black hover:bg-[#D0FF4D] focus-visible:ring-[#B5FF00]/60",
      outline:
        "border-2 border-[#B5FF00] text-[#B5FF00] hover:bg-[#B5FF00]/10 focus-visible:ring-[#B5FF00]/40",
      ghost:
        "text-[#B5FF00] hover:bg-[#B5FF00]/10 focus-visible:ring-[#B5FF00]/40",
    },
    neutral: {
      solid:
        "bg-[#1A1A1A] text-gray-200 hover:bg-[#222] focus-visible:ring-[#B5FF00]/20",
      outline:
        "border border-[#2E2E2E] text-gray-200 hover:bg-[#1A1A1A] focus-visible:ring-[#B5FF00]/20",
      ghost: "text-gray-400 hover:bg-[#1A1A1A] focus-visible:ring-[#B5FF00]/20",
    },
  };

  return (
    <button
      ref={ref}
      className={cn(
        base,
        roundedMap[rounded] ?? roundedMap.md,
        sizeMap[size] ?? sizeMap.md,
        palette[color]?.[variant] ?? palette.primary.solid,
        className,
      )}
      {...props}
    />
  );
});

function useDialogPortal() {
  const [mounted, setMounted] = useState(false);
  const portalRef = useRef(null);

  useEffect(() => {
    portalRef.current = document.createElement("div");
    document.body.appendChild(portalRef.current);
    setMounted(true);
    return () => {
      if (portalRef.current) {
        document.body.removeChild(portalRef.current);
      }
    };
  }, []);

  return mounted ? portalRef.current : null;
}

export function Dialog({ open, onOpenChange, children }) {
  const portalNode = useDialogPortal();

  if (!open || !portalNode) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      onClick={() => onOpenChange?.(false)}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <div
        className="relative w-full max-w-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    portalNode,
  );
}

export const DialogContent = forwardRef(function DialogContent(
  { className = "", children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-[#0E0E0E] rounded-3xl border border-[#2E2E2E] shadow-[0_50px_140px_-70px_rgba(0,0,0,0.85)] overflow-hidden animate-[fadeIn_0.4s_ease-out]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export const DialogHeader = ({ className = "", children }) => (
  <div className={cn("px-8 pt-8 pb-4", className)}>{children}</div>
);

export const DialogTitle = ({ className = "", children }) => (
  <h3 className={cn("text-2xl md:text-3xl font-bold text-white", className)}>
    {children}
  </h3>
);

export const DialogDescription = ({ className = "", children }) => (
  <p className={cn("mt-3 text-base text-gray-400", className)}>{children}</p>
);

export const DialogFooter = ({ className = "", children }) => (
  <div
    className={cn(
      "px-8 pb-8 pt-4 flex flex-col gap-3 md:flex-row md:justify-end",
      className,
    )}
  >
    {children}
  </div>
);
