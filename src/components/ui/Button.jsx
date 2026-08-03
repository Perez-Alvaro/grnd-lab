/**
 * Routine Forge UI - Button Component
 * Base button with variants, sizes, and states
 */

import { forwardRef } from 'react';

const variants = {
    primary: 'bg-accent text-primary-bg hover:bg-accent-light active:bg-accent-dark disabled:bg-border disabled:text-text-quaternary',
    secondary: 'bg-accent-secondary text-primary-bg hover:bg-accent-secondary/90 active:bg-accent-secondary/80 disabled:bg-border disabled:text-text-quaternary',
    outline: 'border-2 border-accent text-text-primary hover:bg-accent/10 active:bg-accent/20 disabled:border-neutral-700 disabled:text-neutral-500',
    ghost: 'text-text-primary hover:bg-accent/10 active:bg-accent/20 disabled:text-neutral-500',
    danger: 'bg-error text-white hover:bg-error/90 active:bg-error/80 disabled:bg-border disabled:text-text-quaternary',
    accent: 'bg-accent text-primary-bg hover:bg-accent-light active:bg-accent-dark shadow-lg shadow-accent/20 disabled:bg-border disabled:text-text-quaternary',
};

// En mobile todo control llega a 44px de alto (mínimo táctil de Apple HIG /
// Material). A partir de sm: recuperamos la densidad compacta del desktop.
const sizes = {
    sm: 'px-3 text-sm h-11 sm:h-8 sm:py-1.5',
    md: 'px-4 text-base h-12 sm:h-10 sm:py-2',
    lg: 'px-6 py-3 text-lg h-12',
    // Icon-only: cuadrado y siempre tocable.
    icon: 'p-0 h-11 w-11 sm:h-9 sm:w-9',
};

const Button = forwardRef(({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    disabled = false,
    className = '',
    ...props
}, ref) => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary-bg disabled:cursor-not-allowed disabled:opacity-50';

    const variantClass = variants[variant] || variants.primary;
    const sizeClass = sizes[size] || sizes.md;
    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={`${baseClasses} ${variantClass} ${sizeClass} ${widthClass} ${className}`}
            {...props}
        >
            {loading && (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {children}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;
