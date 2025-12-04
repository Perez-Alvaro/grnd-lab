import { useCallback } from "react";
import { useAppContext } from "../context/AppContext.jsx";

const createId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

export default function useRoutineSync() {
  const { dispatch } = useAppContext();

  const addRoutine = useCallback(
    async (routine) => {
      const newRoutine = {
        ...routine,
        id: routine.id || createId(),
        createdAt: routine.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      dispatch({ type: "ADD_ROUTINE", payload: newRoutine });
      return newRoutine;
    },
    [dispatch],
  );

  const updateRoutine = useCallback(
    async (id, updates) => {
      const updatedRoutine = {
        ...updates,
        id,
        updatedAt: new Date().toISOString(),
      };
      
      dispatch({ type: "UPDATE_ROUTINE", payload: updatedRoutine });
      return updatedRoutine;
    },
    [dispatch],
  );

  const deleteRoutine = useCallback(
    async (id) => {
      dispatch({ type: "DELETE_ROUTINE", payload: id });
      return { success: true };
    },
    [dispatch],
  );

  const toggleRoutineActive = useCallback(
    async (routine) => {
      const updated = {
        ...routine,
        active: !routine.active,
        updatedAt: new Date().toISOString(),
      };
      
      dispatch({ type: "UPDATE_ROUTINE", payload: updated });
      return updated;
    },
    [dispatch],
  );

  return {
    addRoutine,
    updateRoutine,
    deleteRoutine,
    toggleRoutineActive,
  };
}
