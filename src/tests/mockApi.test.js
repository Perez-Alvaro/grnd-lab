import API from "../api/endpoints.js";
import mockData from "../mock/mockData.js";
import resetMockData from "../mock/resetMockData.js";

describe("Mock API endpoints", () => {
  beforeEach(() => {
    resetMockData();
  });

  test("fetches routines, sales and users", async () => {
    const routines = await API.getRoutines();
    const sales = await API.getSales();
    const users = await API.getUsers();

    expect(routines.length).toBe(mockData.routines.length);
    expect(sales.length).toBe(mockData.sales.length);
    expect(users.length).toBe(mockData.users.length);
  });

  test("creates and updates routines", async () => {
    const initialLength = mockData.routines.length;
    const created = await API.postRoutine({
      title: "Test Routine",
      name: "Test Routine",
      objective: "Volumen (Fuerza e Hipertrofia)",
      gender: "Masculino",
      weeks: [],
      days: [],
      price: 12345,
    });

    expect(mockData.routines.length).toBe(initialLength + 1);
    expect(created.id).toBeDefined();

    const updated = await API.updateRoutine(created.id, {
      price: 20000,
    });
    expect(updated.price).toBe(20000);

    const stored = mockData.routines.find(
      (routine) => routine.id === created.id,
    );
    expect(stored?.price).toBe(20000);
  });
});
