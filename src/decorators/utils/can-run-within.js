"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reflection_1 = require("../../interfaces/reflection");
var canRunWithin = function(TestClass, target) {
  var testClassReflection = {
    constructor: TestClass.prototype.constructor,
    prepertyKeys: Reflect.ownKeys(TestClass.prototype)
  };
  var targetReflextion = {
    constructor: target.constructor,
    prepertyKeys: Reflect.ownKeys(target)
  };
  return reflection_1.isSame(testClassReflection, targetReflextion);
};
exports.default = canRunWithin;
