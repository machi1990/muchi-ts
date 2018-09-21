"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
exports.assertTruthy = function(value) {
  try {
    assert.ok(value);
  } catch (error) {
    var assertionError = {
      actual: value,
      expected: "truthy",
      operator: "truthy"
    };
    throw assertionError;
  }
};
exports.assertEqual = function(firstArg, secondArg) {
  try {
    assert.equal(firstArg, secondArg);
  } catch (error) {
    var assertionError = {
      actual: firstArg,
      expected: secondArg,
      operator: "=="
    };
    throw assertionError;
  }
};
exports.assertStrictEqual = function(firstArg, secondArg) {
  try {
    assert.strictEqual(firstArg, secondArg);
  } catch (error) {
    var assertionError = {
      actual: firstArg,
      expected: secondArg,
      operator: "==="
    };
    throw assertionError;
  }
};
exports.assertDeepEqual = function(firstArg, secondArg) {
  try {
    assert.deepEqual(firstArg, secondArg);
  } catch (error) {
    var assertionError = {
      actual: firstArg,
      expected: secondArg,
      operator: "deepEqual"
    };
    throw assertionError;
  }
};
exports.assertNotEqual = function(firstArg, secondArg) {
  try {
    assert.notEqual(firstArg, secondArg);
  } catch (error) {
    var assertionError = {
      actual: firstArg,
      expected: secondArg,
      operator: "!=="
    };
    throw assertionError;
  }
};
exports.assertNotStrictEqual = function(firstArg, secondArg) {
  try {
    assert.notStrictEqual(firstArg, secondArg);
  } catch (error) {
    var assertionError = {
      actual: firstArg,
      expected: secondArg,
      operator: "!==="
    };
    throw assertionError;
  }
};
exports.assertNotDeepEqual = function(firstArg, secondArg) {
  try {
    assert.notDeepEqual(firstArg, secondArg);
  } catch (error) {
    var assertionError = {
      actual: firstArg,
      expected: secondArg,
      operator: "notDeepEqual"
    };
    throw assertionError;
  }
};
