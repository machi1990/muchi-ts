"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var colors = require("colors");
exports.SPACE = " ";
exports.SKIPPED = colors.cyan("Skipped- ");
exports.PASSED = colors.green("Passed- ");
exports.FAILED = colors.red("Failed- ");
exports.ACTUAL = colors.bgGreen("actual - ");
exports.EXPECTED = colors.bgRed("expected - ");
