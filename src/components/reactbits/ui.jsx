import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn.js';

export const Container = forwardRef(function Container({ className = '', children, ...props }, ref) {
  return (
    <div ref={ref} className={cn('mx-auto w-full px-6 md:px-10', className)} {...props}>
      {children}
    </div>
  );
});

export const Button = forwardRef(function Button(
  { className = '', variant = 'solid', color = 'primary', size = 'md', rounded = 'md', ...props },
  ref
) {
  const base = 'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent';
  const roundedMap = {
    none: '',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    full: 'rounded-full'
  };
  const sizeMap = {
    sm: 'text-sm px-4 py-2',
    md: 'text-base px-5 py-3',
    lg: 'text-lg px-7 py-4'
  };

  const palette = {
    primary: {
      solid: 'bg-[#d7ff00] text-neutral-900 hover:bg-[#e4ff4d] focus-visible:ring-[#d7ff00]/60',
      outline: 'border-2 border-[#d7ff00] text-neutral-900 hover:bg-[#d7ff00]/10 focus-visible:ring-[#d7ff00]/40',
      ghost: 'text-neutral-900 hover:bg-[#d7ff00]/10 focus-visible:ring-[#d7ff00]/40'
    },
    lime: {
      solid: 'bg-[#d7ff00] text-neutral-900 hover:bg-[#e4ff4d] focus-visible:ring-[#d7ff00]/60',
      outline: 'border-2 border-[#d7ff00] text-neutral-900 hover:bg-[#d7ff00]/10 focus-visible:ring-[#d7ff00]/40',
      ghost: 'text-[#508200] hover:bg-[#d7ff00]/15 focus-visible:ring-[#d7ff00]/40'
    },
    neutral: {
      solid: 'bg-neutral-900 text-white hover:bg-neutral-800 focus-visible:ring-neutral-900/60',
      outline: 'border border-neutral-300 text-neutral-800 hover:bg-white focus-visible:ring-neutral-400/40',
      ghost: 'text-neutral-600 hover:bg-neutral-200/70 focus-visible:ring-neutral-400/40'
    }
  };

  return (
    <button
      ref={ref}
      className={cn(base, roundedMap[rounded] ?? roundedMap.md, sizeMap[size] ?? sizeMap.md, palette[color]?.[variant] ?? palette.primary.solid, className)}
      {...props}
    />
  );
});

export const Card = forwardRef(function Card({ className = '', children, interactive = false, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        'bg-white/80 backdrop-blur-sm border border-neutral-200/80 shadow-sm rounded-3xl overflow-hidden transition-all duration-500',
        interactive && 'hover:shadow-xl hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export const CardMedia = forwardRef(function CardMedia({ className = '', children, ...props }, ref) {
  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)} {...props}>
      {children}
    </div>
  );
});

export const CardBody = forwardRef(function CardBody({ className = '', children, ...props }, ref) {
  return (
    <div ref={ref} className={cn('p-6 md:p-8', className)} {...props}>
      {children}
    </div>
  );
});

export const CardFooter = forwardRef(function CardFooter({ className = '', children, ...props }, ref) {
  return (
    <div ref={ref} className={cn('p-6 pt-0 md:px-8 md:pt-4', className)} {...props}>
      {children}
    </div>
  );
});

export const Tag = forwardRef(function Tag({ className = '', children, tone = 'neutral', ...props }, ref) {
  const toneMap = {
    neutral: 'bg-neutral-900/10 text-neutral-800',
    lime: 'bg-[#d7ff00]/20 text-[#3b5b00] border border-[#d7ff00]/40',
    accent: 'bg-neutral-900 text-white'
  };
  return (
    <span ref={ref} className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide', toneMap[tone], className)} {...props}>
      {children}
    </span>
  );
});

function ArrowButton({ direction = 'left', onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-white shadow-lg p-3 text-neutral-900 transition-all hover:shadow-xl disabled:opacity-40',
        direction === 'left' ? 'left-3' : 'right-3'
      )}
    >
      <span className="sr-only">{direction === 'left' ? 'Anterior' : 'Siguiente'}</span>
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        {direction === 'left' ? <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
    </button>
  );
}

export function Carousel({ children, className = '', itemWidth = 320 }) {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    const el = containerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  const scrollBy = (offset) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const items = useMemo(() => React.Children.toArray(children), [children]);

  useEffect(() => {
    updateScrollButtons();
  }, [items.length]);

  return (
    <div className={cn('relative w-full', className)}>
      <div
        ref={containerRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-300"
        onScroll={updateScrollButtons}
      >
        {items.map((child, index) => (
          <div
            key={index}
            className="snap-center flex-none"
            style={{ width: itemWidth, maxWidth: '90vw' }}
          >
            {child}
          </div>
        ))}
      </div>
      <ArrowButton direction="left" onClick={() => scrollBy(-itemWidth - 32)} disabled={!canScrollLeft} />
      <ArrowButton direction="right" onClick={() => scrollBy(itemWidth + 32)} disabled={!canScrollRight} />
    </div>
  );
}

export const CarouselItem = ({ children, className = '' }) => (
  <div className={cn('h-full', className)}>{children}</div>
);

function useDialogPortal() {
  const [mounted, setMounted] = useState(false);
  const portalRef = useRef(null);

  React.useEffect(() => {
    portalRef.current = document.createElement('div');
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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
      <div
        className="relative w-full max-w-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    portalNode
  );
}

export const DialogContent = forwardRef(function DialogContent({ className = '', children, ...props }, ref) {
  return (
    <div ref={ref} className={cn('bg-white rounded-3xl shadow-2xl overflow-hidden animate-[fadeIn_0.4s_ease-out]', className)} {...props}>
      {children}
    </div>
  );
});

export const DialogHeader = ({ className = '', children }) => (
  <div className={cn('px-8 pt-8 pb-4', className)}>{children}</div>
);

export const DialogTitle = ({ className = '', children }) => (
  <h3 className={cn('text-2xl md:text-3xl font-bold text-neutral-900', className)}>{children}</h3>
);

export const DialogDescription = ({ className = '', children }) => (
  <p className={cn('mt-3 text-base text-neutral-600', className)}>{children}</p>
);

export const DialogFooter = ({ className = '', children }) => (
  <div className={cn('px-8 pb-8 pt-4 flex flex-col gap-3 md:flex-row md:justify-end', className)}>{children}</div>
);

