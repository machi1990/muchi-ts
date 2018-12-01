"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ContextBuilder = /** @class */ (function() {
  function ContextBuilder(fromClass) {
    this.fromClass = fromClass;
    this.context = null;
  }
  ContextBuilder.prototype.withEnglobingContext = function(context) {
    this.context = context;
    return this;
  };
  ContextBuilder.prototype.build = function() {
    var _this = this;
    var instance = new this.fromClass();
    if (!this.context) return instance;
    var instanceAttributes = Reflect.ownKeys(instance);
    Reflect.ownKeys(this.context).forEach(function(contextAttribute) {
      var containsKey = instanceAttributes.some(function(instanceAttribute) {
        if (
          typeof contextAttribute === "symbol" &&
          typeof instanceAttribute === "symbol"
        ) {
          return (
            Symbol.keyFor(contextAttribute) === Symbol.keyFor(instanceAttribute)
          );
        }
        return contextAttribute === instanceAttribute;
      });
      if (!containsKey) {
        instance[contextAttribute] = _this.context[contextAttribute];
      }
    });
    return instance;
  };
  return ContextBuilder;
})();
exports.default = ContextBuilder;
