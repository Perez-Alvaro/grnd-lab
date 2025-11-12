import { useCallback } from "react";
import API from "../api/endpoints.js";
import { useAppContext } from "../context/AppContext.jsx";

export default function useRoutineSync() {
  const { dispatch } = useAppContext();

  const persistRoutine = useCallback(
    async (payload, action) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const result = await action(payload);
        dispatch({ type: "SET_ERROR", payload: null });
        return result;
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: error });
        throw error;
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [dispatch],
  );

  const addRoutine = useCallback(
    async (routine) => {
      const persisted = await persistRoutine(routine, API.postRoutine);
      dispatch({ type: "ADD_ROUTINE", payload: persisted });
      return persisted;
    },
    [dispatch, persistRoutine],
  );

  const updateRoutine = useCallback(
    async (id, updates) => {
      const persisted = await persistRoutine({ id, updates }, (payload) =>
        API.updateRoutine(payload.id, payload.updates),
      );
      dispatch({ type: "UPDATE_ROUTINE", payload: persisted });
      return persisted;
    },
    [dispatch, persistRoutine],
  );

  return {
    addRoutine,
    updateRoutine,
  };
}
