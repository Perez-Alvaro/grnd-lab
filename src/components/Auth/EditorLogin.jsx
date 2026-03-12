import React, { useState } from 'react';
import { Lock, Unlock, User } from 'lucide-react';
import { Button } from '../ui';

const EditorLogin = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === 'sudoadmin' && password === '1326') {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Usuario o contraseña incorrectos');
        }
    };

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen items-center justify-center bg-primary-bg p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="w-full max-w-md bg-[#0E0E0E] p-8 rounded-2xl border border-[#2E2E2E] shadow-2xl relative z-10">
                <div className="mb-8 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 mb-4 mx-auto">
                        <Lock className="h-8 w-8 text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold text-white font-display mb-2">Acceso Restringido</h2>
                    <p className="text-sm text-gray-400">
                        Ingresá tus credenciales para acceder al Editor de Rutinas.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                            <User className="h-4 w-4" /> Usuario
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Usuario"
                            className="w-full rounded-xl border border-[#2E2E2E] bg-[#0A0A0A] px-4 py-3 text-sm text-white focus:border-accent focus:outline-none transition-colors"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                            <Lock className="h-4 w-4" /> Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Contraseña"
                            className="w-full rounded-xl border border-[#2E2E2E] bg-[#0A0A0A] px-4 py-3 text-sm text-white focus:border-accent focus:outline-none transition-colors"
                        />
                        {error && (
                            <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                                <span className="inline-block w-1 h-1 rounded-full bg-red-400"></span>
                                {error}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        variant="accent"
                        size="lg"
                        className="w-full h-12 mt-4"
                    >
                        <Unlock className="mr-2 h-4 w-4" />
                        Acceder al Editor
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default EditorLogin;
