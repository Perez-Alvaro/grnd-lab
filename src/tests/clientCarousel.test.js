import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ClientHome from "../pages/ClientHome.jsx";
import { AppProvider } from "../context/AppContext.jsx";
import resetMockData from "../mock/resetMockData.js";
import { routines } from "../mock/mockData.js";

describe("Client routine carousel", () => {
  beforeEach(() => {
    resetMockData();
    Element.prototype.scrollIntoView = jest.fn();
  });

  test("renders routines filtered by gender and objective", async () => {
    const routine = routines[0];
    render(
      <AppProvider>
        <ClientHome />
      </AppProvider>,
    );

    const genderButton = await screen.findByRole("button", {
      name: /masculino/i,
    });
    await userEvent.click(genderButton);

    const objectiveButton = await screen.findByRole("button", {
      name: /volumen \(fuerza e hipertrofia\)/i,
    });
    await userEvent.click(objectiveButton);

    const previewButton = await screen.findByRole("button", {
      name: /ver vista previa/i,
    });
    expect(previewButton).toBeInTheDocument();

    await userEvent.click(previewButton);

    await waitFor(() =>
      expect(screen.getAllByText(routine.title).length).toBeGreaterThan(0),
    );

    expect(screen.getAllByText(routine.description).length).toBeGreaterThan(0);

    const selectButton = screen.getByRole("button", {
      name: /seleccionar rutina/i,
    });
    await userEvent.click(selectButton);

    await waitFor(() =>
      expect(
        screen.getAllByText(new RegExp(routine.price.toLocaleString("es-AR")))
          .length,
      ).toBeGreaterThan(0),
    );
  });
});
