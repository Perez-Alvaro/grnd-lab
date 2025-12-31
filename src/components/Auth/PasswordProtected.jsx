import React, { useState, useCallback } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { Button } from '../ui';

/**
 * Componente que protege contenido con contraseña
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido protegido
 * @param {string} props.password - Contraseña requerida
 * @param {string} props.title - Título del prompt de contraseña
 */
const PasswordProtected = ({ children, password = 'GRND-MAX', title = 'Acceso Protegido' }) => {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [inputPassword, setInputPassword] = useState('');
    const [error, setError] = useState('');

    const handleUnlock = useCallback(() => {
        if (inputPassword === password) {
            setIsUnlocked(true);
            setError('');
        } else {
            setError('Contraseña incorrecta');
            setInputPassword('');
        }
    }, [inputPassword, password]);

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter') {
            handleUnlock();
        }
    }, [handleUnlock]);

    // Si está desbloqueado, mostrar el contenido
    if (isUnlocked) {
        return <>{children}</>;
    }

    // Si no está desbloqueado, mostrar el prompt de contraseña
    return (
        <div className="flex flex-col items-center justify-center p-8 bg-[#0E0E0E] rounded-xl border border-[#2E2E2E]">
            <div className="mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 mb-4 mx-auto">
                    <Lock className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-white text-center mb-2">{title}</h3>
                <p className="text-sm text-gray-400 text-center max-w-md">
                    Esta sección contiene herramientas de edición avanzada. Ingresá la contraseña para continuar.
                </p>
            </div>

            <div className="w-full max-w-sm space-y-4">
                <div className="space-y-2">
                    <label htmlFor="password-input" className="text-sm font-medium text-gray-300">
                        Contraseña
                    </label>
                    <input
                        id="password-input"
                        type="password"
                        value={inputPassword}
                        onChange={(e) => {
                            setInputPassword(e.target.value);
                            setError('');
                        }}
                        onKeyPress={handleKeyPress}
                        placeholder="Ingresá la contraseña de acceso"
                        className="w-full rounded-lg border border-[#2E2E2E] bg-[#0A0A0A] px-4 py-3 text-sm text-white shadow-sm transition-colors focus:border-accent focus:outline-none focus:ring-0"
                        autoFocus
                    />
                    {error && (
                        <p className="text-xs text-red-400 flex items-center gap-1">
                            <span className="inline-block w-1 h-1 rounded-full bg-red-400"></span>
                            {error}
                        </p>
                    )}
                </div>

                <Button
                    onClick={handleUnlock}
                    variant="accent"
                    size="sm"
                    className="w-full"
                >
                    <Unlock className="h-4 w-4" />
                    Desbloquear
                </Button>

                <div className="pt-4 border-t border-[#2E2E2E]">
                    <p className="text-xs text-gray-500 text-center">
                        💡 Tip: Si olvidaste la contraseña, contactá al administrador del sistema.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PasswordProtected;
