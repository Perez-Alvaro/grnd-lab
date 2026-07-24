/**
 * Routine Forge UI - Textarea Component
 * Multi-line text input with auto-resize option
 */

import { forwardRef, useEffect, useRef } from 'react';

const Textarea = forwardRef(({
    label,
    error,
    helperText,
    fullWidth = true,
    autoResize = false,
    minRows = 3,
    maxRows = 10,
    className = '',
    containerClassName = '',
    ...props
}, ref) => {
    const internalRef = useRef(null);
    const textareaRef = ref || internalRef;

    const baseClasses = 'rounded-sm border bg-primary-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-all duration-200 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none';

    const borderClasses = error
        ? 'border-error focus:border-error focus:ring-error/20'
        : 'border-border focus:border-accent focus:ring-accent/20';

    const widthClass = fullWidth ? 'w-full' : '';

    // Auto-resize functionality
    useEffect(() => {
        if (!autoResize || !textareaRef.current) return;

        const textarea = textareaRef.current;
        const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight);

        const resize = () => {
            textarea.style.height = 'auto';
            const newHeight = textarea.scrollHeight;
            const minHeight = lineHeight * minRows;
            const maxHeight = lineHeight * maxRows;

            textarea.style.height = `${Math.min(Math.max(newHeight, minHeight), maxHeight)}px`;
        };

        textarea.addEventListener('input', resize);
        resize(); // Initial resize

        return () => textarea.removeEventListener('input', resize);
    }, [autoResize, minRows, maxRows, textareaRef]);

    return (
        <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
            {label && (
                <label className="text-sm font-medium text-text-secondary">
                    {label}
                </label>
            )}
            <textarea
                ref={textareaRef}
                rows={minRows}
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

Textarea.displayName = 'Textarea';

export default Textarea;
