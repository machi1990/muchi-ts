"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var colors = require("colors");
var assertion_1 = require("./assertion");
/**
 * testsRegistry by tested class.
 * 1) @context and implement context execution.
 * 2) async functions / operations.
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
  var testsRegistry = [],
    befores = [],
    afters = [];
  var reflectTarget = function(target) {
    return {
      constructor: target.constructor,
      prepertyKeys: Reflect.ownKeys(target)
    };
  };
  var isSameReflection = function(firstArg, secondArg) {
    try {
      assertion_1.assertDeepEqual(firstArg, secondArg);
      return true;
    } catch (error) {
      return false;
    }
  };
  var canRunWithin = function(TestClass, target) {
    var testContextReflection = {
      constructor: TestClass.prototype.constructor,
      prepertyKeys: Reflect.ownKeys(TestClass.prototype)
    };
    return isSameReflection(testContextReflection, reflectTarget(target));
  };
  var before = function(target, key, _descriptor) {
    befores.push({
      run: function(context) {
        return context[key]();
      },
      canRunWithin: function(TestClass) {
        return canRunWithin(TestClass, target);
      }
    });
  };
  var after = function(target, key, _descriptor) {
    afters.push({
      canRunWithin: function(TestClass) {
        return canRunWithin(TestClass, target);
      },
      run: function(context) {
        return context[key]();
      }
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
      var name = ("" + target.constructor)
        .replace(/function\s*/g, "")
        .split(/\(/)[0]
        .trim();
      var test = {
        message: opts.message || name + "." + key + "()",
        ignore: opts.ignore,
        run: function(context) {
          return context[key]();
        },
        canRunWithin: function(TestClass) {
          return canRunWithin(TestClass, target);
        }
      };
      testsRegistry.push(test);
    };
  };
  var run = function(opts) {
    if (opts === void 0) {
      opts = { message: "", ignore: false };
    }
    return function(TestClass) {
      var message = opts.message || TestClass.name;
      var testContext, before, after;
      var testClassIgnored = opts.ignore;
      if (testClassIgnored) {
        console.log(SKIPPED, colors.cyan(message));
      } else {
        console.log(colors.white(message));
        testContext = new TestClass();
        before = befores.find(function(setup) {
          return setup.canRunWithin(TestClass);
        });
        after = afters.find(function(setup) {
          return setup.canRunWithin(TestClass);
        });
      }
      testsRegistry.forEach(function(test) {
        if (!test.canRunWithin(TestClass)) return;
        var testIgnored = test.ignore || testClassIgnored;
        if (testIgnored) {
          console.log(SPACE, SKIPPED, colors.cyan(test.message));
          return;
        }
        var startTime = Date.now();
        var duration = 0;
        if (before) before.run(testContext);
        try {
          test.run(testContext);
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
            colors.red(test.message),
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
        if (after) after.run(testContext);
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
