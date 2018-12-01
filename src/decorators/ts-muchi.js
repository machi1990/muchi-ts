"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("source-map-support/register");
var after_registry_1 = require("../registries/after-registry");
var method_registry_1 = require("../registries/method-registry");
var method_registry_2 = require("../registries/method-registry");
var test_factory_1 = require("./factories/test-factory");
var after_factory_1 = require("./factories/after-factory");
var before_factory_1 = require("./factories/before-factory");
var context_factory_1 = require("./factories/context-factory");
var ts_muchi_factory_1 = require("./factories/ts-muchi-factory");
exports.default = function() {
  var testRegistry = new method_registry_1.default();
  var afterRegistry = new after_registry_1.default();
  var beforeRegistry = new method_registry_2.default();
  return {
    Test: new test_factory_1.default(testRegistry).create(),
    After: new after_factory_1.default(afterRegistry).create(),
    Before: new before_factory_1.default(beforeRegistry).create(),
    Context: new context_factory_1.default(
      beforeRegistry,
      testRegistry,
      afterRegistry
    ).create(),
    TsMuchi: new ts_muchi_factory_1.default(
      beforeRegistry,
      testRegistry,
      afterRegistry
    ).create()
  };
};
