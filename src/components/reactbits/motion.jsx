import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn.js';

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
          }
        });
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export function FadeIn({ as: Component = 'div', className = '', delay = 0, children, distance = 40, ...props }) {
  const { ref, inView } = useInView();

  return (
    <Component
      ref={ref}
      className={cn(
        'opacity-0 translate-y-[var(--fade-distance,40px)] transition-all duration-[900ms] ease-out',
        inView && 'opacity-100 translate-y-0',
        className
      )}
      style={{ '--fade-distance': `${distance}px`, transitionDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </Component>
  );
}

export function ScaleIn({ as: Component = 'div', className = '', delay = 0, children, ...props }) {
  const { ref, inView } = useInView();

  return (
    <Component
      ref={ref}
      className={cn(
        'opacity-0 scale-95 transition-all duration-[700ms] ease-out',
        inView && 'opacity-100 scale-100',
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </Component>
  );
}

export function TransitionBox({ as: Component = 'div', className = '', variant = 'fade-up', delay = 0, children, ...props }) {
  const variants = {
    'fade-up': 'opacity-0 translate-y-10',
    'fade-right': 'opacity-0 -translate-x-10',
    'fade-left': 'opacity-0 translate-x-10',
    'fade-in': 'opacity-0'
  };
  const activeVariants = {
    'fade-up': 'opacity-100 translate-y-0',
    'fade-right': 'opacity-100 translate-x-0',
    'fade-left': 'opacity-100 translate-x-0',
    'fade-in': 'opacity-100'
  };

  const { ref, inView } = useInView();

  return (
    <Component
      ref={ref}
      className={cn('transition-all duration-[850ms] ease-out', variants[variant], inView && activeVariants[variant], className)}
      style={{ transitionDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </Component>
  );
}
