/**
 * Routine Forge UI - Tooltip Component
 * Accessible tooltip with positioning
 */

import { useState, useRef, useEffect } from 'react';

export default function Tooltip({
    children,
    content,
    position = 'top',
    delay = 200,
    className = '',
}) {
    const [visible, setVisible] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef(null);
    const tooltipRef = useRef(null);
    const timeoutRef = useRef(null);

    const showTooltip = () => {
        timeoutRef.current = setTimeout(() => {
            setVisible(true);
        }, delay);
    };

    const hideTooltip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setVisible(false);
    };

    useEffect(() => {
        if (!visible || !triggerRef.current || !tooltipRef.current) return;

        const trigger = triggerRef.current.getBoundingClientRect();
        const tooltip = tooltipRef.current.getBoundingClientRect();

        let top = 0;
        let left = 0;

        switch (position) {
            case 'top':
                top = trigger.top - tooltip.height - 8;
                left = trigger.left + (trigger.width - tooltip.width) / 2;
                break;
            case 'bottom':
                top = trigger.bottom + 8;
                left = trigger.left + (trigger.width - tooltip.width) / 2;
                break;
            case 'left':
                top = trigger.top + (trigger.height - tooltip.height) / 2;
                left = trigger.left - tooltip.width - 8;
                break;
            case 'right':
                top = trigger.top + (trigger.height - tooltip.height) / 2;
                left = trigger.right + 8;
                break;
            default:
                break;
        }

        setCoords({ top, left });
    }, [visible, position]);

    return (
        <div className="relative inline-block">
            <div
                ref={triggerRef}
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
                onFocus={showTooltip}
                onBlur={hideTooltip}
            >
                {children}
            </div>
            {visible && content && (
                <div
                    ref={tooltipRef}
                    role="tooltip"
                    className={`fixed z-50 rounded-lg bg-neutral-900 px-3 py-2 text-xs text-text-primary shadow-lg border border-border animate-fade-in ${className}`}
                    style={{
                        top: `${coords.top}px`,
                        left: `${coords.left}px`,
                    }}
                >
                    {content}
                </div>
            )}
        </div>
    );
}
