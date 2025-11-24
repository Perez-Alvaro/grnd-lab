-- Script para verificar el estado del último pago
-- Ejecutar después de completar la compra de prueba

-- 1. Ver la última venta creada
SELECT
  id,
  payment_id,
  user_email,
  total_amount,
  status,
  created_at,
  completed_at
FROM sales
ORDER BY created_at DESC
LIMIT 1;

-- 2. Ver los items de la última venta
SELECT
  si.product_name,
  si.quantity,
  si.unit_price,
  si.subtotal,
  p.type as product_type
FROM sale_items si
JOIN products p ON p.id = si.product_id
WHERE si.sale_id = (SELECT id FROM sales ORDER BY created_at DESC LIMIT 1);

-- 3. Ver los archivos generados
SELECT
  file_path,
  file_url,
  generated_at,
  expires_at
FROM generated_files
WHERE sale_item_id IN (
  SELECT id FROM sale_items
  WHERE sale_id = (SELECT id FROM sales ORDER BY created_at DESC LIMIT 1)
);

-- 4. Ver si se envió el email
SELECT
  recipient_email,
  email_type,
  subject,
  sent_at,
  status,
  provider,
  error_message
FROM email_logs
ORDER BY sent_at DESC
LIMIT 1;

-- 5. Ver los últimos logs del webhook
SELECT
  event_type,
  payment_id,
  status,
  processed,
  error_message,
  created_at
FROM webhook_logs
ORDER BY created_at DESC
LIMIT 3;
