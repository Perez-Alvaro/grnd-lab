/**
 * src/components/Legal/PrivacyModal.jsx
 * Modal dialog for the Privacy Policy, conforming to Ley 25.326.
 * Reusable from site footer, registration, or settings.
 */

import { Modal, ModalFooter, Button } from '../ui';
import PrivacyContent from './PrivacyContent.jsx';

export default function PrivacyModal({ open, onClose, zIndex = "z-[200]" }) {
  return (
    <Modal open={open} onClose={onClose} title="Política de Privacidad" size="lg" zIndex={zIndex}>
      <div className="max-h-[65vh] overflow-y-auto pr-2">
        <PrivacyContent showTitle={false} />
      </div>
      <ModalFooter>
        <Button onClick={onClose}>Cerrar</Button>
      </ModalFooter>
    </Modal>
  );
}
