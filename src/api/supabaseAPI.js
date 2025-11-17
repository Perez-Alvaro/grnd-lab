import { supabase } from '@/lib/supabase';
import { toUIObjective, toDBObjective } from '@/constants/objectives.js';

// Helper para formatear rutinas desde Supabase al formato esperado por el frontend
const formatRoutineFromDB = (product, routine) => {
  if (!product || !routine) return null;

  return {
    id: product.id,
    name: product.name,
    title: product.name,
    genre: formatGender(routine.gender),
    gender: formatGender(routine.gender),
    objective: formatObjective(routine.objective),
    description: product.description,
    frequency: routine.frequency,
    durationWeeks: routine.duration_weeks,
    level: formatLevel(routine.level),
    price: parseFloat(product.price),
    image: product.image_url || '',
    tags: routine.tags || [],
    active: product.active,
    featured: product.featured,
    weeks: routine.weeks || [],
    days: extractDaysFromWeeks(routine.weeks),
    createdAt: product.created_at,
    updatedAt: product.updated_at,
  };
};

const formatGender = (gender) => {
  const genders = {
    male: 'Masculino',
    female: 'Femenino',
    unisex: 'Unisex',
    // Por compatibilidad con datos antiguos
    masculino: 'Masculino',
    femenino: 'Femenino',
  };
  return genders[gender] || 'Unisex';
};

const formatObjective = (objective) => {
  // Usar helper centralizado para conversión DB → UI
  return toUIObjective(objective);
};

const formatLevel = (level) => {
  const levels = {
    beginner: 'Inicial',
    intermediate: 'Intermedio',
    advanced: 'Avanzado',
  };
  return levels[level] || level;
};

const extractDaysFromWeeks = (weeks) => {
  if (!weeks || !Array.isArray(weeks) || weeks.length === 0) return [];
  // Extraer los días de la primera semana para compatibilidad
  return weeks[0]?.days || [];
};

// Helper para formatear rutina para insertar/actualizar en DB
const formatRoutineForDB = (routine) => {
  const product = {
    type: 'routine',
    name: routine.name || routine.title,
    slug: (routine.name || routine.title).toLowerCase().replace(/\s+/g, '-'),
    description: routine.description || '',
    price: routine.price || 0,
    active: routine.active !== undefined ? routine.active : true,
    featured: routine.featured || false,
    image_url: routine.image || null,
    // ❌ Removido tags - products NO tiene esta columna
  };

  const routineData = {
    gender: parseGender(routine.gender || routine.genre),
    objective: parseObjective(routine.objective),
    level: parseLevel(routine.level),
    frequency: routine.frequency || 3,
    duration_weeks: routine.durationWeeks || 4,
    weeks: routine.weeks || buildWeeksFromDays(routine.days),
    tags: routine.tags || [], // ✅ tags solo va en routines
  };

  return { product, routineData };
};

const parseGender = (gender) => {
  if (!gender) return 'unisex';
  const normalized = gender.toLowerCase();
  if (normalized.includes('masculino') || normalized === 'male') return 'male';
  if (normalized.includes('femenino') || normalized === 'female') return 'female';
  return 'unisex';
};

const parseObjective = (objective) => {
  // Usar helper centralizado para conversión UI → DB
  return toDBObjective(objective);
};

const parseLevel = (level) => {
  if (!level) return 'beginner';
  if (level.includes('Inicial')) return 'beginner';
  if (level.includes('Intermedio')) return 'intermediate';
  if (level.includes('Avanzado')) return 'advanced';
  return 'beginner';
};

const buildWeeksFromDays = (days) => {
  if (!days || days.length === 0) return [];
  return [
    {
      weekNumber: 1,
      title: 'Semana 1',
      summary: 'Programa de entrenamiento',
      notes: '',
      days: days,
    },
  ];
};

export const SupabaseAPI = {
  // ===================================
  // RUTINAS
  // ===================================

  async getRoutines() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          routines (*)
        `)
        .eq('type', 'routine')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // routines es un objeto, no un array (relación 1:1)
      return data.map((product) => {
        return formatRoutineFromDB(product, product.routines);
      }).filter(Boolean);
    } catch (error) {
      console.error('Error fetching routines:', error);
      throw error;
    }
  },

  async getRoutineById(id) {
    try {
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          *,
          routines (*)
        `)
        .eq('id', id)
        .eq('type', 'routine')
        .single();

      if (error) throw error;

      // routines es un objeto, no un array (relación 1:1)
      return formatRoutineFromDB(product, product.routines);
    } catch (error) {
      console.error('Error fetching routine:', error);
      throw error;
    }
  },

  async postRoutine(newRoutine) {
    try {
      const { product, routineData } = formatRoutineForDB(newRoutine);

      // 1. Insertar producto
      const { data: insertedProduct, error: productError } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

      if (productError) throw productError;

      // 2. Insertar detalles de rutina
      const { data: insertedRoutine, error: routineError } = await supabase
        .from('routines')
        .insert([{
          id: insertedProduct.id,
          ...routineData,
        }])
        .select()
        .single();

      if (routineError) throw routineError;

      return formatRoutineFromDB(insertedProduct, insertedRoutine);
    } catch (error) {
      console.error('Error creating routine:', error);
      throw error;
    }
  },

  async updateRoutine(id, payload) {
    try {
      const { product, routineData } = formatRoutineForDB(payload);

      // 1. Actualizar producto
      const { data: updatedProduct, error: productError } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()
        .single();

      if (productError) throw productError;

      // 2. Actualizar rutina
      const { data: updatedRoutine, error: routineError } = await supabase
        .from('routines')
        .update(routineData)
        .eq('id', id)
        .select()
        .single();

      if (routineError) throw routineError;

      return formatRoutineFromDB(updatedProduct, updatedRoutine);
    } catch (error) {
      console.error('Error updating routine:', error);
      throw error;
    }
  },

  async deleteRoutine(id) {
    try {
      // La eliminación en cascada se encargará de eliminar la rutina
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error deleting routine:', error);
      throw error;
    }
  },

  // ===================================
  // VENTAS
  // ===================================

  async getSales() {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          sale_items (
            *,
            products (
              id,
              name,
              type,
              price,
              metadata
            )
          )
        `)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Helper: derivar plan desde metadata o precio
      const derivePlan = (product) => {
        // 1. Intentar desde metadata
        if (product?.metadata?.plan) {
          return product.metadata.plan;
        }

        // 2. Derivar desde precio
        const price = parseFloat(product?.price || 0);
        if (price >= 17000) return 'Premium';
        if (price >= 12000) return 'Essential';
        return 'Basic';
      };

      // Formatear al formato esperado por el frontend
      return data.map((sale) => {
        const firstItem = sale.sale_items[0];
        const product = firstItem?.products;

        return {
          id: sale.id,
          userEmail: sale.user_email,
          routineId: firstItem?.product_id || null,
          plan: derivePlan(product),
          amount: parseFloat(sale.total_amount),
          date: sale.created_at.split('T')[0],
          status: sale.status,
        };
      });
    } catch (error) {
      console.error('Error fetching sales:', error);
      return []; // Devolver array vacío en caso de error para no romper la UI
    }
  },

  // ===================================
  // USUARIOS (CLIENTES)
  // ===================================

  async getUsers() {
    try {
      // Obtener perfiles de clientes
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'customer')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Obtener emails desde sales (donde sí tenemos user_email)
      const { data: sales, error: salesError } = await supabase
        .from('sales')
        .select('user_id, user_email')
        .not('user_id', 'is', null);

      if (salesError) {
        // Si falla, devolver perfiles sin emails
        return profiles.map((profile) => ({
          id: profile.id,
          firstName: profile.first_name || 'Cliente',
          lastName: profile.last_name || '',
          email: '',
          joined: profile.created_at,
        }));
      }

      // Crear mapa de user_id -> email (último email conocido)
      const emailMap = new Map();
      sales.forEach((sale) => {
        if (sale.user_id && sale.user_email) {
          emailMap.set(sale.user_id, sale.user_email);
        }
      });

      // Formatear usuarios con emails
      return profiles.map((profile) => ({
        id: profile.id,
        firstName: profile.first_name || 'Cliente',
        lastName: profile.last_name || '',
        email: emailMap.get(profile.id) || '',
        joined: profile.created_at,
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      return []; // Devolver array vacío en caso de error
    }
  },

  // ===================================
  // MÉTRICAS
  // ===================================

  async getMetrics() {
    try {
      // Obtener datos para calcular métricas
      const [sales, routines, users] = await Promise.all([
        this.getSales(),
        this.getRoutines(),
        this.getUsers(),
      ]);

      // Calcular métricas
      const totalIngresos = sales.reduce((sum, sale) => sum + sale.amount, 0);
      const totalUsuarios = users.length;
      const rutinasActivas = routines.filter((r) => r.active).length;

      // Calcular ventas del mes actual
      const now = new Date();
      const currentMonth = now.toISOString().slice(0, 7);
      const salesThisMonth = sales.filter((s) => s.date.startsWith(currentMonth));
      const ingresosMensuales = salesThisMonth.reduce((sum, sale) => sum + sale.amount, 0);
      const descargasMes = salesThisMonth.length;

      // Calcular mes anterior
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 7);
      const salesLastMonth = sales.filter((s) => s.date.startsWith(lastMonth));
      const ingresosAnteriores = salesLastMonth.reduce((sum, sale) => sum + sale.amount, 0);
      const descargasAnteriores = salesLastMonth.length;

      // Calcular variaciones
      const calculateVariation = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : null;
        return ((current - previous) / previous) * 100;
      };

      const variacionIngresos = calculateVariation(ingresosMensuales, ingresosAnteriores);
      const variacionDescargas = calculateVariation(descargasMes, descargasAnteriores);

      const ticketPromedio = sales.length > 0 ? totalIngresos / sales.length : 0;

      return {
        totalUsuarios,
        totalIngresos,
        ingresosMensuales,
        rutinasActivas,
        descargasMes,
        ticketPromedio,
        variacionIngresos,
        variacionDescargas,
        meses: {
          actual: currentMonth,
          anterior: lastMonth,
        },
      };
    } catch (error) {
      console.error('Error calculating metrics:', error);
      // Devolver métricas vacías en caso de error
      return {
        totalUsuarios: 0,
        totalIngresos: 0,
        ingresosMensuales: 0,
        rutinasActivas: 0,
        descargasMes: 0,
        ticketPromedio: 0,
        variacionIngresos: null,
        variacionDescargas: null,
        meses: {
          actual: null,
          anterior: null,
        },
      };
    }
  },

  // ===================================
  // UPLOAD DE IMÁGENES
  // ===================================

  async uploadImage(file) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `routine-images/${fileName}`;

      const { data, error } = await supabase.storage
        .from('public')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);

      return { url: publicUrl };
    } catch (error) {
      console.error('Error uploading image:', error);
      // Fallback a URL local si falla
      return { url: URL.createObjectURL(file) };
    }
  },
};

export default SupabaseAPI;
