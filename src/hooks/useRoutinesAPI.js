/**
 * Hook personalizado para interactuar con la API de rutinas
 * Proporciona estado y métodos para CRUD de rutinas
 */

import { useState, useEffect, useCallback } from 'react';
import { routinesAPI } from '../services/routinesAPI';

export function useRoutinesAPI() {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serverAvailable, setServerAvailable] = useState(false);

  // Verificar si el servidor está disponible
  const checkServer = useCallback(async () => {
    const available = await routinesAPI.healthCheck();
    setServerAvailable(available);
    return available;
  }, []);

  // Cargar todas las rutinas
  const loadRoutines = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await routinesAPI.getAll(params);
      setRoutines(result.data);
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar rutinas:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener una rutina por ID
  const getRoutine = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await routinesAPI.getById(id);
      return result.data;
    } catch (err) {
      setError(err.message);
      console.error('Error al obtener rutina:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Guardar rutina (crear o actualizar)
  const saveRoutine = useCallback(async (routineData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await routinesAPI.save(routineData);
      
      // Actualizar estado local
      if (routineData.id) {
        // Actualizar existente
        setRoutines(prev => 
          prev.map(r => r.id === routineData.id ? result.data : r)
        );
      } else {
        // Agregar nueva
        setRoutines(prev => [result.data, ...prev]);
      }
      
      return result.data;
    } catch (err) {
      setError(err.message);
      console.error('Error al guardar rutina:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar rutina
  const deleteRoutine = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await routinesAPI.delete(id);
      
      // Actualizar estado local
      setRoutines(prev => prev.filter(r => r.id !== id));
      
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error al eliminar rutina:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Duplicar rutina
  const duplicateRoutine = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await routinesAPI.duplicate(id);
      
      // Agregar duplicado al estado local
      setRoutines(prev => [result.data, ...prev]);
      
      return result.data;
    } catch (err) {
      setError(err.message);
      console.error('Error al duplicar rutina:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificar servidor al montar
  useEffect(() => {
    checkServer();
  }, [checkServer]);

  return {
    // Estado
    routines,
    loading,
    error,
    serverAvailable,
    
    // Métodos
    loadRoutines,
    getRoutine,
    saveRoutine,
    deleteRoutine,
    duplicateRoutine,
    checkServer,
  };
}
