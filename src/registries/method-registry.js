"use strict";
var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics = function(d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function(d, b) {
            d.__proto__ = b;
          }) ||
        function(d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
Object.defineProperty(exports, "__esModule", { value: true });
var registry_1 = require("./registry");
var MethodRegistry = /** @class */ (function(_super) {
  __extends(MethodRegistry, _super);
  function MethodRegistry() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  MethodRegistry.prototype.findTestSetupByName = function(key, target) {
    return this.find(function(_a) {
      var testKey = _a.key,
        canRunWithin = _a.canRunWithin;
      return key === testKey && canRunWithin(target);
    });
  };
  return MethodRegistry;
})(registry_1.default);
exports.default = MethodRegistry;