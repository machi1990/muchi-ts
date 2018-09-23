"use strict";
function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./src/assertion"));
var js_muchi_1 = require("./src/decorators/js-muchi");
(exports.JsMuchi = ((_a = js_muchi_1.default()), _a.JsMuchi)),
  (exports.test = _a.test),
  (exports.after = _a.after),
  (exports.before = _a.before);
var _a;
