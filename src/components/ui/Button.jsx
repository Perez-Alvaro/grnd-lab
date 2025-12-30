/**
 * Routine Forge UI - Button Component
 * Base button with variants, sizes, and states
 */

import { forwardRef } from 'react';

const variants = {
    primary: 'bg-accent text-white hover:bg-accent-light active:bg-accent-dark disabled:bg-neutral-700 disabled:text-neutral-500',
    secondary: 'bg-accent-secondary text-white hover:bg-accent-secondary/90 active:bg-accent-secondary/80 disabled:bg-neutral-700 disabled:text-neutral-500',
    outline: 'border-2 border-accent text-white hover:bg-accent/10 active:bg-accent/20 disabled:border-neutral-700 disabled:text-neutral-500',
    ghost: 'text-white hover:bg-accent/10 active:bg-accent/20 disabled:text-neutral-500',
    danger: 'bg-error text-white hover:bg-error/90 active:bg-error/80 disabled:bg-neutral-700 disabled:text-neutral-500',
    accent: 'bg-accent text-white hover:bg-accent-light active:bg-accent-dark shadow-lg shadow-accent/20 disabled:bg-neutral-700 disabled:text-neutral-500',
};

const sizes = {
    sm: 'px-3 py-1.5 text-sm h-8',
    md: 'px-4 py-2 text-base h-10',
    lg: 'px-6 py-3 text-lg h-12',
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
    const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary-bg disabled:cursor-not-allowed disabled:opacity-50';

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
