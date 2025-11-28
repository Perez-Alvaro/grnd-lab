import { supabase } from '@/lib/supabase';
import { toUIObjective, toDBObjective } from '@/constants/objectives.js';
import pdfGeneratorService from '@/services/pdfGeneratorService.jsx';

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
        // Traer todas las rutinas (activas e inactivas) para el admin
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

      const formattedRoutine = formatRoutineFromDB(insertedProduct, insertedRoutine);

      // 3. Generar PDF automáticamente en background (no bloquea)
      pdfGeneratorService.generateAndUploadRoutinePDF(formattedRoutine).catch(err => {
        console.error('Error generating PDF in background:', err);
        // No lanzamos el error para no bloquear la creación de la rutina
      });

      return formattedRoutine;
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

      const formattedRoutine = formatRoutineFromDB(updatedProduct, updatedRoutine);

      // 3. Regenerar PDF automáticamente en background (no bloquea)
      pdfGeneratorService.regenerateRoutinePDF(formattedRoutine).catch(err => {
        console.error('Error regenerating PDF in background:', err);
        // No lanzamos el error para no bloquear la actualización de la rutina
      });

      return formattedRoutine;
    } catch (error) {
      console.error('Error updating routine:', error);
      throw error;
    }
  },

  async deleteRoutine(id) {
    try {
      // 1. Eliminar PDF del storage
      pdfGeneratorService.deletePDFFromStorage(id).catch(err => {
        console.error('Error deleting PDF from storage:', err);
        // No bloqueamos la eliminación de la rutina
      });

      // 2. Eliminar de la base de datos (la eliminación en cascada se encargará de eliminar la rutina)
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

  async toggleRoutineActive(id) {
    try {
      // 1. Obtener estado actual
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('active')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // 2. Toggle del estado
      const newActiveState = !product.active;

      const { data: updatedProduct, error: updateError } = await supabase
        .from('products')
        .update({ active: newActiveState })
        .eq('id', id)
        .select(`
          *,
          routines (*)
        `)
        .single();

      if (updateError) throw updateError;

      return formatRoutineFromDB(updatedProduct, updatedProduct.routines);
    } catch (error) {
      console.error('Error toggling routine active state:', error);
      throw error;
    }
  },

  // ===================================
  // VENTAS
  // ===================================

  async getSales() {
    try {
      // 1. Obtener ventas con sus productos
      const { data: sales, error: salesError } = await supabase
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

      if (salesError) throw salesError;

      if (!sales || sales.length === 0) {
        return [];
      }

      // 2. Obtener emails desde auth.users usando RPC
      const userIds = sales
        .map(sale => sale.user_id)
        .filter(id => id); // Filtrar nulls

      let emailMap = new Map();

      if (userIds.length > 0) {
        const { data: authUsers, error: rpcError } = await supabase.rpc('get_user_emails', {
          user_ids: userIds
        });

        if (rpcError) {
          console.warn('Error getting emails from auth.users, using fallback:', rpcError);
          // Fallback: usar user_email de la tabla sales
        } else if (authUsers) {
          authUsers.forEach(user => {
            emailMap.set(user.id, user.email);
          });
        }
      }

      // Helper: derivar plan desde metadata o precio
      const derivePlan = (product) => {
        if (product?.metadata?.plan) {
          return product.metadata.plan;
        }

        const price = parseFloat(product?.price || 0);
        if (price >= 17000) return 'Premium';
        if (price >= 12000) return 'Essential';
        return 'Basic';
      };

      // 3. Formatear ventas con emails
      return sales.map((sale) => {
        const firstItem = sale.sale_items[0];
        const product = firstItem?.products;

        // Prioridad: 1) auth.users (vía RPC), 2) user_email en sale (fallback)
        const email = emailMap.get(sale.user_id) || sale.user_email || '';

        return {
          id: sale.id,
          userEmail: email,
          routineId: firstItem?.product_id || null,
          plan: derivePlan(product),
          amount: parseFloat(sale.total_amount),
          date: sale.created_at.split('T')[0],
          status: sale.status,
        };
      });

    } catch (error) {
      console.error('Error fetching sales:', error);
      return [];
    }
  },

  // ===================================
  // USUARIOS (CLIENTES)
  // ===================================

  async getUsers() {
    try {
      // 1. Obtener profiles de clientes
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, role, created_at')
        .eq('role', 'customer')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      if (!profiles || profiles.length === 0) {
        return [];
      }

      // 2. Obtener emails desde auth.users usando RPC
      const userIds = profiles.map(p => p.id);

      const { data: authUsers, error: rpcError } = await supabase.rpc('get_user_emails', {
        user_ids: userIds
      });

      if (rpcError) {
        console.error('Error calling get_user_emails:', rpcError);
        throw rpcError;
      }

      // 3. Crear mapa de emails
      const emailMap = new Map();
      if (authUsers) {
        authUsers.forEach(user => {
          emailMap.set(user.id, user.email);
        });
      }

      // 4. Combinar profiles con emails
      return profiles.map(profile => ({
        id: profile.id,
        firstName: profile.first_name || 'Cliente',
        lastName: profile.last_name || '',
        email: emailMap.get(profile.id) || '',
        joined: profile.created_at,
      }));

    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
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
      const filePath = `images/routine-cover-${fileName}`;

      const { data, error } = await supabase.storage
        .from('multimedia')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('multimedia')
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
