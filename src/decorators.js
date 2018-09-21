"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var colors = require("colors");
/**
 * testsRegistry by tested class.
 * 1) register target ==> me (class) to reference it later on.
 * 2) @context and implement context execution.
 * 3) async functions / operations.
 */
var SPACE = " ";
var SKIPPED = colors.cyan("Skipped- ");
var PASSED = colors.green("Passed- ");
var FAILED = colors.red("Failed- ");
var ACTUAL = colors.bgGreen("actual - ");
var EXPECTED = colors.bgRed("expected - ");
var operatorInWords = {
  truthy: "to be",
  "==": "to equal to",
  "===": "to strict equal to",
  "!==": "to not equal to",
  "!===": "to not strict equal to",
  deepEqual: "to deep equal to",
  notDeepEqual: "to not deep equal to"
};
exports.testing = function() {
  var testsRegistry = [];
  var setups = [];
  var before = function(target, key, _descriptor) {
    setups.push({
      key: key,
      before: true,
      me: target
    });
  };
  var after = function(target, key, _descriptor) {
    setups.push({
      key: key,
      after: true,
      me: target
    });
  };
  var test = function(opts) {
    if (opts === void 0) {
      opts = {
        message: "",
        ignore: false
      };
    }
    return function(target, key, descriptor) {
      var test = {
        key: key,
        message: opts.message,
        me: target,
        ignore: opts.ignore
      };
      testsRegistry.push(test);
    };
  };
  var run = function(opts) {
    if (opts === void 0) {
      opts = { message: "", ignore: false };
    }
    return function(TestContext) {
      var testContexName = ("" + TestContext)
        .replace(/function\s*/, "")
        .split(/\s*\(/)[0]
        .trim();
      var message = opts.message || testContexName;
      var testContext, before, after;
      var testContextIgnored = opts.ignore;
      if (testContextIgnored) {
        console.log(SKIPPED, colors.cyan(message));
      } else {
        console.log(colors.white(message));
        testContext = new TestContext();
        before = setups.find(function(setup) {
          return setup.before;
        });
        after = setups.find(function(setup) {
          return setup.after;
        });
      }
      testsRegistry.forEach(function(test) {
        var testMessage =
          test.message || testContexName + "." + test.key + "()";
        if (testContextIgnored || test.ignore) {
          console.log(SPACE, SKIPPED, colors.cyan(testMessage));
          return;
        }
        if (before) testContext[before.key]();
        var startTime = Date.now();
        var duration = 0;
        try {
          testContext[test.key]();
          duration = Date.now() - startTime;
          console.log(
            SPACE,
            PASSED,
            colors.green(test.message),
            colors.gray("- " + duration + " ms")
          );
        } catch (error) {
          duration = Date.now() - startTime;
          var actual = error.actual,
            expected = error.expected,
            operator = error.operator;
          console.error(
            SPACE,
            FAILED,
            colors.red(testMessage),
            colors.gray(" - " + duration + " ms")
          );
          console.info(
            SPACE,
            "assert",
            ACTUAL,
            colors.green(actual),
            "" + operatorInWords[operator],
            EXPECTED,
            colors.red(expected)
          );
        }
        if (after) testContext[after.key]();
      });
    };
  };
  // TODO 3)
  var context = function(opts) {
    if (opts === void 0) {
      opts = { message: "", ignore: false };
    }
    return function(target, key, _descriptor) {};
  };
  return {
    run: run,
    test: test,
    after: after,
    before: before,
    context: context
  };
};
