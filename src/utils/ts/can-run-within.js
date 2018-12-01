"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reflection_1 = require("../../interfaces/reflection");
/**
 * Checks if two classes are the same #mini-hack
 * @param TestClass
 * @param target
 */
var canRunWithin = function(TestClass, target) {
  var testClassReflection = {
    constructor: TestClass.constructor,
    prepertyKeys: Reflect.ownKeys(TestClass)
  };
  var targetReflextion = {
    constructor: target.constructor,
    prepertyKeys: Reflect.ownKeys(target)
  };
  return reflection_1.isSame(testClassReflection, targetReflextion);
};
exports.default = canRunWithin;
