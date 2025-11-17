# 🗺️ Roadmap del Producto Fitter

## Información del Documento

| Campo | Valor |
|-------|-------|
| **Producto** | Fitter - Plataforma de Rutinas de Entrenamiento |
| **Versión** | 1.0 |
| **Fecha** | 2025-11-13 |
| **Última Actualización** | 2025-11-13 |

---

## 🎯 Visión del Producto

**Convertir a Fitter en la plataforma líder de distribución de planes de entrenamiento personalizados en América Latina, conectando entrenadores certificados con personas que buscan alcanzar sus objetivos fitness mediante ciencia, tecnología y acompañamiento profesional.**

---

## 📊 Estrategia de Fases

El desarrollo de Fitter se divide en 4 fases principales, cada una con objetivos específicos de negocio y técnicos.

```
MVP (8 semanas) → Fase 2 (12 semanas) → Fase 3 (16 semanas) → Fase 4 (Continuo)
     ↓                  ↓                      ↓                      ↓
  Validación       Crecimiento          Escalamiento           Innovación
```

---

## 🚀 Fase 1: MVP - Validación del Mercado

**Duración:** 8 semanas
**Objetivo:** Validar la demanda y el modelo de negocio con funcionalidad core
**Estado:** 🟢 En desarrollo

### Funcionalidades

#### Cliente Final
- ✅ Landing page con hero y value proposition
- ✅ Selector de género y objetivo
- ✅ Catálogo de rutinas con filtros
- ✅ Vista previa detallada de rutinas
- ✅ Checkout integrado con Mercado Pago
- ✅ Entrega automática por email
- ✅ Portal "Mis Compras" (búsqueda por email)
- ✅ Descarga ilimitada de rutinas compradas
- ✅ Función de reenvío por email

#### Entrenador/Admin
- ✅ Dashboard analítico con KPIs
- ✅ Gráficos de ingresos y ventas
- ✅ Editor de rutinas (CRUD completo)
  - Metadatos (nombre, precio, género, objetivo)
  - Estructura de semanas
  - Días de entrenamiento
  - Ejercicios con detalles técnicos (series, RIR, tempo, video)
- ✅ Duplicación de plantillas
- ✅ Exportación de rutinas a PDF
- ✅ Gestión de catálogo con filtros
- ✅ Tabla de ventas con ordenamiento y paginación
- ✅ Exportación de emails de clientes

#### Backend & Infraestructura
- ✅ Vercel Serverless Functions
- ✅ Supabase PostgreSQL (database)
- ✅ Supabase Storage (PDFs)
- ✅ Integración Mercado Pago (checkout + webhooks)
- ✅ Resend (envío de emails transaccionales)
- ✅ Generación de PDFs profesionales con @react-pdf/renderer
- ✅ Sistema de URLs firmadas temporales (48h)

### Stack Tecnológico
- **Frontend:** React 18 + Vite + TailwindCSS + Framer Motion
- **Backend:** Node.js (Serverless)
- **Database:** PostgreSQL (Supabase)
- **Storage:** Supabase Storage
- **Pagos:** Mercado Pago
- **Emails:** Resend
- **Hosting:** Vercel (CDN global)

### Métricas de Éxito
- [ ] 50 usuarios registrados en el primer mes
- [ ] 10 ventas en el primer mes
- [ ] Tasa de conversión > 2%
- [ ] Tiempo de carga < 2 segundos
- [ ] Uptime > 99.5%
- [ ] NPS > 40

### Costos
- **Total mensual:** $0 USD (stack 100% gratuito)
- **Comisiones Mercado Pago:** 4.99% + $10 ARS por transacción

---

## 📈 Fase 2: Escalamiento y Engagement

**Duración:** 12 semanas
**Objetivo:** Aumentar retención y engagement de usuarios
**Estado:** 🔵 Planificado
**Inicio estimado:** Semana 9

### Funcionalidades Nuevas

#### Sistema de Autenticación
- 🔲 Registro de usuarios con email + password
- 🔲 Login/Logout
- 🔲 Perfil de usuario completo
- 🔲 Recuperación de contraseña
- 🔲 OAuth (Google, Facebook)
- 🔲 Row Level Security (RLS) en Supabase

#### Sistema de Valoraciones
- 🔲 Los clientes pueden calificar rutinas (1-5 estrellas)
- 🔲 Dejar comentarios y feedback
- 🔲 Ver promedio de valoraciones en catálogo
- 🔲 Filtrar rutinas por mejor valoradas
- 🔲 Entrenadores pueden responder reviews

#### Tracking de Progreso
- 🔲 Dashboard personal del cliente
- 🔲 Marcar días completados
- 🔲 Registrar pesos usados por ejercicio
- 🔲 Notas personales por sesión
- 🔲 Subir fotos de progreso (antes/después)
- 🔲 Calendario de adherencia
- 🔲 Gráficos de evolución de cargas
- 🔲 Estadísticas de consistencia

#### Sistema de Notificaciones
- 🔲 Push notifications (web + mobile)
- 🔲 Recordatorios de entrenamiento
- 🔲 Alertas de nuevas rutinas disponibles
- 🔲 Notificaciones de nuevas ventas (entrenadores)
- 🔲 Emails de seguimiento automatizado

#### Chat Cliente-Entrenador
- 🔲 Mensajería en tiempo real
- 🔲 Adjuntar imágenes y videos
- 🔲 Historial de conversaciones
- 🔲 Notificaciones de nuevos mensajes
- 🔲 Estado online/offline

#### Mejoras de UX
- 🔲 Onboarding interactivo para nuevos usuarios
- 🔲 Tour guiado del dashboard
- 🔲 Tooltips contextuales
- 🔲 Dark mode / Light mode
- 🔲 Personalización de interfaz
- 🔲 Modo offline (PWA)

### Infraestructura
- 🔲 Cache layer (Redis/Upstash) para queries frecuentes
- 🔲 CDN para imágenes (Cloudinary)
- 🔲 Monitoreo con Sentry (errores)
- 🔲 Analytics avanzado (Mixpanel)
- 🔲 A/B testing (Optimizely)

### Métricas de Éxito
- [ ] 500 usuarios activos mensuales
- [ ] 100 ventas/mes
- [ ] Tasa de conversión > 5%
- [ ] NPS > 60
- [ ] Tasa de retención 30 días > 40%
- [ ] 50% de usuarios completan al menos 1 semana

### Costos Estimados
- **Upstash Redis:** Gratis hasta 10K requests/día
- **Cloudinary:** Gratis hasta 25GB
- **Sentry:** Gratis hasta 5K eventos/mes
- **Mixpanel:** Gratis hasta 20M eventos/mes
- **Total estimado:** $0-50 USD/mes

---

## 🎨 Fase 3: Monetización Avanzada

**Duración:** 16 semanas
**Objetivo:** Diversificar fuentes de ingreso y aumentar LTV
**Estado:** ⚪ Futuro
**Inicio estimado:** Semana 21

### Funcionalidades Nuevas

#### Sistema de Suscripciones
- 🔲 Plan Mensual: 1 rutina nueva/mes
- 🔲 Plan Trimestral: 3 rutinas + 10% descuento
- 🔲 Plan Anual: Rutinas ilimitadas + beneficios exclusivos
- 🔲 Gestión de suscripción (cancelar, pausar, cambiar)
- 🔲 Renovación automática con Mercado Pago
- 🔲 Recordatorios de vencimiento
- 🔲 Contenido exclusivo para suscriptores

#### Marketplace de Entrenadores
- 🔲 Perfil público de entrenadores
- 🔲 Portfolio de rutinas
- 🔲 Certificaciones y credenciales
- 🔲 Sistema de rankings
- 🔲 Comisión por venta (70% entrenador / 30% plataforma)
- 🔲 Dashboard de ganancias para entrenadores
- 🔲 Retiros automáticos a cuenta bancaria

#### Gamificación
- 🔲 Sistema de logros y badges
  - "Primera semana completada"
  - "10 entrenamientos consecutivos"
  - "Aumentó carga en 5kg"
  - "Mes sin faltar"
- 🔲 Niveles de usuario (Rookie → Pro → Elite)
- 🔲 Tabla de líderes (opt-in, anónimo)
- 🔲 Desafíos semanales
- 🔲 Recompensas y descuentos por logros
- 🔲 Compartir logros en redes sociales

#### Programa de Referidos
- 🔲 Código único por usuario
- 🔲 20% descuento para referido
- 🔲 20% crédito para referente
- 🔲 Dashboard de referidos
- 🔲 Tracking de conversiones
- 🔲 Pagos automáticos de comisiones

#### Contenido Premium
- 🔲 Biblioteca de videos educativos
- 🔲 Webinars en vivo con expertos
- 🔲 Guías de nutrición
- 🔲 Calculadoras (TDEE, macros, 1RM)
- 🔲 Plantillas de meal prep
- 🔲 Comunidad privada (foro/Discord)

### Integraciones
- 🔲 Stripe (pagos internacionales)
- 🔲 WhatsApp Business API
- 🔲 Zoom API (consultorías virtuales)
- 🔲 Calendly (agendar sesiones)

### Métricas de Éxito
- [ ] 2,000 usuarios activos mensuales
- [ ] $2M ARS en ingresos mensuales
- [ ] 200 suscripciones activas
- [ ] 50 entrenadores vendiendo
- [ ] LTV > $15,000 ARS
- [ ] Churn rate < 5%

### Costos Estimados
- **Stripe:** 2.9% + $0.30 USD por transacción
- **Twilio (WhatsApp):** $0.005 por mensaje
- **Zoom API:** $40 USD/mes
- **Community hosting:** $50-100 USD/mes
- **Total estimado:** $100-200 USD/mes

---

## 🔮 Fase 4: Innovación y AI

**Duración:** Continua
**Objetivo:** Posicionar a Fitter como líder tecnológico
**Estado:** ⚪ Visión a largo plazo
**Inicio estimado:** Semana 37+

### Funcionalidades Innovadoras

#### IA para Personalización
- 🔲 Algoritmo de recomendación de rutinas basado en ML
- 🔲 Generador de rutinas con IA (GPT-4)
- 🔲 Ajuste automático de volumen según progreso
- 🔲 Predicción de riesgo de lesión
- 🔲 Chatbot de soporte con IA
- 🔲 Análisis de form check con computer vision

#### Integración con Wearables
- 🔲 Sincronización con Apple Watch
- 🔲 Integración con Garmin
- 🔲 Conexión con Fitbit
- 🔲 Google Fit integration
- 🔲 Métricas en tiempo real:
  - Frecuencia cardíaca
  - Calorías quemadas
  - Pasos
  - Calidad de sueño
  - HRV (Heart Rate Variability)

#### App Móvil Nativa
- 🔲 React Native iOS/Android
- 🔲 Modo offline completo
- 🔲 Cronómetro y temporizador integrados
- 🔲 Reproductor de videos de ejercicios
- 🔲 Grabación de sets en tiempo real
- 🔲 Push notifications avanzadas
- 🔲 Apple Health / Google Fit sync

#### AR/VR (Visión futura)
- 🔲 Demostración de ejercicios en AR
- 🔲 Entrenamiento inmersivo en VR
- 🔲 Corrección de técnica con AR
- 🔲 Gimnasio virtual

#### Expansión Geográfica
- 🔲 Soporte multi-idioma (inglés, portugués)
- 🔲 Múltiples monedas
- 🔲 Procesadores de pago locales
- 🔲 Contenido localizado por región
- 🔲 Entrenadores internacionales

#### Programas Corporativos
- 🔲 Plan B2B para empresas
- 🔲 Wellness programs
- 🔲 Dashboard para RR.HH.
- 🔲 Reportes de salud organizacional
- 🔲 Facturación corporativa

### Tecnologías Emergentes
- 🔲 OpenAI GPT-4 API
- 🔲 TensorFlow.js para ML en browser
- 🔲 WebRTC para video consultorías
- 🔲 Blockchain para certificados NFT (opcional)
- 🔲 GraphQL para optimizar queries
- 🔲 Microservicios para escalabilidad

### Métricas de Éxito
- [ ] 10,000+ usuarios activos
- [ ] $10M+ ARS ingresos mensuales
- [ ] Presencia en 3+ países
- [ ] 500+ entrenadores en plataforma
- [ ] Top 10 app de fitness en Argentina
- [ ] Ronda de inversión Serie A

### Costos Estimados
- **OpenAI API:** $100-500 USD/mes
- **Mobile app hosting:** $200 USD/mes
- **AI/ML infrastructure:** $500-1000 USD/mes
- **Marketing:** $2000+ USD/mes
- **Team expansion:** Variable
- **Total estimado:** $3000+ USD/mes

---

## 📊 Cronograma General

```mermaid (representación textual)
Semanas:  1----8--|9---------20|21--------36|37+
Fases:    [  MVP  ][ Fase 2   ][ Fase 3   ][Fase 4]
Estado:   🟢 Activo|🔵 Próximo |⚪ Futuro  |⚪ Visión
Equipo:   1-2 devs|2-3 devs   |3-5 devs   |5-10 devs
```

---

## 🎯 KPIs por Fase

| Métrica | MVP (Fase 1) | Fase 2 | Fase 3 | Fase 4 |
|---------|--------------|--------|--------|--------|
| **Usuarios Activos/Mes** | 50-100 | 500+ | 2,000+ | 10,000+ |
| **Ventas/Mes** | 10 | 100 | 300 | 1,000+ |
| **Ingresos Mensuales** | $500K ARS | $2M ARS | $5M ARS | $10M+ ARS |
| **Tasa de Conversión** | 2% | 5% | 7% | 10% |
| **NPS** | 40+ | 60+ | 70+ | 80+ |
| **Churn Rate** | N/A | 10% | 5% | 3% |
| **LTV** | $10K ARS | $15K ARS | $25K ARS | $50K+ ARS |

---

## 🚧 Riesgos y Mitigaciones

### Riesgos Técnicos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Problemas con Mercado Pago API | Media | Alto | Implementar retry logic + monitoreo |
| Escalabilidad de Supabase | Baja | Medio | Monitorear uso + plan de migración |
| Generación lenta de PDFs | Media | Medio | Optimizar componentes + cache |
| Pérdida de datos | Baja | Crítico | Backups automáticos diarios |

### Riesgos de Negocio

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Baja demanda inicial | Alta | Crítico | Campaña de marketing + beta testers |
| Competencia | Media | Alto | Diferenciación por calidad y UX |
| Problemas legales (PDPA) | Baja | Alto | Consultoría legal + T&C claros |
| Fraude en pagos | Media | Medio | Validación de webhooks + monitoreo |

---

## 💰 Modelo de Monetización

### Fase 1 (MVP)
- Venta directa de rutinas individuales
- Precios: $10,000 - $20,000 ARS por rutina

### Fase 2
- Venta directa + Suscripciones opcionales
- Freemium: Vista previa gratis, pago por rutina completa

### Fase 3
- Múltiples streams:
  - Venta de rutinas (one-time)
  - Suscripciones mensuales/anuales
  - Comisión marketplace (30%)
  - Contenido premium (webinars, guías)
  - Programa de referidos

### Fase 4
- Todos los anteriores +
  - Planes corporativos B2B
  - Licencias para gimnasios
  - Partnerships con marcas
  - Affiliate marketing

---

## 📚 Dependencias Críticas

### Fase 1 → Fase 2
- ✅ Validación de demanda (mínimo 50 usuarios)
- ✅ Feedback positivo de usuarios (NPS > 40)
- ✅ Sistema de pagos estable (0 chargebacks)
- ✅ PDFs generándose correctamente (100% éxito)

### Fase 2 → Fase 3
- ⏳ 500+ usuarios activos mensuales
- ⏳ Tasa de retención > 40%
- ⏳ Sistema de autenticación funcionando
- ⏳ Base de entrenadores interesados (mínimo 10)

### Fase 3 → Fase 4
- ⏳ Ingresos sostenibles ($5M+ ARS/mes)
- ⏳ Team expandido (mínimo 5 personas)
- ⏳ Inversión externa o bootstrapping exitoso
- ⏳ Market fit comprobado en Argentina

---

## 🔄 Proceso de Revisión

Este roadmap se revisará y actualizará:
- **Mensualmente:** Durante MVP
- **Bimestralmente:** Durante Fase 2-3
- **Trimestralmente:** Durante Fase 4

### Criterios de Ajuste
- Feedback de usuarios
- Métricas de negocio
- Cambios en el mercado
- Nuevas tecnologías disponibles
- Recursos disponibles

---

## 📝 Notas Adicionales

### Principios de Desarrollo
1. **Iterate Fast:** Lanzar rápido, aprender, ajustar
2. **User-Centric:** Cada feature debe resolver un problema real
3. **Data-Driven:** Decisiones basadas en métricas, no opiniones
4. **Quality First:** Mejor menos features bien hechas que muchas mal hechas
5. **Sustainable Growth:** Crecimiento orgánico antes de pagar por ads

### Filosofía del Producto
- **Simplicidad:** La interfaz debe ser intuitiva para cualquier persona
- **Confiabilidad:** Los usuarios confían su fitness journey a nosotros
- **Transparencia:** Comunicación clara sobre precios y beneficios
- **Comunidad:** Fomentar conexiones entre usuarios y entrenadores
- **Ciencia:** Todas las rutinas deben estar basadas en evidencia

---

**Documento vivo - Se actualiza continuamente**

**Responsable:** Product Owner / Tech Lead
**Última revisión:** 2025-11-13
**Próxima revisión:** 2025-12-13
