import * as assert from "assert";
import AssertionError from "./interfaces/assertion-error";
import {
  TRUTHY,
  EQL_OP,
  STRICT_EQL_OP,
  DEEP_EQL_OP,
  NOT_EQL_OP,
  NOT_STRICT_EQL_OP,
  NOT_DEEP_EQL_OP
} from "./utils/op";

const findFailingLineNumberFromError = error => {
  const stack = error.stack;
  if (!stack) return "";
  const stackLines = stack.split("\n");
  for (const line of stackLines) {
    if (/.*(\.ts:\d+:\d+\))$/.test(line)) {
      return line;
    }
  }

  return stack;
};

export const assertTruthy = value => {
  try {
    assert.ok(value);
  } catch (error) {
    const assertionError: AssertionError = {
      actual: value,
      expected: TRUTHY,
      operator: TRUTHY,
      stack: findFailingLineNumberFromError(error)
    };
    throw assertionError;
  }
};

export const assertEqual = (firstArg, secondArg) => {
  try {
    assert.equal(firstArg, secondArg);
  } catch (error) {
    const assertionError: AssertionError = {
      actual: firstArg,
      expected: secondArg,
      operator: EQL_OP,
      stack: findFailingLineNumberFromError(error)
    };
    throw assertionError;
  }
};

export const assertStrictEqual = (firstArg, secondArg) => {
  try {
    assert.strictEqual(firstArg, secondArg);
  } catch (error) {
    const assertionError: AssertionError = {
      actual: firstArg,
      expected: secondArg,
      operator: STRICT_EQL_OP,
      stack: findFailingLineNumberFromError(error)
    };
    throw assertionError;
  }
};

export const assertDeepEqual = (firstArg, secondArg) => {
  try {
    assert.deepEqual(firstArg, secondArg);
  } catch (error) {
    const assertionError: AssertionError = {
      actual: firstArg,
      expected: secondArg,
      operator: DEEP_EQL_OP,
      stack: findFailingLineNumberFromError(error)
    };
    throw assertionError;
  }
};

export const assertNotEqual = (firstArg, secondArg) => {
  try {
    assert.notEqual(firstArg, secondArg);
  } catch (error) {
    const assertionError: AssertionError = {
      actual: firstArg,
      expected: secondArg,
      operator: NOT_EQL_OP,
      stack: findFailingLineNumberFromError(error)
    };
    throw assertionError;
  }
};

export const assertNotStrictEqual = (firstArg, secondArg) => {
  try {
    assert.notStrictEqual(firstArg, secondArg);
  } catch (error) {
    const assertionError: AssertionError = {
      actual: firstArg,
      expected: secondArg,
      operator: NOT_STRICT_EQL_OP,
      stack: findFailingLineNumberFromError(error)
    };
    throw assertionError;
  }
};

export const assertNotDeepEqual = (firstArg, secondArg) => {
  try {
    assert.notDeepEqual(firstArg, secondArg);
  } catch (error) {
    const assertionError: AssertionError = {
      actual: firstArg,
      expected: secondArg,
      operator: NOT_DEEP_EQL_OP,
      stack: findFailingLineNumberFromError(error)
    };
    throw assertionError;
  }
};
