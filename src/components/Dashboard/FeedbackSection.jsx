/**
 * src/components/Dashboard/FeedbackSection.jsx
 * Buzón de reclamos y bugs del panel del entrenador.
 * El coach reporta un problema y ve el estado de sus reportes;
 * el admin los gestiona desde su dashboard.
 */
import { useCallback, useEffect, useState } from 'react';
import { IconMessageReport, IconPlus, IconCornerDownRight } from '@tabler/icons-react';
import { submitFeedback, listMyFeedback, FEEDBACK_TYPES, FEEDBACK_STATUS_LABEL } from '../../lib/feedback.js';
import { Button, Input, Select, Textarea, Modal, ModalFooter, Badge } from '../ui';
import { toast } from '../../utils/toast.js';

const STATUS_VARIANT = { open: 'warning', in_progress: 'accent', resolved: 'success' };
const TYPE_LABEL = Object.fromEntries(FEEDBACK_TYPES.map((t) => [t.value, t.label]));

export default function FeedbackSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await listMyFeedback());
    } catch (e) {
      console.error('No se pudo cargar el buzón:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <section className="mt-8 rounded-xl border border-border bg-primary-surface p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-1">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <IconMessageReport stroke={1.75} className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-primary font-display">Reclamos y bugs</h2>
            <p className="text-sm text-text-muted">¿Algo no funciona? Contanos y lo revisamos.</p>
          </div>
        </div>
        <Button size="sm" onClick={() => setModalOpen(true)}>
          <IconPlus stroke={1.75} className="h-4 w-4" /> Reportar problema
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-text-muted mt-4">Cargando…</p>
      ) : items.length > 0 ? (
        <div className="mt-4 space-y-2">
          {items.slice(0, 5).map((f) => (
            <div key={f.id} className="rounded-lg border border-border bg-primary-bg px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Badge variant="secondary" size="sm">{TYPE_LABEL[f.type] || f.type}</Badge>
                  <p className="text-sm text-text-primary truncate">{f.subject}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted">{new Date(f.created_at).toLocaleDateString('es-AR')}</span>
                  <Badge variant={STATUS_VARIANT[f.status] || 'default'} size="sm">
                    {FEEDBACK_STATUS_LABEL[f.status] || f.status}
                  </Badge>
                </div>
              </div>
              {f.admin_reply && (
                <p className="mt-2 flex items-start gap-1.5 text-xs text-text-secondary">
                  <IconCornerDownRight stroke={1.75} className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-accent" />
                  <span><span className="text-accent font-medium">Respuesta:</span> {f.admin_reply}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-text-muted mt-4">Todavía no enviaste ningún reporte.</p>
      )}

      <FeedbackModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmitted={() => { setModalOpen(false); load(); }}
      />
    </section>
  );
}

function FeedbackModal({ open, onClose, onSubmitted }) {
  const [form, setForm] = useState({ type: 'bug', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (open) setForm({ type: 'bug', subject: '', message: '' });
  }, [open]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.subject.trim()) { toast.error('Contanos brevemente qué pasó (asunto)'); return; }
    if (!form.message.trim()) { toast.error('El detalle es requerido'); return; }
    setSending(true);
    try {
      await submitFeedback({
        type: form.type,
        subject: form.subject.trim(),
        message: form.message.trim(),
      });
      toast.success('Reporte enviado. Gracias por avisarnos.');
      onSubmitted();
    } catch (e) {
      console.error(e);
      toast.error('No se pudo enviar el reporte');
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Reportar problema" size="sm">
      <div className="space-y-4">
        <Select label="Tipo" value={form.type} onChange={set('type')}>
          {FEEDBACK_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </Select>
        <Input
          label="Asunto *"
          value={form.subject}
          onChange={set('subject')}
          placeholder="Ej: el PDF no se descarga"
        />
        <Textarea
          label="Detalle *"
          value={form.message}
          onChange={set('message')}
          placeholder="Contanos qué estabas haciendo, qué esperabas y qué pasó."
          rows={4}
        />
      </div>
      <ModalFooter>
        <Button variant="ghost" onClick={onClose} disabled={sending}>Cancelar</Button>
        <Button variant="accent" onClick={handleSubmit} loading={sending}>Enviar reporte</Button>
      </ModalFooter>
    </Modal>
  );
}
