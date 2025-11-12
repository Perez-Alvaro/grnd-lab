import { renderHook, act } from "@testing-library/react";
import RoutinePreview from "../components/Trainer/preview/RoutinePreview.jsx";
import { routines } from "../mock/mockData.js";
import resetMockData from "../mock/resetMockData.js";
import { render, screen, within } from "@testing-library/react";
import useRoutineEditor from "../hooks/useRoutineEditor.js";
import { PlanProvider } from "../context/PlanContext.jsx";

describe("Routine editor workflow", () => {
  beforeEach(() => {
    resetMockData();
  });

  test("metadata changes propagate to plan state", () => {
    const template = routines[0];
    const { result } = renderHook(() =>
      useRoutineEditor({
        template,
        templateId: template.id,
        existingTemplate: template,
      }),
    );

    act(() => {
      result.current.updateMetadata("name", "Nueva Rutina Test");
    });

    expect(result.current.plan.metadata.name).toBe("Nueva Rutina Test");

    const week = result.current.plan.weeks[0];
    const day = week.days[0];
    const exercise = day.exercises[0];

    act(() => {
      result.current.updateExerciseField(
        week.id,
        day.id,
        exercise.id,
        "rir",
        "1",
      );
      result.current.updateExerciseField(
        week.id,
        day.id,
        exercise.id,
        "tempo",
        "3-0-1",
      );
    });

    const updatedExercise = result.current.plan.weeks[0].days[0].exercises[0];
    expect(updatedExercise.rir).toBe("1");
    expect(updatedExercise.tempo).toBe("3-0-1");
  });

  test("preview renders advanced exercise metadata", () => {
    const template = routines[0];
    const { result } = renderHook(() =>
      useRoutineEditor({
        template,
        templateId: template.id,
        existingTemplate: template,
      }),
    );

    render(
      <PlanProvider value={{ plan: result.current.plan }}>
        <RoutinePreview />
      </PlanProvider>,
    );

    expect(
      screen.getByText(/superserie con press inclinado/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/90s/)).toBeInTheDocument();
    expect(screen.getByText(/3-0-1/)).toBeInTheDocument();
    const pressRow = screen
      .getAllByRole("row")
      .find((row) => within(row).queryByText(/press banca/i));
    expect(pressRow).toBeTruthy();
    expect(within(pressRow).getByText("1")).toBeInTheDocument();
    const videoLink = within(pressRow).getByRole("link", { name: /ver/i });
    expect(videoLink).toHaveAttribute(
      "href",
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    );
  });
});
