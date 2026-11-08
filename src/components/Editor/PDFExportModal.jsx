import React from 'react';
import { IconX, IconDeviceMobile, IconDeviceDesktop, IconSparkles } from '@tabler/icons-react';
import { Button } from '../ui';

/**
 * Modal para seleccionar el tipo de exportación PDF
 * @param {boolean} open - Si el modal está abierto
 * @param {function} onClose - Callback para cerrar el modal
 * @param {function} onSelectType - Callback cuando se selecciona un tipo (recibe 'mobile' o 'desktop')
 */
export default function PDFExportModal({ open, onClose, onSelectType }) {
    if (!open) return null;

    const handleSelect = (type) => {
        onSelectType(type);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-primary-surface rounded-2xl shadow-2xl border border-border p-6 mx-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-text-primary font-display">
                        Exportar rutina a PDF
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-surface-alt transition-colors text-text-tertiary hover:text-text-primary"
                    >
                        <IconX stroke={1.75} className="h-5 w-5" />
                    </button>
                </div>

                {/* Reaseguro visual de marca blanca */}
                <div className="mb-4 rounded-xl border border-accent/20 bg-accent/5 px-3 py-2.5 text-xs text-text-secondary flex items-center gap-2.5">
                    <IconSparkles stroke={1.75} className="h-4 w-4 text-accent flex-shrink-0" />
                    <p className="truncate">
                        Exportando con tu <strong className="text-text-primary">marca y logo</strong> en la portada.
                    </p>
                </div>

                {/* Description */}
                <p className="text-text-secondary text-sm mb-4">
                    ¿Cómo va a usar tu cliente este PDF?
                </p>

                {/* Options — nombradas por USO, no por el dispositivo que las genera */}
                <div className="space-y-3">
                    {/* Desktop engine = tabla compacta, la opción sólida */}
                    <button
                        onClick={() => handleSelect('desktop')}
                        className="w-full p-4 rounded-xl border-2 border-accent/60 hover:border-accent bg-surface-alt hover:bg-surface-elevated transition-all group text-left"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-primary-bg transition-colors">
                                <IconDeviceDesktop stroke={1.75} className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-text-primary">Para imprimir o mandar</h3>
                                    <span className="px-2 py-0.5 text-xs rounded-md bg-success/10 text-success font-medium">
                                        Recomendado
                                    </span>
                                </div>
                                <p className="text-sm text-text-tertiary">
                                    Tabla clásica y compacta, con índice para saltar a cada semana.
                                </p>
                            </div>
                        </div>
                    </button>

                    {/* Mobile engine = tarjetas, todavía en pruebas */}
                    <button
                        onClick={() => handleSelect('mobile')}
                        className="w-full p-4 rounded-xl border-2 border-border hover:border-accent bg-surface-alt hover:bg-surface-elevated transition-all group text-left"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-primary-bg transition-colors">
                                <IconDeviceMobile stroke={1.75} className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-text-primary">Para leer en el celular</h3>
                                    <span className="px-2 py-0.5 text-xs rounded-md bg-warning/10 text-warning font-medium">
                                        En pruebas
                                    </span>
                                </div>
                                <p className="text-sm text-text-tertiary">
                                    Tarjetas grandes, una por ejercicio. Puede tener detalles sin terminar.
                                </p>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Cancel Button */}
                <div className="mt-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="w-full"
                    >
                        Cancelar
                    </Button>
                </div>
            </div>
        </div>
    );
}
