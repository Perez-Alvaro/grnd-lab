import mockData from "../mock/mockData.js";

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

export const API = {
  async getRoutines() {
    await delay();
    return [...mockData.routines];
  },
  async getRoutineById(id) {
    await delay();
    return mockData.routines.find(
      (routine) => String(routine.id) === String(id),
    );
  },
  async postRoutine(newRoutine) {
    await delay();
    const routine = {
      ...newRoutine,
      id: newRoutine.id ?? Date.now(),
    };
    mockData.routines.push(routine);
    return routine;
  },
  async updateRoutine(id, payload) {
    await delay();
    const index = mockData.routines.findIndex(
      (routine) => String(routine.id) === String(id),
    );
    if (index === -1) {
      throw new Error("Routine not found");
    }
    const updated = { ...mockData.routines[index], ...payload };
    mockData.routines[index] = updated;
    return updated;
  },
  async getSales() {
    await delay();
    return [...mockData.sales];
  },
  async getUsers() {
    await delay();
    return [...mockData.users];
  },
};

export default API;
