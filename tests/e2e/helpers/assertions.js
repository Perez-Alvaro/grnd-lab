/**
 * tests/e2e/helpers/assertions.js
 * Assertion utilities for opaque-box E2E test suite.
 */

export class AssertionError extends Error {
  constructor(message, actual, expected) {
    super(message);
    this.name = 'AssertionError';
    this.actual = actual;
    this.expected = expected;
  }
}

export function assert(condition, message = 'Assertion failed') {
  if (!condition) {
    throw new AssertionError(message, condition, true);
  }
}

export function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    const msg = message || `Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`;
    throw new AssertionError(msg, actual, expected);
  }
}

export function assertNotEqual(actual, expected, message) {
  if (actual === expected) {
    const msg = message || `Expected actual not to equal ${JSON.stringify(expected)}`;
    throw new AssertionError(msg, actual, expected);
  }
}

export function assertDeepEqual(actual, expected, message) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    const msg = message || `Deep equality mismatch:\nActual:   ${actualStr}\nExpected: ${expectedStr}`;
    throw new AssertionError(msg, actual, expected);
  }
}

export function assertMatches(str, regex, message) {
  if (typeof str !== 'string' || !regex.test(str)) {
    const msg = message || `Expected string to match ${regex}:\nReceived: "${str ? str.slice(0, 150) : ''}..."`;
    throw new AssertionError(msg, str, regex.toString());
  }
}

export function assertNotMatches(str, regex, message) {
  if (typeof str === 'string' && regex.test(str)) {
    const match = str.match(regex);
    const msg = message || `Expected string NOT to match ${regex}, but matched: "${match ? match[0] : ''}"`;
    throw new AssertionError(msg, str, `Not matching ${regex}`);
  }
}

export function assertIncludes(container, item, message) {
  if (!container || (typeof container.includes === 'function' && !container.includes(item))) {
    const msg = message || `Expected ${JSON.stringify(container)} to include ${JSON.stringify(item)}`;
    throw new AssertionError(msg, container, item);
  }
}

export function assertNotIncludes(container, item, message) {
  if (container && typeof container.includes === 'function' && container.includes(item)) {
    const msg = message || `Expected ${JSON.stringify(container)} NOT to include ${JSON.stringify(item)}`;
    throw new AssertionError(msg, container, item);
  }
}

export function assertThrows(fn, message) {
  let threw = false;
  let caughtError = null;
  try {
    fn();
  } catch (err) {
    threw = true;
    caughtError = err;
  }
  if (!threw) {
    throw new AssertionError(message || 'Expected function to throw an error, but it did not.', null, Error);
  }
  return caughtError;
}

export async function assertThrowsAsync(asyncFn, message) {
  let threw = false;
  let caughtError = null;
  try {
    await asyncFn();
  } catch (err) {
    threw = true;
    caughtError = err;
  }
  if (!threw) {
    throw new AssertionError(message || 'Expected async function to throw an error, but it did not.', null, Error);
  }
  return caughtError;
}
