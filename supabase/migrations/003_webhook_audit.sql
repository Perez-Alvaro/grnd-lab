-- =====================================================
-- MIGRACIÓN 003: WEBHOOK AUDIT Y MEJORAS DE PAGOS
-- Fecha: 2025-01-16
-- Descripción: Tablas para auditoría de webhooks y mejoras en el sistema de pagos
-- =====================================================

-- =====================================================
-- 1. TABLA: webhook_logs (Auditoría de webhooks)
-- =====================================================
CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source VARCHAR(50) NOT NULL, -- 'mercadopago', 'stripe', etc.
  event_type VARCHAR(100), -- Tipo de evento (payment.created, payment.updated, etc.)
  payment_id VARCHAR(255), -- ID del pago externo
  status VARCHAR(50), -- Estado del pago en ese momento
  payload JSONB, -- Payload completo del webhook
  processed BOOLEAN DEFAULT false, -- Si se procesó correctamente
  error_message TEXT, -- Mensaje de error si falló
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_webhook_logs_payment_id ON webhook_logs(payment_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_source ON webhook_logs(source);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_created_at ON webhook_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_processed ON webhook_logs(processed);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_event_type ON webhook_logs(event_type);

-- Comentario
COMMENT ON TABLE webhook_logs IS 'Auditoría completa de todos los webhooks recibidos';
COMMENT ON COLUMN webhook_logs.processed IS 'Indica si el webhook fue procesado exitosamente';

-- =====================================================
-- 2. TABLA: failed_webhooks (Webhooks fallidos para retry manual)
-- =====================================================
CREATE TABLE IF NOT EXISTS failed_webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  webhook_log_id UUID REFERENCES webhook_logs(id) ON DELETE CASCADE,
  payment_id VARCHAR(255) NOT NULL,
  source VARCHAR(50) NOT NULL DEFAULT 'mercadopago',
  error_message TEXT NOT NULL,
  error_details JSONB, -- Stack trace, contexto adicional
  payload JSONB NOT NULL, -- Payload original del webhook
  retry_count INTEGER DEFAULT 0,
  last_retry_at TIMESTAMP WITH TIME ZONE,
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id), -- Admin que lo resolvió
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_failed_webhooks_payment_id ON failed_webhooks(payment_id);
CREATE INDEX IF NOT EXISTS idx_failed_webhooks_resolved ON failed_webhooks(resolved);
CREATE INDEX IF NOT EXISTS idx_failed_webhooks_retry_count ON failed_webhooks(retry_count);
CREATE INDEX IF NOT EXISTS idx_failed_webhooks_created_at ON failed_webhooks(created_at DESC);

-- Comentario
COMMENT ON TABLE failed_webhooks IS 'Webhooks que fallaron al procesarse, para retry manual';
COMMENT ON COLUMN failed_webhooks.retry_count IS 'Número de intentos automáticos de reprocesamiento';
COMMENT ON COLUMN failed_webhooks.resolved IS 'Indica si el problema fue resuelto manualmente';

-- =====================================================
-- 3. CONSTRAINT: Prevenir duplicados de payment_id
-- =====================================================
-- Agregar constraint UNIQUE en payment_id de la tabla sales
-- para evitar procesar el mismo pago dos veces
ALTER TABLE sales
  DROP CONSTRAINT IF EXISTS unique_payment_id;

ALTER TABLE sales
  ADD CONSTRAINT unique_payment_id
  UNIQUE (payment_id);

-- Comentario
COMMENT ON CONSTRAINT unique_payment_id ON sales IS 'Previene duplicación de pagos por el mismo payment_id';

-- =====================================================
-- 4. VISTA: payments_dashboard (Dashboard de pagos)
-- =====================================================
DROP VIEW IF EXISTS payments_dashboard;

CREATE VIEW payments_dashboard AS
SELECT
  DATE(s.created_at) as date,
  COUNT(*) as total_sales,
  COUNT(*) FILTER (WHERE s.status = 'completed') as completed_sales,
  COUNT(*) FILTER (WHERE s.status = 'pending') as pending_sales,
  COUNT(*) FILTER (WHERE s.status = 'failed') as failed_sales,
  SUM(s.total_amount) FILTER (WHERE s.status = 'completed') as total_revenue,
  AVG(s.total_amount) FILTER (WHERE s.status = 'completed') as avg_sale_amount,
  COUNT(DISTINCT s.user_email) as unique_customers,
  s.payment_method
FROM sales s
GROUP BY DATE(s.created_at), s.payment_method
ORDER BY date DESC;

COMMENT ON VIEW payments_dashboard IS 'Dashboard con métricas diarias de ventas y pagos';

-- =====================================================
-- 5. VISTA: webhook_stats (Estadísticas de webhooks)
-- =====================================================
DROP VIEW IF EXISTS webhook_stats;

CREATE VIEW webhook_stats AS
SELECT
  DATE(created_at) as date,
  source,
  event_type,
  COUNT(*) as total_webhooks,
  COUNT(*) FILTER (WHERE processed = true) as processed_count,
  COUNT(*) FILTER (WHERE processed = false) as failed_count,
  ROUND(
    COUNT(*) FILTER (WHERE processed = true)::numeric / NULLIF(COUNT(*), 0) * 100,
    2
  ) as success_rate,
  MIN(created_at) as first_webhook_at,
  MAX(created_at) as last_webhook_at
FROM webhook_logs
GROUP BY DATE(created_at), source, event_type
ORDER BY date DESC, source, event_type;

COMMENT ON VIEW webhook_stats IS 'Estadísticas diarias de webhooks recibidos y procesados';

-- =====================================================
-- 6. FUNCIÓN: Limpiar webhooks antiguos (opcional)
-- =====================================================
CREATE OR REPLACE FUNCTION cleanup_old_webhooks(days_to_keep INTEGER DEFAULT 90)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Eliminar webhook_logs procesados exitosamente más antiguos que X días
  DELETE FROM webhook_logs
  WHERE processed = true
    AND error_message IS NULL
    AND created_at < NOW() - (days_to_keep || ' days')::INTERVAL;

  GET DIAGNOSTICS deleted_count = ROW_COUNT;

  -- Log de la limpieza
  INSERT INTO activity_logs (
    action,
    entity_type,
    details
  ) VALUES (
    'sale_completed', -- reutilizamos el enum existente
    'webhook_cleanup',
    jsonb_build_object(
      'deleted_count', deleted_count,
      'days_to_keep', days_to_keep,
      'cleaned_at', NOW()
    )
  );

  RETURN deleted_count;
END;
$$;

COMMENT ON FUNCTION cleanup_old_webhooks IS 'Limpia webhooks procesados exitosamente más antiguos que X días (default 90)';

-- =====================================================
-- 7. ROW LEVEL SECURITY (RLS) para nuevas tablas
-- =====================================================

-- Habilitar RLS
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE failed_webhooks ENABLE ROW LEVEL SECURITY;

-- Políticas: Solo admins pueden ver logs de webhooks
DROP POLICY IF EXISTS "Admins pueden ver webhook logs" ON webhook_logs;
CREATE POLICY "Admins pueden ver webhook logs"
  ON webhook_logs FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins pueden insertar webhook logs" ON webhook_logs;
CREATE POLICY "Admins pueden insertar webhook logs"
  ON webhook_logs FOR INSERT
  WITH CHECK (public.is_admin());

-- Políticas: Solo admins pueden ver y gestionar failed webhooks
DROP POLICY IF EXISTS "Admins pueden gestionar failed webhooks" ON failed_webhooks;
CREATE POLICY "Admins pueden gestionar failed webhooks"
  ON failed_webhooks FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- 8. ÍNDICE ADICIONAL: Búsqueda de ventas por email
-- =====================================================
-- Mejorar búsquedas de ventas por email (para envío de emails)
CREATE INDEX IF NOT EXISTS idx_sales_user_email_status ON sales(user_email, status);

-- =====================================================
-- FIN DE LA MIGRACIÓN
-- =====================================================

-- Verificación
SELECT 'Migración 003 completada exitosamente' as status;

-- Mostrar tablas creadas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('webhook_logs', 'failed_webhooks')
ORDER BY table_name;
