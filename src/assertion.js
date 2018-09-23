"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var op_1 = require("./decorators/utils/op");
/**
 * Add more here.
 * - error assertion
 *  etc
 */
exports.assertTruthy = function(value) {
  try {
    assert.ok(value);
  } catch (error) {
    var assertionError = {
      actual: value,
      expected: op_1.TRUTHY,
      operator: op_1.TRUTHY
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
      operator: op_1.EQL_OP
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
      operator: op_1.STRICT_EQL_OP
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
      operator: op_1.DEEP_EQL_OP
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
      operator: op_1.NOT_EQL_OP
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
      operator: op_1.NOT_STRICT_EQL_OP
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
      operator: op_1.NOT_DEEP_EQL_OP
    };
    throw assertionError;
  }
};
