/**
 * Routine Forge - Import Modal Component
 * Allows importing routines from JSON files with schema validation
 */

import { useState, useCallback } from 'react';
import { Upload, AlertCircle, CheckCircle2, FileJson } from 'lucide-react';
import Modal, { ModalFooter } from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import { importToEditor } from '../../lib/transformers/routineTransformer.js';

export default function ImportModal({ open, onClose, onImport }) {
    const [file, setFile] = useState(null);
    const [jsonData, setJsonData] = useState(null);
    const [validation, setValidation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleReset = () => {
        setFile(null);
        setJsonData(null);
        setValidation(null);
    };

    const handleFileSelect = useCallback(async (selectedFile) => {
        if (!selectedFile) return;

        setLoading(true);
        handleReset();

        try {
            const text = await selectedFile.text();
            const data = JSON.parse(text);

            // Validate and transform
            const result = importToEditor(data);

            setFile(selectedFile);
            setJsonData(data);
            setValidation(result);
        } catch (error) {
            setValidation({
                success: false,
                errors: [`Error al leer el archivo: ${error.message}`]
            });
        } finally {
            setLoading(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile && droppedFile.type === 'application/json') {
            handleFileSelect(droppedFile);
        }
    }, [handleFileSelect]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    }, []);

    const handleFileInputChange = useCallback((e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            handleFileSelect(selectedFile);
        }
    }, [handleFileSelect]);

    const handleImport = () => {
        if (!validation?.success || !validation?.data) return;

        onImport(validation.data);
        handleReset();
        onClose();
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            title="Importar Rutina desde JSON"
            size="lg"
        >
            <div className="space-y-6">
                {/* Dropzone */}
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`relative rounded-xl border-2 border-dashed transition-all ${dragActive
                            ? 'border-accent bg-accent/5'
                            : 'border-border hover:border-accent/50'
                        }`}
                >
                    <input
                        type="file"
                        accept="application/json,.json"
                        onChange={handleFileInputChange}
                        className="absolute inset-0 z-10 cursor-pointer opacity-0"
                        disabled={loading}
                    />
                    <div className="flex flex-col items-center justify-center gap-4 py-12 px-6">
                        <div className={`rounded-full p-4 ${dragActive ? 'bg-accent/10' : 'bg-primary-bg'}`}>
                            {loading ? (
                                <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent" />
                            ) : (
                                <Upload className={`h-12 w-12 ${dragActive ? 'text-accent' : 'text-text-muted'}`} />
                            )}
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-medium text-text-primary">
                                {loading ? 'Procesando archivo...' : 'Arrastra aquí tu archivo JSON'}
                            </p>
                            <p className="mt-1 text-sm text-text-muted">
                                o haz click para seleccionar un archivo
                            </p>
                        </div>
                    </div>
                </div>

                {/* File Info */}
                {file && (
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-primary-bg p-4">
                        <FileJson className="h-8 w-8 text-accent flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-text-primary truncate">{file.name}</p>
                            <p className="text-sm text-text-muted">
                                {(file.size / 1024).toFixed(2)} KB
                            </p>
                        </div>
                    </div>
                )}

                {/* Validation Results */}
                {validation && (
                    <div className={`rounded-lg border p-4 ${validation.success
                            ? 'border-success/20 bg-success/5'
                            : 'border-error/20 bg-error/5'
                        }`}>
                        <div className="flex items-start gap-3">
                            {validation.success ? (
                                <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                            ) : (
                                <AlertCircle className="h-5 w-5 text-error flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                                <h4 className={`font-semibold ${validation.success ? 'text-success' : 'text-error'
                                    }`}>
                                    {validation.success ? 'Archivo válido' : 'Errores de validación'}
                                </h4>
                                {validation.success ? (
                                    <p className="mt-1 text-sm text-text-secondary">
                                        La rutina se importará correctamente al editor.
                                    </p>
                                ) : (
                                    <ul className="mt-2 space-y-1">
                                        {validation.errors?.map((error, idx) => (
                                            <li key={idx} className="text-sm text-error font-mono">
                                                • {error}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Warning for existing data */}
                {validation?.success && (
                    <div className="rounded-lg border border-warning/20 bg-warning/5 p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h4 className="font-semibold text-warning">Advertencia</h4>
                                <p className="mt-1 text-sm text-text-secondary">
                                    Importar esta rutina reemplazará todos los datos actuales del editor.
                                    Asegúrate de haber guardado los cambios antes de continuar.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <ModalFooter>
                <Button variant="ghost" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleImport}
                    disabled={!validation?.success || loading}
                >
                    Importar Rutina
                </Button>
            </ModalFooter>
        </Modal>
    );
}
