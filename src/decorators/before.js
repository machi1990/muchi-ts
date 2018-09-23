"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var can_run_within_1 = require("./utils/can-run-within");
var before = function(befores) {
  return function(target, key, _descriptor) {
    var beforeSetup = {
      run: function(context) {
        return context[key]();
      },
      canRunWithin: function(TestClass) {
        return can_run_within_1.default(TestClass, target);
      }
    };
    befores.push(beforeSetup);
  };
};
exports.default = before;
