/**
 * src/components/Dashboard/BrandSettingsModal.jsx
 * Modal para que el entrenador configure su Marca y Logo predeterminado (White-Label).
 */

import React, { useState, useEffect, useRef } from 'react';
import { IconUpload, IconTrash, IconSparkles, IconPhoto, IconCheck } from '@tabler/icons-react';
import { Modal, ModalFooter, Button, Input } from '../ui';
import { getCoachBranding, saveCoachBranding, processLogoFile } from '../../lib/branding.js';
import { toast } from '../../utils/toast.js';

export default function BrandSettingsModal({ open, onClose }) {
  const [brandName, setBrandName] = useState('');
  const [brandLogo, setBrandLogo] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      const current = getCoachBranding();
      setBrandName(current.brandName || '');
      setBrandLogo(current.brandLogo || '');
    }
  }, [open]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const dataUrl = await processLogoFile(file);
      setBrandLogo(dataUrl);
      toast.success('Logo cargado y optimizado correctamente');
    } catch (err) {
      toast.error(err.message || 'Error al procesar el archivo');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveLogo = () => {
    setBrandLogo('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = () => {
    saveCoachBranding({ brandName, brandLogo });
    toast.success('Marca y logo guardados como predeterminados');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Personalizar Mi Marca y Logo (White-Label)"
      size="md"
      zIndex="z-[150]"
    >
      <div className="space-y-5 py-2">
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 text-xs text-text-secondary leading-relaxed flex items-start gap-3">
          <IconSparkles stroke={1.75} className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
          <p>
            Tu <strong>nombre de marca</strong> y tu <strong>logo</strong> aparecerán de forma destacada en la portada y encabezados de los PDFs de entrenamiento y nutrición que compartas con tus atletas.
          </p>
        </div>

        <div>
          <Input
            label="Nombre de tu Marca o Coach"
            placeholder="Ej: Power & Iron Coaching / Coach Lucas"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
          />
          <p className="mt-1 text-xs text-text-tertiary">
            Este nombre se mostrará en las carátulas, cabeceras de cada semana y pie de página de los planes.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Logo de tu Marca
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={handleFileChange}
            className="hidden"
          />

          {brandLogo ? (
            <div className="rounded-xl border border-border bg-primary-bg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex h-16 w-32 items-center justify-center rounded-lg border border-border/80 bg-white p-2 overflow-hidden shadow-inner">
                  <img
                    src={brandLogo}
                    alt="Logo preview"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-success">
                    <IconCheck stroke={2} className="h-4 w-4" /> Logo activo
                  </div>
                  <p className="text-xs text-text-tertiary mt-0.5 truncate">
                    Optimizado para impresión en PDF
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                >
                  Cambiar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveLogo}
                  disabled={isProcessing}
                  className="text-red-400 hover:text-red-300"
                >
                  <IconTrash stroke={1.75} className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group cursor-pointer rounded-xl border-2 border-dashed border-border hover:border-accent bg-primary-bg/50 p-6 text-center transition-all hover:bg-accent/5"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-surface-alt text-text-quaternary group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                <IconPhoto stroke={1.75} className="h-6 w-6" />
              </div>
              <p className="mt-3 text-sm font-medium text-text-primary group-hover:text-accent transition-colors">
                Hacé clic para subir tu logo
              </p>
              <p className="mt-1 text-xs text-text-tertiary">
                PNG, JPG, WebP o SVG (máx. 5 MB). Recomendado fondo transparente.
              </p>
              <div className="mt-4">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  loading={isProcessing}
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <IconUpload stroke={1.75} className="h-4 w-4" /> Seleccionar imagen
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ModalFooter>
        <Button variant="ghost" onClick={onClose} disabled={isProcessing}>
          Cancelar
        </Button>
        <Button variant="accent" onClick={handleSave} disabled={isProcessing}>
          Guardar Marca
        </Button>
      </ModalFooter>
    </Modal>
  );
}
