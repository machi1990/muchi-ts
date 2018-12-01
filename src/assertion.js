"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var op_1 = require("./utils/ts/op");
/**
 * Add more here.
 * - error assertion
 *  etc
 */
var assertions = [
  "assertTruthy",
  "assertEqual",
  "assertStrictEqual",
  "assertDeepEqual",
  "assertNotEqual",
  "assertNotStrictEqual",
  "assertNotDeepEqual"
].map(function(method) {
  return new RegExp("at Object.exports." + method + " (.*/assertion.ts)");
});
var findFailingLineNumberFromError = function(error) {
  var stack = error.stack;
  if (!stack) return "";
  var stackLines = stack.split("\n");
  var index = 0;
  var _loop_1 = function(line) {
    ++index;
    if (
      assertions.some(function(assertion) {
        return assertion.test(line);
      })
    ) {
      return "break";
    }
  };
  for (var _i = 0, stackLines_1 = stackLines; _i < stackLines_1.length; _i++) {
    var line = stackLines_1[_i];
    var state_1 = _loop_1(line);
    if (state_1 === "break") break;
  }
  return stackLines[index].trim();
};
exports.assertTruthy = function(value) {
  try {
    assert.ok(value);
  } catch (error) {
    var assertionError = {
      actual: value,
      expected: op_1.TRUTHY,
      operator: op_1.TRUTHY,
      stack: findFailingLineNumberFromError(error)
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
      operator: op_1.EQL_OP,
      stack: findFailingLineNumberFromError(error)
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
      operator: op_1.STRICT_EQL_OP,
      stack: findFailingLineNumberFromError(error)
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
      operator: op_1.DEEP_EQL_OP,
      stack: findFailingLineNumberFromError(error)
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
      operator: op_1.NOT_EQL_OP,
      stack: findFailingLineNumberFromError(error)
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
      operator: op_1.NOT_STRICT_EQL_OP,
      stack: findFailingLineNumberFromError(error)
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
      operator: op_1.NOT_DEEP_EQL_OP,
      stack: findFailingLineNumberFromError(error)
    };
    throw assertionError;
  }
};
