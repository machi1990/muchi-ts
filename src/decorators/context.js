"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var after_1 = require("./after");
var test_1 = require("./test");
var before_1 = require("./before");
/**
 * TODO
 * @param beforeSetups
 * @param testsSetups
 * @param afterSetups
 */
var context = function(beforeSetups, testsSetups, afterSetups) {
  return function(target, key, descriptor) {};
};
var Context = function() {
  var beforeSetups = [],
    testsSetups = [],
    afterSetups = [];
  return {
    testContext: test_1.default(testsSetups),
    afterContext: after_1.default(afterSetups),
    beforeContext: before_1.default(beforeSetups),
    context: context(beforeSetups, testsSetups, afterSetups)
  };
};
exports.default = Context;
