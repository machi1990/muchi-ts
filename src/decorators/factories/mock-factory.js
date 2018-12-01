"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dada_js_1 = require("dada-js");
var can_run_within_1 = require("../../utils/ts/can-run-within");
var MockFactory = /** @class */ (function() {
  function MockFactory(mockRegistry) {
    this.mockRegistry = mockRegistry;
  }
  MockFactory.prototype.create = function() {
    var _this = this;
    return function(Class) {
      return function(target, key) {
        var mockSetup = {
          key: key,
          canRunWithin: function(TestClass) {
            return can_run_within_1.default(TestClass, target);
          },
          run: function(runnerOpts) {
            var MockClass = function() {};
            MockClass.prototype = Class.prototype;
            var mockObj = new MockClass();
            var methods = Reflect.ownKeys(
              Object.getPrototypeOf(Class.prototype)
            );
            methods.forEach(function(fnName) {
              mockObj[fnName] = dada_js_1.mock(mockObj, fnName);
            });
            runnerOpts.contextInstance[key] = mockObj;
          }
        };
        _this.mockRegistry.register(mockSetup);
      };
    };
  };
  return MockFactory;
})();
exports.default = MockFactory;
