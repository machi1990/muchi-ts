import * as assert from "assert";
/**
 * Add more here.
 * - error assertion
 *  etc
 */
interface AssertionError {
  actual: any;
  expected: any;
  operator: string;
}

export const assertTruthy = value => {
  try {
    assert.ok(value);
  } catch (error) {
    const assertionError: AssertionError = {
      actual: value,
      expected: "truthy",
      operator: "truthy"
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
      operator: "=="
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
      operator: "==="
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
      operator: "deepEqual"
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
      operator: "!=="
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
      operator: "!==="
    };
    throw assertionError;
  }
};

export const assertNotDeepEqual = (firstArg, secondArg) => {
  try {
    assert.assertNotDeepEqual(firstArg, secondArg);
  } catch (error) {
    const assertionError: AssertionError = {
      actual: firstArg,
      expected: secondArg,
      operator: "notDeepEqual"
    };
    throw assertionError;
  }
};
