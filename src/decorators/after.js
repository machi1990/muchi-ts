"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var can_run_within_1 = require("./utils/can-run-within");
var after = function(afters) {
  return function(target, key, _descriptor) {
    var afterSetup = {
      run: function(context) {
        return context[key]();
      },
      canRunWithin: function(TestClass) {
        return can_run_within_1.default(TestClass, target);
      }
    };
    afters.push(afterSetup);
  };
};
exports.default = after;
