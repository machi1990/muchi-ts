"use strict";
function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var _a;
__export(require("./src/assertion"));
var ts_muchi_1 = require("./src/decorators/ts-muchi");
(exports.TsMuchi = ((_a = ts_muchi_1.default()), _a.TsMuchi)),
  (exports.Test = _a.Test),
  (exports.After = _a.After),
  (exports.Context = _a.Context),
  (exports.Before = _a.Before),
  (exports.Mock = _a.Mock);
