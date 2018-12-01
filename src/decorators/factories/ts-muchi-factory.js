"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("../../utils/ts/logger");
var ts_muchi_test_runner_1 = require("./ts-muchi-test-runner");
var context_builder_1 = require("../../utils/ts/context-builder");
var setup_runner_1 = require("./setup-runner");
var TsMuchiDecoratorFactory = /** @class */ (function() {
  function TsMuchiDecoratorFactory(
    beforeRegistry,
    methodRegistry,
    afterRegistry,
    mockRegistry
  ) {
    this.beforeRegistry = beforeRegistry;
    this.methodRegistry = methodRegistry;
    this.afterRegistry = afterRegistry;
    this.mockRegistry = mockRegistry;
  }
  TsMuchiDecoratorFactory.prototype.create = function() {
    var _this = this;
    return function(_a) {
      var name = _a.name,
        ignore = _a.ignore;
      return function(testClass) {
        var message = name || testClass.name;
        var runnerOpts = {
          message: message,
          ignore: ignore,
          level: 0,
          logger: new logger_1.Logger(),
          contextInstance: new context_builder_1.default(testClass).build(),
          contextClazz: testClass.prototype,
          beforeRunner: new setup_runner_1.BeforeSetupRunner(),
          afterRunner: new setup_runner_1.AfterSetupRunner()
        };
        var tsMuchiTestRunner = new ts_muchi_test_runner_1.default(
          _this.beforeRegistry,
          _this.methodRegistry,
          _this.afterRegistry,
          _this.mockRegistry
        );
        tsMuchiTestRunner
          .run(runnerOpts)
          .then(function() {
            return runnerOpts.logger.log();
          })
          .catch(console.error);
      };
    };
  };
  return TsMuchiDecoratorFactory;
})();
exports.default = TsMuchiDecoratorFactory;
