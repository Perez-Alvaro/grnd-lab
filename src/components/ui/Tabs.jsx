/**
 * Routine Forge UI - Tabs Component
 * Accessible tab navigation with keyboard support
 */

import { createContext, useContext, useState } from 'react';

const TabsContext = createContext();

export function Tabs({ children, defaultValue, value: controlledValue, onValueChange, className = '' }) {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;

    const setValue = (newValue) => {
        if (!isControlled) {
            setInternalValue(newValue);
        }
        onValueChange?.(newValue);
    };

    return (
        <TabsContext.Provider value={{ value: currentValue, setValue }}>
            <div className={className}>
                {children}
            </div>
        </TabsContext.Provider>
    );
}

export function TabsList({ children, className = '', ...props }) {
    return (
        <div
            role="tablist"
            className={`flex items-center gap-1 rounded-lg bg-primary-bg border border-border p-1 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

export function TabsTrigger({ value, children, className = '', ...props }) {
    const { value: currentValue, setValue } = useContext(TabsContext);
    const isActive = currentValue === value;

    return (
        <button
            role="tab"
            aria-selected={isActive}
            onClick={() => setValue(value)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary-bg ${isActive
                    ? 'bg-accent text-primary-bg shadow-sm'
                    : 'text-text-secondary hover:bg-primary-surface hover:text-text-primary'
                } ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export function TabsContent({ value, children, className = '', forceMount = false, ...props }) {
    const { value: currentValue } = useContext(TabsContext);
    const isActive = currentValue === value;

    if (!isActive && !forceMount) return null;

    return (
        <div
            role="tabpanel"
            aria-hidden={!isActive}
            className={`mt-4 focus:outline-none ${!isActive && 'hidden'} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
