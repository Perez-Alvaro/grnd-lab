/**
 * Routine Forge UI - Input Component
 * Text input with label, error states, and variants
 */

import { forwardRef } from 'react';

const Input = forwardRef(({
    label,
    error,
    helperText,
    fullWidth = true,
    className = '',
    containerClassName = '',
    ...props
}, ref) => {
    const baseClasses = 'rounded-sm border bg-primary-surface px-4 py-2.5 min-h-[44px] text-base sm:text-sm text-text-primary placeholder:text-text-muted transition-all duration-200 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50';

    const borderClasses = error
        ? 'border-error focus:border-error focus:ring-error/20'
        : 'border-border focus:border-accent focus:ring-accent/20';

    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
            {label && (
                <label className="text-sm font-medium text-text-secondary">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                className={`${baseClasses} ${borderClasses} ${widthClass} ${className}`}
                {...props}
            />
            {(error || helperText) && (
                <span className={`text-xs ${error ? 'text-error' : 'text-text-muted'}`}>
                    {error || helperText}
                </span>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
