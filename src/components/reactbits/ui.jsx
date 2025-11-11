import { forwardRef, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn.js";

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
        "bg-[#d7ff00] text-neutral-900 hover:bg-[#e4ff4d] focus-visible:ring-[#d7ff00]/60",
      outline:
        "border-2 border-[#d7ff00] text-neutral-900 hover:bg-[#d7ff00]/10 focus-visible:ring-[#d7ff00]/40",
      ghost:
        "text-neutral-900 hover:bg-[#d7ff00]/10 focus-visible:ring-[#d7ff00]/40",
    },
    lime: {
      solid:
        "bg-[#d7ff00] text-neutral-900 hover:bg-[#e4ff4d] focus-visible:ring-[#d7ff00]/60",
      outline:
        "border-2 border-[#d7ff00] text-neutral-900 hover:bg-[#d7ff00]/10 focus-visible:ring-[#d7ff00]/40",
      ghost:
        "text-[#508200] hover:bg-[#d7ff00]/15 focus-visible:ring-[#d7ff00]/40",
    },
    neutral: {
      solid:
        "bg-neutral-900 text-white hover:bg-neutral-800 focus-visible:ring-neutral-900/60",
      outline:
        "border border-neutral-300 text-neutral-800 hover:bg-white focus-visible:ring-neutral-400/40",
      ghost:
        "text-neutral-600 hover:bg-neutral-200/70 focus-visible:ring-neutral-400/40",
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
        "bg-white rounded-3xl shadow-2xl overflow-hidden animate-[fadeIn_0.4s_ease-out]",
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
  <h3
    className={cn("text-2xl md:text-3xl font-bold text-neutral-900", className)}
  >
    {children}
  </h3>
);

export const DialogDescription = ({ className = "", children }) => (
  <p className={cn("mt-3 text-base text-neutral-600", className)}>{children}</p>
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
