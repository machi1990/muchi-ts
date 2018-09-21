"use strict";
function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var _a;
__export(require("./src/assertion"));
var decorators_1 = require("./src/decorators");
(exports.run = ((_a = decorators_1.testing()), _a.run)),
  (exports.test = _a.test),
  (exports.after = _a.after),
  (exports.before = _a.before);
