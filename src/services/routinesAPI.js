/**
 * API Service para interactuar con el backend de rutinas
 * Proporciona métodos para CRUD de rutinas almacenadas en SQLite
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Helper para manejar respuestas de la API
 */
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.message || error.error || 'Error en la petición');
  }
  return response.json();
}

/**
 * Servicio de API para rutinas
 */
export const routinesAPI = {
  /**
   * Obtener todas las rutinas con filtros opcionales
   * @param {Object} params - Parámetros de filtrado
   * @param {string} params.nivel - Nivel de la rutina
   * @param {string} params.equipamiento - Equipamiento necesario
   * @param {string} params.search - Texto de búsqueda
   * @param {number} params.limit - Límite de resultados
   * @param {number} params.offset - Offset para paginación
   */
  async getAll(params = {}) {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });

    const url = `${API_BASE_URL}/routines${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  /**
   * Obtener una rutina por ID
   * @param {string} id - ID de la rutina
   */
  async getById(id) {
    const response = await fetch(`${API_BASE_URL}/routines/${id}`);
    return handleResponse(response);
  },

  /**
   * Crear una nueva rutina
   * @param {Object} routineData - Datos de la rutina
   */
  async create(routineData) {
    const response = await fetch(`${API_BASE_URL}/routines`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(routineData),
    });
    return handleResponse(response);
  },

  /**
   * Actualizar una rutina existente
   * @param {string} id - ID de la rutina
   * @param {Object} routineData - Datos actualizados
   */
  async update(id, routineData) {
    const response = await fetch(`${API_BASE_URL}/routines/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(routineData),
    });
    return handleResponse(response);
  },

  /**
   * Eliminar una rutina
   * @param {string} id - ID de la rutina
   */
  async delete(id) {
    const response = await fetch(`${API_BASE_URL}/routines/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  /**
   * Duplicar una rutina existente
   * @param {string} id - ID de la rutina a duplicar
   */
  async duplicate(id) {
    const response = await fetch(`${API_BASE_URL}/routines/${id}/duplicate`, {
      method: 'POST',
    });
    return handleResponse(response);
  },

  /**
   * Guardar una rutina (crear o actualizar según si tiene ID)
   * @param {Object} routineData - Datos de la rutina
   */
  async save(routineData) {
    if (routineData.id) {
      // Si tiene ID, actualizar
      return this.update(routineData.id, routineData);
    } else {
      // Si no tiene ID, crear
      return this.create(routineData);
    }
  },

  /**
   * Verificar si el servidor está disponible
   */
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },
};

export default routinesAPI;
