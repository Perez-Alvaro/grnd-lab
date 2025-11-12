import mockData from "./mockData.js";

const snapshot = JSON.parse(JSON.stringify(mockData));

const deepClone = (value) => JSON.parse(JSON.stringify(value));

export function resetMockData() {
  mockData.routines.splice(
    0,
    mockData.routines.length,
    ...snapshot.routines.map(deepClone),
  );
  mockData.sales.splice(
    0,
    mockData.sales.length,
    ...snapshot.sales.map(deepClone),
  );
  mockData.users.splice(
    0,
    mockData.users.length,
    ...snapshot.users.map(deepClone),
  );
}

export default resetMockData;
