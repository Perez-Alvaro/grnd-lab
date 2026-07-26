/**
 * src/components/Admin/TransferSettings.jsx
 * Datos de transferencia editables desde el panel de admin.
 *
 * Antes estaban hardcodeados en el bundle: cambiar de cuenta obligaba a tocar
 * código y desplegar. Ahora viven en app_settings (migración 0007) y el coach
 * los ve al informar su pago.
 */
import { useEffect, useState } from 'react';
import { IconDeviceFloppy, IconAlertTriangle, IconCircleCheck } from '@tabler/icons-react';
import { Button, Input, Textarea } from '../ui';
import { getTransferInfo, saveTransferInfo, TRANSFER_FIELDS, DEFAULT_TRANSFER_INFO } from '../../lib/settings.js';
import { toast } from '../../utils/toast.js';

export default function TransferSettings() {
  const [form, setForm] = useState(DEFAULT_TRANSFER_INFO);
  const [inicial, setInicial] = useState(DEFAULT_TRANSFER_INFO);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    let vivo = true;
    getTransferInfo().then((info) => {
      if (!vivo) return;
      setForm(info);
      setInicial(info);
      setCargando(false);
    });
    return () => { vivo = false; };
  }, []);

  const setCampo = (name) => (e) => {
    setForm((f) => ({ ...f, [name]: e.target.value }));
    setErrores((prev) => (prev[name] ? { ...prev, [name]: null } : prev));
  };

  const sucio = JSON.stringify(form) !== JSON.stringify(inicial);

  const validar = () => {
    const errs = {};
    for (const campo of TRANSFER_FIELDS) {
      if (campo.required && !String(form[campo.name] || '').trim()) {
        errs[campo.name] = 'Este dato lo necesita el coach para transferirte.';
      }
    }
    // El CBU/CVU argentino tiene 22 dígitos; es opcional, pero si está debe ser válido
    const cbu = String(form.cbu || '').replace(/\s/g, '');
    if (cbu && !/^\d{22}$/.test(cbu)) {
      errs.cbu = `Un CBU/CVU tiene 22 dígitos (ingresaste ${cbu.length}).`;
    }
    setErrores(errs);
    return Object.keys(errs).length === 0;
  };

  const guardar = async () => {
    if (!validar()) return;
    setGuardando(true);
    try {
      const limpio = { ...form, cbu: String(form.cbu || '').replace(/\s/g, '') };
      const guardado = await saveTransferInfo(limpio);
      setForm(guardado);
      setInicial(guardado);
      toast.success('Datos de transferencia actualizados');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return <div className="rounded-md border border-border bg-primary-surface p-6 text-sm text-text-muted">Cargando…</div>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border bg-primary-surface p-4 sm:p-6">
        <h2 className="text-base font-bold text-text-primary font-display">Datos de transferencia</h2>
        <p className="mt-1 text-sm text-text-tertiary">
          Es lo que ve el coach cuando informa su pago. Los cambios se aplican al instante.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {TRANSFER_FIELDS.map((campo) => {
            const comun = {
              label: campo.required ? `${campo.label} *` : campo.label,
              value: form[campo.name] || '',
              onChange: setCampo(campo.name),
              placeholder: campo.placeholder,
              error: errores[campo.name],
            };
            return campo.textarea ? (
              <div key={campo.name} className="sm:col-span-2">
                <Textarea {...comun} rows={2} />
              </div>
            ) : (
              <Input key={campo.name} {...comun} inputMode={campo.inputMode} />
            );
          })}
        </div>

        <div className="mt-5 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="flex items-center gap-2 text-xs text-text-muted">
            {sucio ? (
              <>
                <IconAlertTriangle stroke={1.75} className="h-4 w-4 text-warning flex-shrink-0" />
                Tenés cambios sin guardar.
              </>
            ) : (
              <>
                <IconCircleCheck stroke={1.75} className="h-4 w-4 text-accent flex-shrink-0" />
                Todo guardado.
              </>
            )}
          </p>
          <Button onClick={guardar} loading={guardando} disabled={!sucio} className="w-full sm:w-auto">
            <IconDeviceFloppy stroke={1.75} className="h-4 w-4" /> Guardar cambios
          </Button>
        </div>
      </div>

      {/* Vista previa: exactamente lo que va a ver el coach */}
      <div className="rounded-md border border-border bg-primary-surface p-4 sm:p-6">
        <h3 className="text-sm font-semibold text-text-primary">Así lo ve el coach</h3>
        <div className="mt-3 space-y-2 rounded-md border border-border bg-primary-bg p-4">
          {[
            ['Titular', form.titular],
            ['Alias', form.alias],
            ['CBU', form.cbu],
            ['Banco', form.banco],
          ]
            .filter(([, v]) => String(v || '').trim())
            .map(([label, valor]) => (
              <div key={label} className="flex items-baseline justify-between gap-3">
                <span className="text-xs uppercase tracking-wide text-text-tertiary">{label}</span>
                <span className="font-mono text-sm text-text-primary text-right break-all">{valor}</span>
              </div>
            ))}
          {String(form.nota || '').trim() && (
            <p className="pt-1 text-xs text-text-muted">{form.nota}</p>
          )}
        </div>
      </div>
    </div>
  );
}
