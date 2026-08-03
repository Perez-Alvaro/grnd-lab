/**
 * src/components/Dashboard/FeedbackSection.jsx
 * Buzón de reclamos y bugs del panel del entrenador: SOLO PARA ENVIAR.
 *
 * El coach manda el reporte y no ve ningún listado. Los reclamos y bugs los
 * lee únicamente el admin desde su dashboard.
 */
import { useState, useEffect } from 'react';
import { IconMessageReport, IconPlus } from '@tabler/icons-react';
import { submitFeedback, FEEDBACK_TYPES } from '../../lib/feedback.js';
import { Button, Input, Select, Textarea, Modal, ModalFooter } from '../ui';
import { toast } from '../../utils/toast.js';

export default function FeedbackSection() {
  const [modalOpen, setModalOpen] = useState(false);

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

      <FeedbackModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmitted={() => setModalOpen(false)}
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
