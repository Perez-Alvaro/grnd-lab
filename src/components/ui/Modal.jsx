/**
 * Routine Forge UI - Modal Component
 * Accessible modal dialog with backdrop and animations
 */

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({
    open,
    onClose,
    title,
    children,
    size = 'md',
    showCloseButton = true,
    closeOnBackdrop = true,
    closeOnEsc = true,
}) {
    const dialogRef = useRef(null);

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
        full: 'max-w-full mx-4',
    };

    useEffect(() => {
        if (!open) return;

        const handleEsc = (e) => {
            if (e.key === 'Escape' && closeOnEsc) {
                onClose?.();
            }
        };

        document.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [open, closeOnEsc, onClose]);

    if (!open) return null;

    const handleBackdropClick = (e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) {
            onClose?.();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={handleBackdropClick}
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                className={`relative w-full ${sizes[size]} rounded-2xl border border-border-strong bg-primary-surface shadow-2xl animate-slide-up max-h-[90vh] flex flex-col`}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between border-b border-border px-6 py-4">
                        {title && (
                            <h2 id="modal-title" className="text-xl font-semibold text-text-primary font-display">
                                {title}
                            </h2>
                        )}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="ml-auto rounded-lg p-2 text-text-muted transition-colors hover:bg-primary-bg hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                                aria-label="Cerrar modal"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {children}
                </div>
            </div>
        </div>
    );
}

export function ModalFooter({ children, className = '' }) {
    return (
        <div className={`flex items-center justify-end gap-3 border-t border-border px-6 py-4 ${className}`}>
            {children}
        </div>
    );
}
