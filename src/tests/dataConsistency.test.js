import { useEffect, useRef } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppProvider, useAppContext } from "../context/AppContext.jsx";
import ClientHome from "../pages/ClientHome.jsx";
import useRoutineSync from "../hooks/useRoutineSync.js";
import API from "../api/endpoints.js";
import mockData from "../mock/mockData.js";
import resetMockData from "../mock/resetMockData.js";

function RoutineCreator({ routine }) {
  const { state } = useAppContext();
  const { addRoutine } = useRoutineSync();
  const addedRef = useRef(false);

  useEffect(() => {
    if (!addedRef.current && state.routines.length > 0) {
      addedRef.current = true;
      addRoutine(routine);
    }
  }, [addRoutine, routine, state.routines.length]);

  return null;
}

describe("Routine synchronization", () => {
  beforeEach(() => {
    resetMockData();
    Element.prototype.scrollIntoView = jest.fn();
  });

  test("new routine is persisted and visible for clients", async () => {
    const newRoutine = {
      id: 9999,
      title: "Femenino Power Strength",
      name: "Femenino Power Strength",
      genre: "Femenino",
      gender: "Femenino",
      objective: "Pérdida de Grasa (Fuerza y Resistencia)",
      description: "Bloques híbridos orientados a potencia y definición.",
      durationWeeks: 5,
      days: [
        {
          id: "power-day-1",
          name: "Día 1 - Fuerza global",
          type: "ENTRENAMIENTO",
          exercises: [
            {
              id: "power-sentadilla",
              name: "Sentadilla frontal",
              sets: "4",
              reps: "8",
              rest: "90s",
              rir: "2",
              tempo: "2-0-1",
              video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              note: "Controlar la postura en la fase excéntrica",
            },
          ],
        },
      ],
      weeks: [
        {
          id: "power-week-1",
          title: "Semana 1",
          summary: "Introducción al ciclo de potencia",
          notes: "Registrar cargas máximas",
          days: [
            {
              id: "power-week-day-1",
              name: "Día 1 - Fuerza global",
              type: "ENTRENAMIENTO",
              recoveryNote: "Enfriar con estiramientos dinámicos",
              exercises: [
                {
                  id: "power-week-exercise-1",
                  name: "Sentadilla frontal",
                  sets: "4",
                  reps: "8",
                  rest: "90s",
                  rir: "2",
                  tempo: "2-0-1",
                  video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                  note: "Controlar la postura en la fase excéntrica",
                },
              ],
            },
          ],
        },
      ],
      tags: ["potencia", "definicion"],
      price: 17500,
      plan: "Premium",
      image: "",
    };

    render(
      <AppProvider>
        <RoutineCreator routine={newRoutine} />
        <ClientHome />
      </AppProvider>,
    );

    const genderButton = await screen.findByRole("button", {
      name: /femenino/i,
    });
    await userEvent.click(genderButton);

    const objectiveButton = await screen.findByRole("button", {
      name: /pérdida de grasa \(fuerza y resistencia\)/i,
    });
    await userEvent.click(objectiveButton);

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: newRoutine.title }),
      ).toBeInTheDocument(),
    );

    expect(
      mockData.routines.some((routine) => routine.id === newRoutine.id),
    ).toBe(true);

    const apiRoutine = await API.getRoutineById(newRoutine.id);
    expect(apiRoutine?.title).toBe(newRoutine.title);
  });
});
