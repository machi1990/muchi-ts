"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function(resolve) {
              resolve(result.value);
            }).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function() {
          return this;
        }),
      g
    );
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                    ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var colors = require("colors");
var assertion_1 = require("./assertion");
/**
 * 1) @context and implement context execution.
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
var isSame = function(firstArg, secondArg) {
  try {
    assertion_1.assertDeepEqual(firstArg, secondArg);
    return true;
  } catch (error) {
    return false;
  }
};
var canRunWithin = function(TestClass, target) {
  var testClassReflection = {
    constructor: TestClass.prototype.constructor,
    prepertyKeys: Reflect.ownKeys(TestClass.prototype)
  };
  var targetReflextion = {
    constructor: target.constructor,
    prepertyKeys: Reflect.ownKeys(target)
  };
  return isSame(testClassReflection, targetReflextion);
};
var testing = function() {
  var testsSetups = [],
    befores = [],
    afters = [];
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
      run: function(context) {
        return context[key]();
      },
      canRunWithin: function(TestClass) {
        return canRunWithin(TestClass, target);
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
        .replace(/[fF]unction\s*/g, "")
        .split(/\(/)
        .shift()
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
      testsSetups.push(test);
    };
  };
  // TODO 3)
  var context = function(opts) {
    if (opts === void 0) {
      opts = { message: "", ignore: false };
    }
    return function(target, key, _descriptor) {};
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
      testsSetups.forEach(function(test) {
        return __awaiter(_this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                if (!test.canRunWithin(TestClass)) return [2 /*return*/];
                return [
                  4 /*yield*/,
                  runTest(
                    test,
                    {
                      testContext: testContext,
                      testClassIgnored: testClassIgnored
                    },
                    {
                      after: after,
                      before: before
                    }
                  )
                ];
              case 1:
                _a.sent();
                return [2 /*return*/];
            }
          });
        });
      });
    };
  };
  return {
    run: run,
    test: test,
    after: after,
    before: before,
    context: context
  };
};
exports.default = testing;
var runTest = function(test, context, setups) {
  return __awaiter(_this, void 0, void 0, function() {
    var after,
      before,
      testContext,
      testClassIgnored,
      startTime,
      duration,
      testIgnored,
      error_1,
      actual,
      expected,
      operator;
    return __generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          (after = setups.after), (before = setups.before);
          (testContext = context.testContext),
            (testClassIgnored = context.testClassIgnored);
          startTime = Date.now();
          duration = 0;
          testIgnored = test.ignore || testClassIgnored;
          if (testIgnored) {
            console.log(SPACE, SKIPPED, colors.cyan(test.message));
            return [2 /*return*/];
          }
          if (before) before.run(testContext);
          _a.label = 1;
        case 1:
          _a.trys.push([1, 3, , 4]);
          return [4 /*yield*/, test.run(testContext)];
        case 2:
          _a.sent();
          duration = Date.now() - startTime;
          console.log(
            SPACE,
            PASSED,
            colors.green(test.message),
            colors.gray("- " + duration + " ms")
          );
          return [3 /*break*/, 4];
        case 3:
          error_1 = _a.sent();
          duration = Date.now() - startTime;
          (actual = error_1.actual),
            (expected = error_1.expected),
            (operator = error_1.operator);
          console.error(
            SPACE,
            FAILED,
            colors.red(test.message),
            colors.gray(" - " + duration + " ms")
          );
          /**
           * Add filename and line number.
           */
          console.info(
            SPACE,
            SPACE,
            "reason",
            ACTUAL,
            colors.green(actual),
            "" + operatorInWords[operator],
            EXPECTED,
            colors.red(expected)
          );
          console.log(SPACE);
          return [3 /*break*/, 4];
        case 4:
          if (after) after.run(testContext);
          return [2 /*return*/];
      }
    });
  });
};
