/**
 * src/components/Legal/TermsModal.jsx
 * Visor de los Términos y Condiciones (solo lectura), reutilizable desde
 * el registro y desde cualquier link "ver términos".
 */
import { Modal, ModalFooter, Button } from '../ui';
import TermsContent from './TermsContent.jsx';

export default function TermsModal({ open, onClose, zIndex = "z-[200]" }) {
  return (
    <Modal open={open} onClose={onClose} title="Términos y condiciones" size="lg" zIndex={zIndex}>
      <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
        <TermsContent showTitle={false} />
      </div>
      <ModalFooter>
        <Button onClick={onClose}>Cerrar</Button>
      </ModalFooter>
    </Modal>
  );
}
