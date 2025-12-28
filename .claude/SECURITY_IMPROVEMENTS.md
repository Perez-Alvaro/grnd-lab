# 🛡️ MEJORAS DE SEGURIDAD RECOMENDADAS - IMPLEMENTACIÓN

Este documento detalla las mejoras de seguridad recomendadas que pueden implementarse de forma progresiva para fortalecer aún más la aplicación GRIND LAB.

---

## 📦 1. Instalación de DOMPurify (RECOMENDADO)

### Instalación

```bash
npm install dompurify
npm install --save-dev @types/dompurify
```

### Implementación

**Crear:** `src/lib/utils/sanitizer.js`

```javascript
import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} dirty - Potentially unsafe HTML
 * @param {Object} options - DOMPurify configuration
 * @returns {string} Clean HTML
 */
export function sanitizeHTML(dirty, options = {}) {
  const defaultConfig = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
    ...options
  };
  
  return DOMPurify.sanitize(dirty, defaultConfig);
}

/**
 * Sanitize for plain text (removes all HTML)
 * @param {string} dirty - Potentially unsafe text
 * @returns {string} Plain text
 */
export function sanitizeText(dirty) {
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] });
}

/**
 * Sanitize URL to prevent javascript: and data: URIs
 * @param {string} url - URL to validate
 * @returns {string|null} Clean URL or null if invalid
 */
export function sanitizeURL(url) {
  if (!url || typeof url !== 'string') return null;
  
  try {
    const parsed = new URL(url);
    
    // Only allow http, https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      console.warn('Blocked non-HTTP URL:', url);
      return null;
    }
    
    return DOMPurify.sanitize(url, { ALLOWED_TAGS: [] });
  } catch (e) {
    console.warn('Invalid URL:', url);
    return null;
  }
}

export default {
  sanitizeHTML,
  sanitizeText,
  sanitizeURL
};
```

### Uso en Componentes

**Actualizar:** `src/lib/transformers/routineTransformer.js`

```javascript
import { sanitizeText, sanitizeURL } from '../utils/sanitizer';

export function sanitizeRoutineData(data) {
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return sanitizeText(str).substring(0, 5000);
  };
  
  const sanitizeUrlField = (url) => {
    if (!url) return '';
    return sanitizeURL(url) || '';
  };

  const sanitizeObject = (obj, path = []) => {
    if (Array.isArray(obj)) {
      return obj.map((item, i) => sanitizeObject(item, [...path, i]));
    }
    
    if (typeof obj === 'object' && obj !== null) {
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        // Sanitizar URLs específicamente
        if (key.toLowerCase().includes('url') || key.toLowerCase().includes('video')) {
          sanitized[key] = sanitizeUrlField(value);
        } else if (typeof value === 'string') {
          sanitized[key] = sanitizeString(value);
        } else if (typeof value === 'object') {
          sanitized[key] = sanitizeObject(value, [...path, key]);
        } else {
          sanitized[key] = value;
        }
      }
      return sanitized;
    }
    
    return obj;
  };

  return sanitizeObject(data);
}
```

---

## 🔒 2. Content Security Policy (CSP)

### Implementación en Vite

**Crear:** `vite-plugin-csp.js` (en la raíz del proyecto)

```javascript
export function cspPlugin() {
  return {
    name: 'csp-headers',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        res.setHeader('Content-Security-Policy', [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval necesario para Vite dev
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https:",
          "font-src 'self' data:",
          "connect-src 'self' https://*.supabase.co",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'"
        ].join('; '));
        
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        
        next();
      });
    }
  };
}
```

**Actualizar:** `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cspPlugin } from './vite-plugin-csp';

export default defineConfig({
  plugins: [
    react(),
    cspPlugin()
  ],
  // ... resto de la configuración
});
```

### Para Producción (Nginx/Apache)

**Nginx:**
```nginx
# /etc/nginx/sites-available/grind-lab

add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co; frame-ancestors 'none'; base-uri 'self'; form-action 'self';" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

---

## 📝 3. PropTypes para Validación de Props

### Instalación

```bash
npm install prop-types
```

### Implementación

**Actualizar:** `src/components/Trainer/editor/ExerciseEditor.jsx`

```javascript
import PropTypes from 'prop-types';

const ExerciseEditor = memo(({ weekId, dayId, exercise, onActionError }) => {
  // ... código existente
});

ExerciseEditor.propTypes = {
  weekId: PropTypes.string.isRequired,
  dayId: PropTypes.string.isRequired,
  exercise: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    sets: PropTypes.string,
    reps: PropTypes.string,
    rest: PropTypes.string,
    rir: PropTypes.string,
    tempo: PropTypes.string,
    video: PropTypes.string,
    note: PropTypes.string,
  }).isRequired,
  onActionError: PropTypes.func
};

ExerciseEditor.displayName = 'ExerciseEditor';

export default ExerciseEditor;
```

**Actualizar:** `src/components/ui/Modal.jsx`

```javascript
import PropTypes from 'prop-types';

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string
};

Modal.defaultProps = {
  size: 'md',
  title: '',
  className: ''
};
```

---

## ⏱️ 4. Rate Limiting y Debouncing

### Instalación

```bash
npm install lodash-es
```

### Implementación

**Crear:** `src/hooks/useDebounce.js`

```javascript
import { useEffect, useState } from 'react';

/**
 * Debounce a value
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in ms
 * @returns {any} Debounced value
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

**Crear:** `src/hooks/useThrottle.js`

```javascript
import { useCallback, useRef } from 'react';

/**
 * Throttle a function
 * @param {Function} callback - Function to throttle
 * @param {number} delay - Delay in ms
 * @returns {Function} Throttled function
 */
export function useThrottle(callback, delay = 1000) {
  const lastRun = useRef(Date.now());

  return useCallback((...args) => {
    const now = Date.now();
    
    if (now - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = now;
    }
  }, [callback, delay]);
}
```

### Uso en Componentes

**Actualizar:** `src/components/Editor/JSONEditor.jsx`

```javascript
import { useDebounce } from '../../hooks/useDebounce';

export default function JSONEditor({ value, onChange, className = '' }) {
  const [jsonText, setJsonText] = useState('');
  const debouncedJsonText = useDebounce(jsonText, 500); // ⏱️ Debounce de 500ms
  
  // Validar solo después del debounce
  useEffect(() => {
    if (debouncedJsonText) {
      try {
        const parsed = JSON.parse(debouncedJsonText);
        setIsValid(true);
        setError('');
        if (onChange) onChange(parsed);
      } catch (e) {
        setIsValid(false);
        setError(e.message);
      }
    }
  }, [debouncedJsonText, onChange]);
  
  // ... resto del código
}
```

**Actualizar:** `src/hooks/useRoutinesAPI.js`

```javascript
import { useThrottle } from './useThrottle';

export function useRoutinesAPI() {
  const saveRoutine = useCallback(async (data) => {
    // ... lógica de guardado
  }, []);
  
  // ⏱️ Throttle: máximo 1 guardado por segundo
  const throttledSave = useThrottle(saveRoutine, 1000);
  
  return {
    saveRoutine: throttledSave,
    // ... otros métodos
  };
}
```

---

## 🔐 5. Validación Mejorada de URLs

**Actualizar:** `src/components/Trainer/editor/ExerciseEditor.jsx`

```javascript
import { sanitizeURL } from '../../../lib/utils/sanitizer';

const validateField = useCallback((field, value) => {
  const trimmedValue = value.trim();
  
  switch (field) {
    // ... otros casos
    
    case 'video':
      if (!trimmedValue) return null; // Campo opcional
      
      // ✅ Validación mejorada con sanitización
      const cleanUrl = sanitizeURL(trimmedValue);
      
      if (!cleanUrl) {
        return 'URL inválida o protocolo no permitido (solo HTTP/HTTPS)';
      }
      
      // Validar que sea YouTube, Vimeo, o dominio permitido
      try {
        const url = new URL(cleanUrl);
        const allowedDomains = [
          'youtube.com',
          'youtu.be',
          'vimeo.com',
          'drive.google.com',
          'dropbox.com'
        ];
        
        const isAllowed = allowedDomains.some(domain => 
          url.hostname.includes(domain)
        );
        
        if (!isAllowed) {
          return 'Solo se permiten URLs de YouTube, Vimeo, Google Drive o Dropbox';
        }
      } catch {
        return 'URL inválida';
      }
      
      return null;
      
    default:
      return null;
  }
}, []);
```

---

## 📊 6. Logging y Monitoreo de Seguridad

**Crear:** `src/lib/utils/securityLogger.js`

```javascript
/**
 * Log security events for monitoring
 */
class SecurityLogger {
  constructor() {
    this.events = [];
    this.maxEvents = 100;
  }
  
  log(event, severity = 'info', details = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      severity,
      details,
      userAgent: navigator.userAgent
    };
    
    this.events.push(logEntry);
    
    // Mantener solo los últimos 100 eventos
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }
    
    // En desarrollo, mostrar en consola
    if (import.meta.env.DEV) {
      const color = {
        info: 'color: blue',
        warning: 'color: orange',
        error: 'color: red',
        critical: 'color: red; font-weight: bold'
      }[severity] || 'color: gray';
      
      console.log(`%c[SECURITY ${severity.toUpperCase()}]`, color, event, details);
    }
    
    // En producción, enviar a servicio de monitoreo (opcional)
    if (import.meta.env.PROD && severity === 'critical') {
      this.sendToMonitoring(logEntry);
    }
  }
  
  async sendToMonitoring(logEntry) {
    try {
      // Implementar integración con servicio de monitoreo (Sentry, etc.)
      // await fetch('/api/security-log', {
      //   method: 'POST',
      //   body: JSON.stringify(logEntry)
      // });
    } catch (error) {
      console.error('Failed to send security log:', error);
    }
  }
  
  getEvents(severity = null) {
    if (!severity) return this.events;
    return this.events.filter(e => e.severity === severity);
  }
  
  clear() {
    this.events = [];
  }
}

export const securityLogger = new SecurityLogger();

export default securityLogger;
```

### Uso

```javascript
import { securityLogger } from './lib/utils/securityLogger';

// En ImportModal.jsx al detectar JSON malicioso
try {
  const data = JSON.parse(text);
  const result = importToEditor(data);
} catch (error) {
  securityLogger.log('JSON_PARSE_FAILED', 'warning', {
    error: error.message,
    fileSize: file.size
  });
}

// En UnifiedAuthContext.jsx al detectar intento de login sospechoso
if (failedAttempts > 5) {
  securityLogger.log('MULTIPLE_FAILED_LOGINS', 'critical', {
    email: email,
    attempts: failedAttempts
  });
}
```

---

## 🧪 7. Tests de Seguridad Automatizados

**Crear:** `src/lib/utils/__tests__/sanitizer.test.js`

```javascript
import { describe, it, expect } from 'vitest';
import { sanitizeHTML, sanitizeText, sanitizeURL } from '../sanitizer';

describe('sanitizeHTML', () => {
  it('should remove script tags', () => {
    const dirty = '<p>Hello</p><script>alert("XSS")</script>';
    const clean = sanitizeHTML(dirty);
    expect(clean).not.toContain('<script>');
    expect(clean).toContain('<p>Hello</p>');
  });
  
  it('should allow safe tags', () => {
    const dirty = '<p>Hello <strong>World</strong></p>';
    const clean = sanitizeHTML(dirty);
    expect(clean).toBe('<p>Hello <strong>World</strong></p>');
  });
  
  it('should remove dangerous attributes', () => {
    const dirty = '<a href="javascript:alert(1)">Click</a>';
    const clean = sanitizeHTML(dirty);
    expect(clean).not.toContain('javascript:');
  });
});

describe('sanitizeURL', () => {
  it('should allow HTTPS URLs', () => {
    const url = 'https://example.com/video';
    expect(sanitizeURL(url)).toBe(url);
  });
  
  it('should block javascript: URLs', () => {
    const url = 'javascript:alert(1)';
    expect(sanitizeURL(url)).toBeNull();
  });
  
  it('should block data: URIs', () => {
    const url = 'data:text/html,<script>alert(1)</script>';
    expect(sanitizeURL(url)).toBeNull();
  });
  
  it('should return null for invalid URLs', () => {
    expect(sanitizeURL('not a url')).toBeNull();
  });
});
```

**Ejecutar tests:**
```bash
npm test -- sanitizer.test.js
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Essentials (1-2 días)
- [ ] Instalar DOMPurify
- [ ] Implementar sanitizer.js
- [ ] Actualizar validación de URLs en ExerciseEditor
- [ ] Agregar CSP headers en desarrollo

### Fase 2: Validación (2-3 días)
- [ ] Agregar PropTypes a componentes principales
- [ ] Implementar useDebounce y useThrottle
- [ ] Aplicar debouncing a JSONEditor
- [ ] Aplicar throttling a llamadas de API

### Fase 3: Monitoreo (1-2 días)
- [ ] Implementar SecurityLogger
- [ ] Agregar logs en puntos críticos
- [ ] Configurar alertas (opcional)

### Fase 4: Testing (2-3 días)
- [ ] Crear tests de sanitización
- [ ] Crear tests de validación
- [ ] Ejecutar npm audit
- [ ] Ejecutar tests de seguridad

### Fase 5: Producción (1 día)
- [ ] Configurar CSP en servidor web
- [ ] Configurar headers de seguridad
- [ ] Documentar configuración
- [ ] Deployment final

---

## 🚀 SCRIPTS DE UTILIDAD

**Agregar a `package.json`:**

```json
{
  "scripts": {
    "security:audit": "npm audit --production",
    "security:fix": "npm audit fix",
    "security:check": "npm outdated",
    "test:security": "vitest run src/lib/utils/__tests__/sanitizer.test.js",
    "prebuild": "npm run security:audit"
  }
}
```

---

## 📚 RECURSOS ADICIONALES

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security Best Practices](https://react.dev/learn/security)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [Content Security Policy Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/security)

---

**Última actualización:** 2025-12-28  
**Mantenido por:** Antigravity Security Team
