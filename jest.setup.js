import "@testing-library/jest-dom";

class IntersectionObserverMock {
  constructor(callback) {
    this.callback = callback;
  }

  observe() {}

  unobserve() {}

  disconnect() {}
}

if (!global.IntersectionObserver) {
  global.IntersectionObserver = IntersectionObserverMock;
}
