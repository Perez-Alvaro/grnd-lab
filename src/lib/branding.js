/**
 * src/lib/branding.js
 * Gestión de marca blanca (White-Label Branding) para entrenadores.
 * Permite configurar el nombre comercial y el logo del coach para los PDFs.
 */

export const BRAND_NAME_KEY = 'mock:coach-brand-name';
export const BRAND_LOGO_KEY = 'mock:coach-brand-logo';

/**
 * Limpia y normaliza el nombre de marca
 * @param {any} val
 * @returns {string|null}
 */
export function cleanBrand(val) {
  return typeof val === 'string' && val.trim().length > 0 ? val.trim() : null;
}

/**
 * Obtiene la configuración de marca global del coach desde localStorage
 * @returns {{ brandName: string, brandLogo: string }}
 */
export function getCoachBranding() {
  if (typeof window === 'undefined' || !window?.localStorage) {
    return { brandName: '', brandLogo: '' };
  }
  try {
    return {
      brandName: window.localStorage.getItem(BRAND_NAME_KEY) || '',
      brandLogo: window.localStorage.getItem(BRAND_LOGO_KEY) || '',
    };
  } catch (err) {
    void err;
    return { brandName: '', brandLogo: '' };
  }
}

/**
 * Guarda la configuración de marca global del coach en localStorage
 * @param {{ brandName?: string|null, brandLogo?: string|null }} params
 */
export function saveCoachBranding({ brandName, brandLogo }) {
  if (typeof window === 'undefined' || !window?.localStorage) return;
  try {
    if (brandName !== undefined) {
      const cleaned = cleanBrand(brandName);
      if (cleaned) {
        window.localStorage.setItem(BRAND_NAME_KEY, cleaned);
      } else {
        window.localStorage.removeItem(BRAND_NAME_KEY);
      }
    }

    if (brandLogo !== undefined) {
      if (brandLogo && typeof brandLogo === 'string' && brandLogo.trim()) {
        window.localStorage.setItem(BRAND_LOGO_KEY, brandLogo.trim());
      } else {
        window.localStorage.removeItem(BRAND_LOGO_KEY);
      }
    }
  } catch (err) {
    console.warn('No se pudo guardar el branding en localStorage', err);
  }
}

/**
 * Procesa un archivo de imagen en el navegador redimensionándolo mediante un canvas
 * para obtener un data URL PNG liviano y estandarizado para los motores de PDF.
 * @param {File} file - Archivo de imagen seleccionado
 * @param {number} maxWidth - Ancho máximo (default 360px)
 * @param {number} maxHeight - Alto máximo (default 120px)
 * @returns {Promise<string>} Base64 Data URL
 */
export function processLogoFile(file, maxWidth = 360, maxHeight = 120) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No se seleccionó ningún archivo.'));
      return;
    }

    if (!file.type.startsWith('image/')) {
      reject(new Error('El archivo seleccionado debe ser una imagen (PNG, JPG, WebP o SVG).'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      reject(new Error('El logo no debe superar los 5 MB de tamaño.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Error al leer el archivo de imagen.'));
    reader.onload = (e) => {
      const src = e.target?.result;
      if (typeof src !== 'string') {
        reject(new Error('Formato de imagen inválido.'));
        return;
      }

      // Si es SVG o no hay soporte de canvas, se devuelve directo el dataURL
      if (typeof document === 'undefined') {
        resolve(src);
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error('No se pudo decodificar la imagen.'));
      img.onload = () => {
        try {
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(src);
            return;
          }

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const optimizedDataUrl = canvas.toDataURL('image/png');
          resolve(optimizedDataUrl);
        } catch {
          // Fallback a src original si el canvas falla (e.g. cross-origin o SVG estricto)
          resolve(src);
        }
      };
      img.src = src;
    };

    reader.readAsDataURL(file);
  });
}
