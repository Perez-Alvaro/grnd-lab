-- =====================================================
-- FITTER - SCHEMA COMPLETO DE BASE DE DATOS
-- Versión: 1.0
-- Fecha: 2025-01-14
-- Descripción: Schema completo con sistema de auditoría
-- =====================================================

-- =====================================================
-- 1. EXTENSIONES
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 2. TIPOS PERSONALIZADOS (ENUMS)
-- =====================================================

-- Tipo de usuario
CREATE TYPE user_role AS ENUM ('admin', 'customer');

-- Tipo de producto
CREATE TYPE product_type AS ENUM ('routine', 'book', 'bundle');

-- Estado de venta
CREATE TYPE sale_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Método de pago ESTO NO ES NECESARIO YA QUE SOLO SERA MERCADOPAGO O TRANSFERENCIA
CREATE TYPE payment_method AS ENUM ('mercadopago', 'transferencia');
-- CREATE TYPE payment_method AS ENUM ('mercadopago', 'stripe', 'manual');

-- Género de rutina
CREATE TYPE routine_gender AS ENUM ('male', 'female', 'unisex');

-- Objetivo de rutina
CREATE TYPE routine_objective AS ENUM ('muscle_gain', 'fat_loss', 'strength', 'endurance', 'mobility', 'general');

-- Nivel de rutina
CREATE TYPE routine_level AS ENUM ('beginner', 'intermediate', 'advanced');

-- Tipo de log
CREATE TYPE log_action AS ENUM ('user_login', 'user_logout', 'user_register', 'sale_created', 'sale_completed', 'download', 'email_sent', 'mfa_enabled', 'mfa_disabled', 'password_reset');

-- =====================================================
-- 3. TABLA: profiles (Extiende auth.users de Supabase)
-- =====================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'customer',
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  avatar_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);

-- =====================================================
-- 4. TABLA: products (Productos generales)
-- =====================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type product_type NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Índices
CREATE INDEX idx_products_type ON products(type);
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_featured ON products(featured);

-- =====================================================
-- 5. TABLA: routines (Detalles de rutinas)
-- =====================================================
CREATE TABLE routines (
  id UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
  gender routine_gender,
  objective routine_objective,
  level routine_level,
  frequency INTEGER CHECK (frequency > 0 AND frequency <= 7), -- días por semana
  duration_weeks INTEGER CHECK (duration_weeks > 0),
  weeks JSONB NOT NULL DEFAULT '[]'::jsonb, -- Estructura completa de la rutina
  tags TEXT[] DEFAULT '{}',
  video_intro_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_routines_gender ON routines(gender);
CREATE INDEX idx_routines_objective ON routines(objective);
CREATE INDEX idx_routines_level ON routines(level);
CREATE INDEX idx_routines_frequency ON routines(frequency);
CREATE INDEX idx_routines_tags ON routines USING GIN(tags);

-- =====================================================
-- 6. TABLA: books (Detalles de libros)
-- =====================================================
CREATE TABLE books (
  id UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
  author VARCHAR(255),
  pages INTEGER,
  format VARCHAR(20) DEFAULT 'pdf',
  file_size_mb DECIMAL(5,2),
  file_path TEXT NOT NULL, -- Ruta en Supabase Storage
  preview_url TEXT,
  table_of_contents JSONB,
  isbn VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_books_author ON books(author);

-- =====================================================
-- 7. TABLA: product_bundles (Combos de productos)
-- =====================================================
CREATE TABLE product_bundles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bundle_product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  included_product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  discount_percentage DECIMAL(5,2) DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(bundle_product_id, included_product_id)
);

-- Índices
CREATE INDEX idx_bundles_bundle_product ON product_bundles(bundle_product_id);

-- =====================================================
-- 8. TABLA: sales (Ventas)
-- =====================================================
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  user_email VARCHAR(255) NOT NULL, -- Por si compra sin registro
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  status sale_status NOT NULL DEFAULT 'pending',
  payment_method payment_method,
  payment_id VARCHAR(255), -- ID externo (Mercado Pago, Stripe, etc.)
  payment_data JSONB, -- Datos completos del pago
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Índices
CREATE INDEX idx_sales_user_id ON sales(user_id);
CREATE INDEX idx_sales_user_email ON sales(user_email);
CREATE INDEX idx_sales_status ON sales(status);
CREATE INDEX idx_sales_payment_id ON sales(payment_id);
CREATE INDEX idx_sales_created_at ON sales(created_at);

-- =====================================================
-- 9. TABLA: sale_items (Items de venta)
-- =====================================================
CREATE TABLE sale_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL, -- Snapshot del nombre
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
  discount DECIMAL(10,2) DEFAULT 0 CHECK (discount >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_sale_items_sale_id ON sale_items(sale_id);
CREATE INDEX idx_sale_items_product_id ON sale_items(product_id);

-- =====================================================
-- 10. TABLA: generated_files (PDFs generados)
-- =====================================================
CREATE TABLE generated_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_item_id UUID REFERENCES sale_items(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  file_path TEXT NOT NULL, -- Ruta en Supabase Storage
  file_url TEXT, -- URL firmada temporal
  file_size_kb INTEGER,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE, -- Cuándo expira la URL
  download_count INTEGER DEFAULT 0,
  last_downloaded_at TIMESTAMP WITH TIME ZONE
);

-- Índices
CREATE INDEX idx_generated_files_sale_item ON generated_files(sale_item_id);
CREATE INDEX idx_generated_files_product ON generated_files(product_id);
CREATE INDEX idx_generated_files_expires_at ON generated_files(expires_at);

-- =====================================================
-- 11. TABLA: downloads (Tracking de descargas)
-- =====================================================
CREATE TABLE downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  user_email VARCHAR(255),
  generated_file_id UUID REFERENCES generated_files(id) ON DELETE CASCADE,
  sale_id UUID REFERENCES sales(id),
  product_id UUID REFERENCES products(id),
  ip_address INET,
  user_agent TEXT,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_downloads_user_id ON downloads(user_id);
CREATE INDEX idx_downloads_user_email ON downloads(user_email);
CREATE INDEX idx_downloads_file_id ON downloads(generated_file_id);
CREATE INDEX idx_downloads_sale_id ON downloads(sale_id);
CREATE INDEX idx_downloads_product_id ON downloads(product_id);
CREATE INDEX idx_downloads_downloaded_at ON downloads(downloaded_at);

-- =====================================================
-- 12. TABLA: activity_logs (Logs de auditoría)
-- =====================================================
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  user_email VARCHAR(255),
  action log_action NOT NULL,
  entity_type VARCHAR(50), -- 'sale', 'product', 'user', etc.
  entity_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_entity_type ON activity_logs(entity_type);
CREATE INDEX idx_activity_logs_entity_id ON activity_logs(entity_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- =====================================================
-- 13. TABLA: email_logs (Tracking de emails)
-- =====================================================
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  recipient_email VARCHAR(255) NOT NULL,
  email_type VARCHAR(50) NOT NULL, -- 'purchase_confirmation', 'routine_delivery', etc.
  subject VARCHAR(255),
  template_name VARCHAR(100),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  provider VARCHAR(50), -- 'resend', 'sendgrid', etc.
  provider_id VARCHAR(255), -- ID del proveedor
  status VARCHAR(50) DEFAULT 'sent', -- 'sent', 'delivered', 'bounced', 'failed'
  metadata JSONB,
  sale_id UUID REFERENCES sales(id),
  error_message TEXT
);

-- Índices
CREATE INDEX idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX idx_email_logs_type ON email_logs(email_type);
CREATE INDEX idx_email_logs_sale_id ON email_logs(sale_id);
CREATE INDEX idx_email_logs_sent_at ON email_logs(sent_at);
-- =====================================================
-- FITTER - FIX PARA RLS RECURSIVAS (DESDE PASO 14)
-- Versión: 1.1
-- Fecha: 2025-01-15
-- Descripción: Corrección completa de políticas RLS recursivas
-- =====================================================

-- IMPORTANTE: Este archivo reemplaza TODO desde el paso 14 en adelante
-- Si ya ejecutaste el schema hasta el paso 13, ejecuta este archivo para corregir RLS

-- =====================================================
-- PASO 14A: FUNCIÓN HELPER PARA EVITAR RECURSIÓN
-- =====================================================

-- Esta función es la CLAVE para evitar recursión infinita
-- Se ejecuta con SECURITY DEFINER para poder leer profiles sin problemas
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- CRÍTICO: Asignar owner a postgres para que funcione correctamente
ALTER FUNCTION public.is_admin() OWNER TO postgres;

-- =====================================================
-- PASO 14B: FUNCIONES Y TRIGGERS
-- =====================================================

-- Función: Actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at en todas las tablas necesarias
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_routines_updated_at
  BEFORE UPDATE ON routines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_updated_at
  BEFORE UPDATE ON sales
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función: Crear profile automáticamente al registrarse
CREATE OR REPLACE FUNCTION create_profile_on_signup()
RETURNS TRIGGER
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, first_name, last_name)
  VALUES (
    NEW.id,
    'customer', -- Por defecto todos son customers
    COALESCE(NEW.raw_user_meta_data->>'first_name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'last_name', NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Asegurar owner para evitar problemas con RLS
ALTER FUNCTION create_profile_on_signup() OWNER TO postgres;

-- Trigger: Crear profile al registrarse en auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_profile_on_signup();

-- Función: Actualizar contador de descargas
CREATE OR REPLACE FUNCTION increment_download_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE generated_files
  SET download_count = download_count + 1,
      last_downloaded_at = NOW()
  WHERE id = NEW.generated_file_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Incrementar contador al insertar descarga
CREATE TRIGGER on_download_increment
  AFTER INSERT ON downloads
  FOR EACH ROW EXECUTE FUNCTION increment_download_count();

-- Función: Logging automático de ventas completadas
CREATE OR REPLACE FUNCTION log_sale_completed()
RETURNS TRIGGER
SECURITY DEFINER
AS $$
BEGIN
  -- Solo insertar log si el status cambió a 'completed'
  IF NEW.status = 'completed' AND OLD.status IS DISTINCT FROM 'completed' THEN
    INSERT INTO public.activity_logs (user_id, user_email, action, entity_type, entity_id, details)
    VALUES (
      NEW.user_id,
      NEW.user_email,
      'sale_completed',
      'sale',
      NEW.id,
      jsonb_build_object(
        'total_amount', NEW.total_amount,
        'payment_method', NEW.payment_method,
        'payment_id', NEW.payment_id
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Asegurar owner para permitir insert en activity_logs
ALTER FUNCTION log_sale_completed() OWNER TO postgres;

-- Trigger: Solo se dispara cuando cambia el status (optimizado)
DROP TRIGGER IF EXISTS on_sale_completed ON sales;
CREATE TRIGGER on_sale_completed
  AFTER UPDATE OF status ON sales
  FOR EACH ROW
  WHEN (NEW.status = 'completed' AND OLD.status IS DISTINCT FROM 'completed')
  EXECUTE FUNCTION log_sale_completed();

-- =====================================================
-- PASO 15: ROW LEVEL SECURITY (RLS) - SIN RECURSIÓN
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS PARA: PROFILES
-- =====================================================

-- Eliminar políticas viejas si existen
DROP POLICY IF EXISTS "Usuarios pueden ver su propio perfil" ON profiles;
DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON profiles;
DROP POLICY IF EXISTS "Admins pueden ver todos los perfiles" ON profiles;
DROP POLICY IF EXISTS "Admins gestionan perfiles" ON profiles;

-- Usuario puede ver su propio perfil
CREATE POLICY "Usuarios pueden ver su propio perfil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Usuario puede actualizar su propio perfil
CREATE POLICY "Usuarios pueden actualizar su propio perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins pueden ver todos los perfiles (usa is_admin() - SIN RECURSIÓN)
CREATE POLICY "Admins pueden ver todos los perfiles"
  ON profiles FOR SELECT
  USING (public.is_admin());

-- Admins pueden gestionar todos los perfiles (INSERT/UPDATE/DELETE)
CREATE POLICY "Admins gestionan perfiles"
  ON profiles FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- POLÍTICAS PARA: PRODUCTS
-- =====================================================

DROP POLICY IF EXISTS "Productos activos son públicos" ON products;
DROP POLICY IF EXISTS "Admins pueden gestionar productos" ON products;

-- Productos activos son visibles públicamente (catálogo)
CREATE POLICY "Productos activos son públicos"
  ON products FOR SELECT
  USING (active = true);

-- Admins pueden gestionar productos
CREATE POLICY "Admins pueden gestionar productos"
  ON products FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- POLÍTICAS PARA: ROUTINES (CONTENIDO PROTEGIDO)
-- =====================================================

DROP POLICY IF EXISTS "Rutinas activas son públicas" ON routines;
DROP POLICY IF EXISTS "Admins pueden gestionar rutinas" ON routines;
DROP POLICY IF EXISTS "Rutinas: acceso solo si comprado o admin" ON routines;

-- Solo pueden ver rutinas: admins O usuarios que la compraron
CREATE POLICY "Rutinas: acceso solo si comprado o admin"
  ON routines FOR SELECT
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM sale_items si
      JOIN sales s ON s.id = si.sale_id
      WHERE si.product_id = routines.id
        AND s.user_id = auth.uid()
        AND s.status = 'completed'
    )
  );

-- Admins pueden gestionar rutinas
CREATE POLICY "Admins pueden gestionar rutinas"
  ON routines FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- POLÍTICAS PARA: BOOKS (CONTENIDO PROTEGIDO)
-- =====================================================

DROP POLICY IF EXISTS "Libros activos son públicos (metadata)" ON books;
DROP POLICY IF EXISTS "Admins pueden gestionar libros" ON books;
DROP POLICY IF EXISTS "Books: acceso solo si comprado o admin" ON books;

-- Solo pueden ver books: admins O usuarios que lo compraron
CREATE POLICY "Books: acceso solo si comprado o admin"
  ON books FOR SELECT
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM sale_items si
      JOIN sales s ON s.id = si.sale_id
      WHERE si.product_id = books.id
        AND s.user_id = auth.uid()
        AND s.status = 'completed'
    )
  );

-- Admins pueden gestionar libros
CREATE POLICY "Admins pueden gestionar libros"
  ON books FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- POLÍTICAS PARA: PRODUCT_BUNDLES
-- =====================================================

DROP POLICY IF EXISTS "Admins pueden gestionar bundles" ON product_bundles;

-- Solo admins gestionan bundles
CREATE POLICY "Admins pueden gestionar bundles"
  ON product_bundles FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =====================================================
-- POLÍTICAS PARA: SALES
-- =====================================================

DROP POLICY IF EXISTS "Usuarios pueden ver sus propias ventas" ON sales;
DROP POLICY IF EXISTS "Admins pueden ver todas las ventas" ON sales;

-- Usuarios ven sus propias ventas
CREATE POLICY "Usuarios pueden ver sus propias ventas"
  ON sales FOR SELECT
  USING (auth.uid() = user_id);

-- Admins ven todas las ventas
CREATE POLICY "Admins pueden ver todas las ventas"
  ON sales FOR SELECT
  USING (public.is_admin());

-- =====================================================
-- POLÍTICAS PARA: SALE_ITEMS
-- =====================================================

DROP POLICY IF EXISTS "Usuarios pueden ver items de sus ventas" ON sale_items;
DROP POLICY IF EXISTS "Admins pueden ver todos los items" ON sale_items;

-- Usuarios ven items de sus propias ventas
CREATE POLICY "Usuarios pueden ver items de sus ventas"
  ON sale_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sales s
      WHERE s.id = sale_items.sale_id
        AND s.user_id = auth.uid()
    )
  );

-- Admins ven todos los items
CREATE POLICY "Admins pueden ver todos los items"
  ON sale_items FOR SELECT
  USING (public.is_admin());

-- =====================================================
-- POLÍTICAS PARA: GENERATED_FILES
-- =====================================================

DROP POLICY IF EXISTS "Usuarios pueden ver archivos de sus compras" ON generated_files;
DROP POLICY IF EXISTS "Admins pueden ver todos los archivos" ON generated_files;

-- Usuarios ven archivos de productos que compraron
CREATE POLICY "Usuarios pueden ver archivos de sus compras"
  ON generated_files FOR SELECT
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM sale_items si
      JOIN sales s ON s.id = si.sale_id
      WHERE (si.id = generated_files.sale_item_id OR si.product_id = generated_files.product_id)
        AND s.user_id = auth.uid()
        AND s.status = 'completed'
    )
  );

-- =====================================================
-- POLÍTICAS PARA: DOWNLOADS
-- =====================================================

DROP POLICY IF EXISTS "Usuarios pueden ver su historial de descargas" ON downloads;
DROP POLICY IF EXISTS "Usuarios pueden registrar sus descargas" ON downloads;
DROP POLICY IF EXISTS "Admins pueden ver todas las descargas" ON downloads;

-- Usuarios ven su historial de descargas
CREATE POLICY "Usuarios pueden ver su historial de descargas"
  ON downloads FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- Usuarios pueden registrar descargas (solo si es su user_id)
CREATE POLICY "Usuarios pueden registrar sus descargas"
  ON downloads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- POLÍTICAS PARA: ACTIVITY_LOGS
-- =====================================================

DROP POLICY IF EXISTS "Admins pueden ver todos los logs" ON activity_logs;
DROP POLICY IF EXISTS "Admins pueden insertar logs (opc)" ON activity_logs;

-- Solo admins pueden ver logs
CREATE POLICY "Admins pueden ver todos los logs"
  ON activity_logs FOR SELECT
  USING (public.is_admin());

-- Permitir INSERT desde triggers (con SECURITY DEFINER)
-- No necesitamos política INSERT explícita porque los triggers usan SECURITY DEFINER

-- =====================================================
-- POLÍTICAS PARA: EMAIL_LOGS
-- =====================================================

DROP POLICY IF EXISTS "Admins pueden ver todos los emails" ON email_logs;

-- Solo admins pueden ver logs de emails
CREATE POLICY "Admins pueden ver todos los emails"
  ON email_logs FOR SELECT
  USING (public.is_admin());

-- =====================================================
-- PASO 16: VISTAS ÚTILES
-- =====================================================

-- Vista: Ventas con detalles completos
DROP VIEW IF EXISTS sales_detailed;
CREATE VIEW sales_detailed AS
SELECT
  s.id,
  s.user_id,
  s.user_email,
  p.first_name,
  p.last_name,
  s.total_amount,
  s.status,
  s.payment_method,
  s.payment_id,
  s.created_at,
  s.completed_at,
  COUNT(si.id) AS items_count,
  json_agg(
    json_build_object(
      'product_name', si.product_name,
      'quantity', si.quantity,
      'unit_price', si.unit_price,
      'subtotal', si.subtotal
    )
  ) AS items
FROM sales s
LEFT JOIN profiles p ON p.id = s.user_id
LEFT JOIN sale_items si ON si.sale_id = s.id
GROUP BY s.id, p.first_name, p.last_name;

-- Vista: Productos más vendidos
DROP VIEW IF EXISTS top_selling_products;
CREATE VIEW top_selling_products AS
SELECT
  p.id,
  p.name,
  p.type,
  p.price,
  COUNT(si.id) AS total_sales,
  SUM(si.subtotal) AS total_revenue
FROM products p
JOIN sale_items si ON si.product_id = p.id
JOIN sales s ON s.id = si.sale_id
WHERE s.status = 'completed'
GROUP BY p.id
ORDER BY total_sales DESC;

-- Vista: Estadísticas de descargas por producto
DROP VIEW IF EXISTS download_stats;
CREATE VIEW download_stats AS
SELECT
  p.id AS product_id,
  p.name AS product_name,
  p.type AS product_type,
  COUNT(DISTINCT d.user_id) AS unique_users,
  COUNT(d.id) AS total_downloads,
  MAX(d.downloaded_at) AS last_download
FROM products p
LEFT JOIN downloads d ON d.product_id = p.id
GROUP BY p.id;

-- =====================================================
-- PASO 17: COMENTARIOS
-- =====================================================

COMMENT ON TABLE profiles IS 'Perfiles de usuarios (extiende auth.users)';
COMMENT ON TABLE products IS 'Productos generales (rutinas, libros, combos)';
COMMENT ON TABLE routines IS 'Detalles específicos de rutinas de entrenamiento';
COMMENT ON TABLE books IS 'Detalles específicos de libros digitales';
COMMENT ON TABLE sales IS 'Ventas realizadas (transacciones)';
COMMENT ON TABLE sale_items IS 'Items individuales de cada venta';
COMMENT ON TABLE generated_files IS 'Archivos PDF generados para entregas';
COMMENT ON TABLE downloads IS 'Tracking completo de todas las descargas';
COMMENT ON TABLE activity_logs IS 'Logs de auditoría de todas las acciones del sistema';
COMMENT ON TABLE email_logs IS 'Tracking de todos los emails enviados';

COMMENT ON FUNCTION is_admin() IS 'Helper function para verificar si el usuario actual es admin (evita recursión RLS)';

-- =====================================================
-- FIN DEL FIX
-- =====================================================

-- ✅ SCHEMA CORREGIDO - SIN RECURSIÓN RLS
