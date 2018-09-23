"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var can_run_within_1 = require("./utils/can-run-within");
var test = function(testsSetups) {
  return function(opts) {
    if (opts === void 0) {
      opts = {
        message: "",
        ignore: false
      };
    }
    return function(target, key, _descriptor) {
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
          return can_run_within_1.default(TestClass, target);
        }
      };
      testsSetups.push(test);
    };
  };
};
exports.default = test;
