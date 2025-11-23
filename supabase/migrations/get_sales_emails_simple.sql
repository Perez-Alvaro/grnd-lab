-- ============================================================================
-- FUNCIÓN SIMPLE: Obtener emails únicos de ventas
-- ============================================================================
-- Esta función obtiene solo los emails de sales (donde se envían las rutinas)
-- Es la forma más simple y directa de obtener emails de clientes
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_sales_emails()
RETURNS TABLE (email TEXT)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT DISTINCT user_email as email
  FROM public.sales
  WHERE user_email IS NOT NULL
    AND user_email != ''
  ORDER BY user_email;
$$;

-- Dar permisos
GRANT EXECUTE ON FUNCTION public.get_sales_emails() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_sales_emails() TO anon;

-- ============================================================================
-- EJEMPLO DE USO
-- ============================================================================
-- SELECT * FROM public.get_sales_emails();
--
-- Resultado:
-- | email                      |
-- |----------------------------|
-- | cliente1@gmail.com        |
-- | cliente2@yahoo.com        |
-- | usuario.oauth@gmail.com   |
