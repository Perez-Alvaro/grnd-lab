import {
  mockStore,
  buildMockMetrics,
} from "@/mock/mockData.js";

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

const clone = (value) => JSON.parse(JSON.stringify(value));

export const API = {
  async getRoutines() {
    await delay();
    return clone(mockStore.routines);
  },
  async getRoutineById(id) {
    await delay();
    return clone(
      mockStore.routines.find((routine) => String(routine.id) === String(id)),
    );
  },
  async postRoutine(newRoutine) {
    await delay();
    const now = new Date().toISOString();
    const routine = {
      ...newRoutine,
      id: newRoutine.id ?? Date.now(),
      createdAt: newRoutine.createdAt ?? now,
      updatedAt: now,
    };
    mockStore.routines.push(clone(routine));
    return clone(routine);
  },
  async updateRoutine(id, payload) {
    await delay();
    const index = mockStore.routines.findIndex(
      (routine) => String(routine.id) === String(id),
    );
    if (index === -1) {
      throw new Error("Routine not found");
    }
    const updated = {
      ...mockStore.routines[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    mockStore.routines[index] = clone(updated);
    return clone(updated);
  },
  async getSales() {
    await delay();
    return clone(mockStore.sales);
  },
  async getUsers() {
    await delay();
    return clone(mockStore.users);
  },
  async getMetrics() {
    await delay();
    return buildMockMetrics(
      mockStore.sales,
      mockStore.routines,
      mockStore.users,
    );
  },
  async uploadImage(file) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ url: URL.createObjectURL(file) });
      }, 500);
    });
  },
};

export default API;
