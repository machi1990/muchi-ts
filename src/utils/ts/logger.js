"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logs = Symbol();
exports.TYPE = {
  log: Symbol("log"),
  info: Symbol("info"),
  warn: Symbol("warn"),
  error: Symbol("error")
};
var Logger = /** @class */ (function() {
  function Logger() {
    this[logs] = new Array();
  }
  Logger.prototype.addLog = function(type) {
    var logEntry = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      logEntry[_i - 1] = arguments[_i];
    }
    this[logs].push({
      type: type,
      logEntry: logEntry
    });
  };
  Logger.prototype.append = function(logger) {
    if (!logger) return;
    this[logs] = this[logs].concat(logger[logs]);
  };
  Logger.prototype.log = function() {
    this[logs].forEach(function(_a) {
      var type = _a.type,
        logEntry = _a.logEntry;
      if (type === exports.TYPE.log) {
        console.log.apply(undefined, logEntry);
      } else if (type === exports.TYPE.info) {
        console.info.apply(undefined, logEntry);
      } else if (type === exports.TYPE.error) {
        console.error.apply(undefined, logEntry);
      } else if (type === exports.TYPE.warn) {
        console.warn.apply(undefined, logEntry);
      }
    });
  };
  return Logger;
})();
exports.Logger = Logger;
