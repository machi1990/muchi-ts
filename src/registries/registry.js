"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a;
var elements = Symbol("elements");
var counter = Symbol("counter");
var Registry = /** @class */ (function() {
  function Registry() {
    this[_a] = 0;
    this[elements] = new Array();
  }
  Registry.prototype.register = function(afterSetup) {
    return this[elements].push(afterSetup);
  };
  Registry.prototype.find = function(predicate) {
    return this[elements].find(predicate);
  };
  Registry.prototype.filter = function(predicate) {
    var registry = new Registry();
    this[elements].filter(predicate).forEach(function(element) {
      return registry.register(element);
    });
    return registry;
  };
  Registry.prototype.map = function(transformer) {
    return this[elements].map(transformer);
  };
  Registry.prototype.get = function(index) {
    return this[elements][index];
  };
  Registry.prototype.size = function() {
    return this[elements].length;
  };
  Registry.prototype.next = function() {
    var done = this[counter] === this.size();
    return {
      done: done,
      value: done ? null : this.get(this[counter]++)
    };
  };
  Registry.prototype[((_a = counter), Symbol.iterator)] = function() {
    return this;
  };
  Registry.prototype.feed = function(destination) {
    for (var _i = 0, _a = this[elements]; _i < _a.length; _i++) {
      var setup = _a[_i];
      destination.register(setup);
    }
    return destination;
  };
  return Registry;
})();
exports.default = Registry;
