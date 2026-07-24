/**
 * Routine Forge UI - Select Component
 * Dropdown select with label and error states
 */

import { forwardRef } from 'react';
import { IconChevronDown } from '@tabler/icons-react';

const Select = forwardRef(({
    label,
    error,
    helperText,
    fullWidth = true,
    children,
    className = '',
    containerClassName = '',
    ...props
}, ref) => {
    const baseClasses = 'rounded-sm border bg-primary-surface px-4 py-2.5 pr-10 text-sm text-text-primary transition-all duration-200 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none';

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
            <div className="relative">
                <select
                    ref={ref}
                    className={`${baseClasses} ${borderClasses} ${widthClass} ${className}`}
                    {...props}
                >
                    {children}
                </select>
                <IconChevronDown stroke={1.75} className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
            {(error || helperText) && (
                <span className={`text-xs ${error ? 'text-error' : 'text-text-muted'}`}>
                    {error || helperText}
                </span>
            )}
        </div>
    );
});

Select.displayName = 'Select';

export default Select;
