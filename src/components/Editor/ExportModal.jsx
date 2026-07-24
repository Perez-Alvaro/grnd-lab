/**
 * Routine Forge - Export Modal Component
 * Allows exporting routines as JSON with preview and copy functionality
 */

import { useState, useMemo } from 'react';
import { IconDownload, IconCopy, IconCircleCheck } from '@tabler/icons-react';
import Modal, { ModalFooter } from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import { editorToExport, sanitizeRoutineData } from '../../lib/transformers/routineTransformer.js';

export default function ExportModal({ open, onClose, planData }) {
    const [filename, setFilename] = useState('');
    const [copied, setCopied] = useState(false);

    const exportData = useMemo(() => {
        if (!planData) return null;
        const exported = editorToExport(planData);
        return sanitizeRoutineData(exported);
    }, [planData]);

    const jsonString = useMemo(() => {
        if (!exportData) return '';
        return JSON.stringify(exportData, null, 2);
    }, [exportData]);

    const effectiveFilename = filename?.trim() || exportData?.meta?.nombre || 'rutina';
    const safeFilename = effectiveFilename.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();

    const handleDownload = () => {
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${safeFilename}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(jsonString);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Error copying to clipboard:', error);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Exportar Rutina como JSON"
            size="lg"
        >
            <div className="space-y-6">
                {/* Filename Input */}
                <Input
                    label="Nombre del archivo"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    placeholder={exportData?.meta?.nombre || 'rutina'}
                    helperText={`Se guardará como: ${safeFilename}.json`}
                />

                {/* JSON Preview */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">
                        Vista previa del JSON
                    </label>
                    <div className="relative">
                        <pre className="max-h-96 overflow-auto rounded-lg border border-border bg-primary-bg p-4 text-xs text-text-primary font-mono">
                            {jsonString}
                        </pre>
                        <button
                            onClick={handleCopy}
                            className="absolute top-2 right-2 rounded-md bg-primary-surface border border-border p-2 text-text-muted hover:text-accent hover:border-accent transition-colors"
                            title="Copiar al portapapeles"
                        >
                            {copied ? (
                                <IconCircleCheck stroke={1.75} className="h-4 w-4 text-success" />
                            ) : (
                                <IconCopy stroke={1.75} className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Stats */}
                {exportData && (
                    <div className="grid grid-cols-3 gap-4">
                        <div className="rounded-lg border border-border bg-primary-bg p-3 text-center">
                            <p className="text-2xl font-bold text-accent">
                                {exportData.semanas?.length || 0}
                            </p>
                            <p className="text-xs text-text-muted mt-1">Semanas</p>
                        </div>
                        <div className="rounded-lg border border-border bg-primary-bg p-3 text-center">
                            <p className="text-2xl font-bold text-accent">
                                {exportData.semanas?.reduce((acc, semana) => acc + (semana.dias?.length || 0), 0) || 0}
                            </p>
                            <p className="text-xs text-text-muted mt-1">Días</p>
                        </div>
                        <div className="rounded-lg border border-border bg-primary-bg p-3 text-center">
                            <p className="text-2xl font-bold text-accent">
                                {exportData.semanas?.reduce(
                                    (acc, semana) =>
                                        acc +
                                        semana.dias?.reduce(
                                            (dayAcc, dia) =>
                                                dayAcc +
                                                dia.bloques?.reduce((blockAcc, bloque) => blockAcc + (bloque.ejercicios?.length || 0), 0),
                                            0
                                        ),
                                    0
                                ) || 0}
                            </p>
                            <p className="text-xs text-text-muted mt-1">Ejercicios</p>
                        </div>
                    </div>
                )}
            </div>

            <ModalFooter>
                <Button variant="ghost" onClick={onClose}>
                    Cerrar
                </Button>
                <Button onClick={handleCopy} variant="outline">
                    <IconCopy stroke={1.75} className="h-4 w-4" />
                    {copied ? 'Copiado!' : 'Copiar JSON'}
                </Button>
                <Button onClick={handleDownload}>
                    <IconDownload stroke={1.75} className="h-4 w-4" />
                    Descargar Archivo
                </Button>
            </ModalFooter>
        </Modal>
    );
}
