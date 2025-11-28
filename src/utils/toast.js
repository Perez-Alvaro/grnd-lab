// Este archivo se mantiene por compatibilidad con imports existentes
// pero ahora usa el ToastContext moderno

let toastInstance = null;

export function setToastInstance(instance) {
  toastInstance = instance;
}

export const toast = {
  success(message) {
    if (toastInstance) {
      toastInstance.success(message);
    } else {
      console.warn('Toast no inicializado. Usando fallback.');
      window.alert(message);
    }
  },
  error(message) {
    if (toastInstance) {
      toastInstance.error(message);
    } else {
      console.warn('Toast no inicializado. Usando fallback.');
      window.alert(message);
    }
  },
  warning(message) {
    if (toastInstance) {
      toastInstance.warning(message);
    } else {
      console.warn('Toast no inicializado. Usando fallback.');
      window.alert(message);
    }
  },
  info(message) {
    if (toastInstance) {
      toastInstance.info(message);
    } else {
      console.warn('Toast no inicializado. Usando fallback.');
      window.alert(message);
    }
  },
};
