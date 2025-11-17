# 📋 Especificación de Requerimientos del Sistema

## Información del Proyecto

| Campo | Valor |
|-------|-------|
| **Proyecto** | Fitter - Plataforma de Rutinas de Entrenamiento |
| **Versión** | 1.0 |
| **Fecha** | 2025-11-13 |
| **Estado** | En Desarrollo |
| **Cliente** | Matías Zaccaro |

---

## 🎯 Resumen Ejecutivo

**Fitter** es una plataforma digital que conecta entrenadores profesionales con clientes que buscan planes de entrenamiento personalizados. El sistema permite a los entrenadores crear, gestionar y vender rutinas mientras ofrece a los clientes una experiencia de compra fluida con entrega inmediata de planes en PDF profesionales.

---

## 👥 Actores del Sistema

| Actor | Descripción | Rol |
|-------|-------------|-----|
| **Cliente/Usuario Final** | Persona que busca comprar planes de entrenamiento | Consumidor |
| **Entrenador/Admin** | Profesional que crea y gestiona rutinas | Proveedor |
| **Sistema de Pagos (Mercado Pago)** | Procesador de pagos externo | Integración |
| **Sistema de Email (Resend)** | Servicio de envío de emails | Integración |
| **Administrador de Sistema** | Gestiona configuración y monitoreo | Soporte |

---

## 📊 Requerimientos Funcionales

### RF-001: Gestión de Usuarios

#### RF-001.1: Registro de Clientes
- **Prioridad:** Alta
- **Descripción:** Los clientes pueden registrarse proporcionando datos básicos
- **Datos requeridos:**
  - Nombre completo
  - Email válido
  - Género (Masculino/Femenino/Otro)
  - Objetivo de entrenamiento
- **Criterios:**
  - Email debe ser único
  - Validación de formato de email
  - Confirmación por email (fase 2)

#### RF-001.2: Portal de Cliente
- **Prioridad:** Alta
- **Descripción:** Los clientes pueden acceder a sus compras
- **Funcionalidades:**
  - Ver historial de compras
  - Descargar rutinas adquiridas
  - Reenviar rutinas por email
  - Actualizar datos personales

#### RF-001.3: Perfil de Entrenador
- **Prioridad:** Media
- **Descripción:** Los entrenadores tienen perfil público
- **Datos:**
  - Nombre profesional
  - Bio/Descripción
  - Certificaciones
  - Foto de perfil
  - Redes sociales

---

### RF-002: Gestión de Rutinas/Plantillas

#### RF-002.1: Crear Rutina
- **Prioridad:** Alta
- **Descripción:** Los entrenadores pueden crear rutinas estructuradas
- **Estructura:**
  ```
  Rutina
  ├── Metadatos (nombre, descripción, precio, género, objetivo, nivel)
  ├── Imagen destacada
  ├── Tags/Etiquetas
  └── Semanas
      └── Días
          └── Ejercicios
              ├── Nombre
              ├── Series/Reps/Descanso
              ├── RIR (Reps in Reserve)
              ├── Tempo
              ├── URL de video
              └── Notas técnicas
  ```

#### RF-002.2: Editar Rutina
- **Prioridad:** Alta
- **Criterios:**
  - Permitir edición completa
  - Validar datos obligatorios
  - Guardar historial de cambios (fase 2)
  - No afectar compras ya realizadas

#### RF-002.3: Duplicar Rutina
- **Prioridad:** Media
- **Descripción:** Crear copia de rutina existente como base
- **Comportamiento:**
  - Copia completa de estructura
  - Agregar sufijo " (copia)" al nombre
  - Generar nuevo ID único
  - Marcar como borrador

#### RF-002.4: Eliminar Rutina
- **Prioridad:** Media
- **Criterios:**
  - Solicitar confirmación
  - No eliminar si tiene ventas activas (soft delete)
  - Mantener en historial de compras

#### RF-002.5: Categorización y Filtrado
- **Prioridad:** Alta
- **Filtros disponibles:**
  - Por género (Masculino/Femenino/Mixto)
  - Por objetivo (Volumen, Pérdida de grasa, Resistencia, Movilidad)
  - Por nivel (Inicial/Intermedio/Avanzado)
  - Por frecuencia (días/semana)
  - Por duración (semanas)
  - Por precio (rango)
  - Por tags

---

### RF-003: Proceso de Compra

#### RF-003.1: Selección de Rutina
- **Prioridad:** Alta
- **Descripción:** Flujo guiado de selección
- **Pasos:**
  1. Seleccionar género
  2. Seleccionar objetivo
  3. Ver rutinas filtradas
  4. Vista previa en modal
  5. Seleccionar para compra

#### RF-003.2: Vista Previa
- **Prioridad:** Alta
- **Contenido:**
  - Información completa del plan
  - Estructura de semanas
  - Ejercicios de ejemplo
  - Valoraciones (fase 2)
  - Sin mostrar contenido completo

#### RF-003.3: Checkout
- **Prioridad:** Alta
- **Descripción:** Proceso de pago con Mercado Pago
- **Datos requeridos:**
  - Email de entrega
  - Nombre y apellido
- **Flujo:**
  1. Validar datos
  2. Crear preferencia en Mercado Pago
  3. Redirigir a checkout MP
  4. Procesar webhook de confirmación
  5. Generar y enviar PDF

#### RF-003.4: Confirmación de Pago
- **Prioridad:** Alta
- **Descripción:** Procesamiento post-pago
- **Acciones:**
  - Recibir webhook de Mercado Pago
  - Validar firma de seguridad
  - Actualizar estado de venta
  - Generar PDF
  - Enviar email con rutina
  - Mostrar página de éxito

---

### RF-004: Generación y Entrega de PDF

#### RF-004.1: Generación de PDF Profesional
- **Prioridad:** Alta
- **Estructura:**
  - Portada con branding
  - Índice interactivo (links a secciones)
  - Metadatos del plan
  - Secciones por semana
  - Tablas de ejercicios
  - Notas y consejos
  - Footer con contacto
- **Estilo:**
  - Paleta oscura (#0E0E0E, #B5FF00)
  - Tipografía profesional
  - Logo y branding

#### RF-004.2: Almacenamiento de PDF
- **Prioridad:** Alta
- **Descripción:** PDFs en Supabase Storage
- **Criterios:**
  - Generar nombre único
  - URL firmada temporal (48h)
  - Regenerar URL para re-descargas
  - Tracking de descargas

#### RF-004.3: Envío por Email
- **Prioridad:** Alta
- **Descripción:** Email profesional con Resend
- **Contenido:**
  - Asunto personalizado
  - Diseño responsive
  - Botón de descarga destacado
  - Información del plan
  - Enlace al portal
  - Footer con soporte

#### RF-004.4: Re-descarga
- **Prioridad:** Media
- **Descripción:** Permitir descargar nuevamente
- **Criterios:**
  - Validar propiedad (email)
  - Regenerar URL temporal
  - Contador de descargas
  - Límite de 10 descargas (configurable)

---

### RF-005: Dashboard de Entrenador

#### RF-005.1: Métricas de Negocio
- **Prioridad:** Alta
- **KPIs mostrados:**
  - Usuarios totales
  - Ingresos totales
  - Ingresos mensuales (+ variación %)
  - Rutinas activas
  - Descargas del mes
  - Ticket promedio
  - Tasa de conversión (fase 2)

#### RF-005.2: Gráficos Analíticos
- **Prioridad:** Alta
- **Visualizaciones:**
  - Línea: Ingresos últimos 6 meses
  - Barras: Top 5 rutinas por ventas
  - Dona: Distribución por objetivo (fase 2)
  - Embudo: Conversión (fase 2)

#### RF-005.3: Tabla de Ventas
- **Prioridad:** Alta
- **Funcionalidades:**
  - Listado de todas las ventas
  - Filtros por plan (Premium/Essential/Basic)
  - Ordenamiento por fecha/monto
  - Paginación (8 registros/página)
  - Búsqueda por cliente
  - Exportación a CSV (fase 2)

#### RF-005.4: Gestión de Plantillas
- **Prioridad:** Alta
- **Vista:**
  - Grid de tarjetas
  - Filtros múltiples
  - Acciones rápidas (editar/duplicar/eliminar/exportar)
  - Preview rápido

#### RF-005.5: Exportación de Contactos
- **Prioridad:** Media
- **Descripción:** Descargar emails de clientes
- **Formato:** TXT con emails separados por coma
- **Uso:** Campañas de email marketing

---

### RF-006: Sistema de Notificaciones

#### RF-006.1: Notificaciones por Email
- **Prioridad:** Alta
- **Tipos:**
  - Confirmación de compra
  - Entrega de rutina
  - Recordatorio de entrenamiento (fase 2)
  - Nuevas rutinas disponibles (fase 2)

#### RF-006.2: Notificaciones In-App (Fase 2)
- **Prioridad:** Baja
- **Tipos:**
  - Nueva venta para entrenador
  - Pago rechazado
  - Rutina lista para descargar

---

### RF-007: Sistema de Valoraciones (Fase 2)

#### RF-007.1: Calificar Rutinas
- **Prioridad:** Media
- **Criterios:**
  - Solo clientes que compraron pueden calificar
  - Escala de 1-5 estrellas
  - Comentario opcional
  - Una valoración por compra

#### RF-007.2: Respuestas de Entrenador
- **Prioridad:** Baja
- **Descripción:** Entrenadores pueden responder valoraciones

---

### RF-008: Sistema de Progreso del Cliente (Fase 2)

#### RF-008.1: Tracking de Entrenamientos
- **Prioridad:** Media
- **Funcionalidades:**
  - Marcar días completados
  - Registrar peso usado
  - Notas personales por ejercicio
  - Fotos de progreso

#### RF-008.2: Dashboard de Progreso
- **Prioridad:** Media
- **Visualizaciones:**
  - Calendario de asistencia
  - Gráfico de progresión de cargas
  - Comparación de fotos (antes/después)
  - Estadísticas de adherencia

---

### RF-009: Sistema de Gamificación (Fase 3)

#### RF-009.1: Sistema de Logros
- **Prioridad:** Baja
- **Ejemplos:**
  - "Primera semana completada"
  - "10 entrenamientos consecutivos"
  - "Aumentó carga en 5kg"

#### RF-009.2: Ranking y Comunidad
- **Prioridad:** Baja
- **Funcionalidades:**
  - Tabla de líderes (opt-in)
  - Compartir logros
  - Desafíos semanales

---

### RF-010: Sistema de Suscripciones (Fase 3)

#### RF-010.1: Planes de Suscripción
- **Prioridad:** Media
- **Tipos:**
  - Mensual: Acceso a 1 rutina/mes
  - Trimestral: Acceso a 3 rutinas + descuento
  - Anual: Acceso ilimitado + extras

#### RF-010.2: Gestión de Suscripción
- **Prioridad:** Media
- **Funcionalidades:**
  - Cancelar en cualquier momento
  - Cambiar plan
  - Renovación automática
  - Recordatorios de vencimiento

---

### RF-011: Programa de Referidos (Fase 3)

#### RF-011.1: Códigos de Referido
- **Prioridad:** Baja
- **Funcionamiento:**
  - Cliente genera código único
  - Nuevo usuario aplica código
  - Ambos obtienen beneficio

#### RF-011.2: Dashboard de Referidos
- **Prioridad:** Baja
- **Métricas:**
  - Usuarios referidos
  - Conversiones
  - Comisiones ganadas

---

### RF-012: Integración con Wearables (Fase 4)

#### RF-012.1: Sincronización de Datos
- **Prioridad:** Baja
- **Dispositivos:**
  - Apple Watch
  - Garmin
  - Fitbit
  - Google Fit

#### RF-012.2: Métricas Sincronizadas
- **Datos:**
  - Frecuencia cardíaca
  - Calorías quemadas
  - Pasos
  - Sueño

---

### RF-013: Sistema de Consultas (Fase 2)

#### RF-013.1: Chat Cliente-Entrenador
- **Prioridad:** Media
- **Funcionalidades:**
  - Mensajería en tiempo real
  - Adjuntar imágenes/videos
  - Notificaciones push
  - Historial de conversaciones

#### RF-013.2: FAQ Automatizado
- **Prioridad:** Baja
- **Descripción:** Chatbot para preguntas comunes

---

## 🔒 Requerimientos No Funcionales

### RNF-001: Rendimiento
- **RNF-001.1:** Tiempo de carga de página < 2 segundos
- **RNF-001.2:** Generación de PDF < 5 segundos
- **RNF-001.3:** Respuesta de API < 500ms (p95)
- **RNF-001.4:** Soporte para 100 usuarios concurrentes (fase 1)
- **RNF-001.5:** Soporte para 1000 usuarios concurrentes (fase 2)

### RNF-002: Seguridad
- **RNF-002.1:** Encriptación HTTPS en todas las comunicaciones
- **RNF-002.2:** Tokens de Mercado Pago en variables de entorno
- **RNF-002.3:** Validación de webhooks con firma
- **RNF-002.4:** Row Level Security en Supabase
- **RNF-002.5:** Rate limiting en endpoints públicos (100 req/min)
- **RNF-002.6:** Sanitización de inputs para prevenir XSS/SQL Injection
- **RNF-002.7:** Logs de auditoría de acciones críticas

### RNF-003: Disponibilidad
- **RNF-003.1:** Uptime mínimo de 99.5% (fase 1)
- **RNF-003.2:** Uptime mínimo de 99.9% (fase 2)
- **RNF-003.3:** Backups automáticos diarios
- **RNF-003.4:** Plan de recuperación de desastres (RTO < 4 horas)

### RNF-004: Escalabilidad
- **RNF-004.1:** Arquitectura serverless auto-escalable
- **RNF-004.2:** Base de datos escalable (Supabase)
- **RNF-004.3:** CDN para contenido estático
- **RNF-004.4:** Cache de queries frecuentes

### RNF-005: Usabilidad
- **RNF-005.1:** Diseño responsive (mobile-first)
- **RNF-005.2:** Accesibilidad WCAG 2.1 nivel AA
- **RNF-005.3:** Interfaz en español argentino
- **RNF-005.4:** Feedback visual en todas las acciones
- **RNF-005.5:** Tiempo de aprendizaje < 10 minutos para clientes

### RNF-006: Mantenibilidad
- **RNF-006.1:** Código documentado con JSDoc
- **RNF-006.2:** Tests unitarios (cobertura > 70%)
- **RNF-006.3:** Tests E2E para flujos críticos
- **RNF-006.4:** Logging estructurado
- **RNF-006.5:** Monitoreo con alertas (Vercel Analytics)

### RNF-007: Compatibilidad
- **RNF-007.1:** Soporte Chrome/Firefox/Safari/Edge (últimas 2 versiones)
- **RNF-007.2:** Soporte iOS 14+ y Android 10+
- **RNF-007.3:** PDF compatible con Adobe Reader 9+

### RNF-008: Cumplimiento Legal
- **RNF-008.1:** Cumplimiento GDPR (si escala a Europa)
- **RNF-008.2:** Ley de Protección de Datos Personales (Argentina)
- **RNF-008.3:** Términos y condiciones claros
- **RNF-008.4:** Política de privacidad
- **RNF-008.5:** Derecho al olvido (eliminar cuenta)

### RNF-009: Costos
- **RNF-009.1:** Stack completamente gratuito para MVP
- **RNF-009.2:** Costos predecibles al escalar
- **RNF-009.3:** Sin vendor lock-in crítico

### RNF-010: Monitoreo
- **RNF-010.1:** Dashboard de métricas en tiempo real
- **RNF-010.2:** Alertas por email/Slack para errores críticos
- **RNF-010.3:** Tracking de conversiones
- **RNF-010.4:** Analytics de uso (Google Analytics/Mixpanel)

---

## 🚫 Restricciones

### Restricciones Técnicas
1. Frontend debe ser React 18+
2. Base de datos PostgreSQL (Supabase)
3. Procesamiento de pagos exclusivamente con Mercado Pago
4. Deploy en Vercel
5. Generación de PDF del lado servidor

### Restricciones de Negocio
1. Comisión de Mercado Pago aplicable
2. Precios en pesos argentinos (ARS)
3. Solo venta digital (no productos físicos)
4. Contenido en español

### Restricciones de Tiempo
1. MVP en 8 semanas
2. Fase 2 en 12 semanas adicionales

---

## 📌 Suposiciones

1. Los entrenadores tienen conocimientos básicos de computación
2. Los clientes tienen acceso a email
3. Los PDFs serán visualizados en dispositivos con lectores PDF
4. La mayoría del tráfico será desde Argentina
5. Mercado Pago está disponible y operativo
6. Los usuarios tienen conexión a internet estable

---

## 🎯 Criterios de Éxito

| Métrica | Objetivo Fase 1 | Objetivo Fase 2 |
|---------|-----------------|-----------------|
| Tiempo de carga | < 2 segundos | < 1 segundo |
| Conversión | > 2% | > 5% |
| Uptime | 99.5% | 99.9% |
| NPS (Net Promoter Score) | > 40 | > 60 |
| Usuarios activos mensuales | 100 | 1,000 |
| Ingresos mensuales | $500k ARS | $2M ARS |

---

## 📅 Priorización

### Must Have (MVP - Fase 1)
- ✅ RF-001.1, RF-001.2: Gestión básica de usuarios
- ✅ RF-002.1, RF-002.2, RF-002.3: CRUD de rutinas
- ✅ RF-003: Proceso completo de compra
- ✅ RF-004: Generación y entrega de PDF
- ✅ RF-005: Dashboard básico de entrenador

### Should Have (Fase 2)
- 🔶 RF-006: Sistema de notificaciones
- 🔶 RF-007: Valoraciones
- 🔶 RF-008: Tracking de progreso
- 🔶 RF-013: Sistema de consultas

### Could Have (Fase 3)
- 🔷 RF-009: Gamificación
- 🔷 RF-010: Suscripciones
- 🔷 RF-011: Referidos

### Won't Have (Futuro)
- ⚪ RF-012: Integración con wearables

---

## 📝 Notas Adicionales

- Este documento debe revisarse y actualizarse con cada sprint
- Los requerimientos de fase 2+ pueden ajustarse según feedback de usuarios
- Se recomienda validar cada funcionalidad con usuarios beta antes de producción

---

**Aprobaciones:**

| Rol | Nombre | Firma | Fecha |
|-----|--------|-------|-------|
| Product Owner | | | |
| Tech Lead | | | |
| Cliente | Matías Zaccaro | | |

---

**Control de Versiones:**

| Versión | Fecha | Autor | Cambios |
|---------|-------|-------|---------|
| 1.0 | 2025-11-13 | Claude AI | Versión inicial |
