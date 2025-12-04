/**
 * Routine Forge UI - Badge Component
 * Small labeled tags for metadata display
 */

import { forwardRef } from 'react';

const variants = {
    default: 'bg-neutral-800 text-text-secondary border-border',
    accent: 'bg-accent/10 text-accent border-accent/20',
    secondary: 'bg-accent-secondary/10 text-accent-secondary border-accent-secondary/20',
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    error: 'bg-error/10 text-error border-error/20',
};

const sizes = {
    sm: 'px-2 py-0.5 text-2xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
};

const Badge = forwardRef(({
    children,
    variant = 'default',
    size = 'md',
    className = '',
    ...props
}, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-full border font-medium';
    const variantClass = variants[variant] || variants.default;
    const sizeClass = sizes[size] || sizes.md;

    return (
        <span
            ref={ref}
            className={`${baseClasses} ${variantClass} ${sizeClass} ${className}`}
            {...props}
        >
            {children}
        </span>
    );
});

Badge.displayName = 'Badge';

export default Badge;
