"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assertion_1 = require("../assertion");
exports.isSame = function (firstArg, secondArg) {
    try {
        assertion_1.assertDeepEqual(firstArg, secondArg);
        return true;
    }
    catch (error) {
        return false;
    }
};
