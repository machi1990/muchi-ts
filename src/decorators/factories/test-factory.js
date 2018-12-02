"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var colors = require("colors");
var op_1 = require("../../utils/ts/op");
var logger_1 = require("../../utils/ts/logger");
var can_run_within_1 = require("../../utils/ts/can-run-within");
var hard_corded_value_1 = require("../../utils/ts/hard-corded-value");
var TestDecoratorFactory = /** @class */ (function () {
    function TestDecoratorFactory(registry) {
        this.registry = registry;
    }
    TestDecoratorFactory.prototype.create = function () {
        var _this = this;
        return function (opts) {
            return function (target, method, _descriptor) {
                var name = ("" + target.constructor)
                    .replace(/[fF]unction\s*/g, "")
                    .split(/\(/)
                    .shift()
                    .trim();
                var message = opts.it || name + "." + method + "()";
                var ignore = opts.ignore || false;
                /**
                 * Create a new test setup and register it
                 */
                var testSetup = {
                    ignore: ignore,
                    message: message,
                    key: method,
                    canRunWithin: function (TestClass) { return can_run_within_1.default(TestClass, target); },
                    run: function (runnerOpts) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, run(runnerOpts, { method: method, ignore: ignore, message: message })];
                    }); }); }
                };
                _this.registry.register(testSetup);
            };
        };
    };
    return TestDecoratorFactory;
}());
exports.default = TestDecoratorFactory;
var run = function (runnerOpts, _a) {
    var method = _a.method, ignore = _a.ignore, message = _a.message;
    return __awaiter(_this, void 0, void 0, function () {
        var level, logger, skipTest, context, startTime, duration, error_1, actual, expected, operator, stack;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    level = runnerOpts.level * 2;
                    logger = runnerOpts.logger;
                    skipTest = ignore || runnerOpts.ignore;
                    context = runnerOpts.contextInstance;
                    if (!skipTest) return [3 /*break*/, 1];
                    runnerOpts.logger.addLog(logger_1.TYPE.log, hard_corded_value_1.SPACE.repeat(level + 1), hard_corded_value_1.SKIPPED, colors.cyan(message));
                    return [3 /*break*/, 5];
                case 1:
                    startTime = Date.now();
                    duration = 0;
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, context[method]()];
                case 3:
                    _b.sent();
                    duration = Date.now() - startTime;
                    logger.addLog(logger_1.TYPE.log, hard_corded_value_1.SPACE.repeat(level + 1), hard_corded_value_1.PASSED, colors.green(message), colors.gray("- " + duration + " ms") // tests logs
                    );
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _b.sent();
                    duration = Date.now() - startTime;
                    actual = error_1.actual, expected = error_1.expected, operator = error_1.operator, stack = error_1.stack;
                    logger.addLog(logger_1.TYPE.error, hard_corded_value_1.SPACE.repeat(level + 1), hard_corded_value_1.FAILED, colors.red(message), colors.gray(" - " + duration + " ms"));
                    logger.addLog(logger_1.TYPE.error, hard_corded_value_1.SPACE.repeat(level + 2), hard_corded_value_1.EXPECTS, colors.white(actual), colors.bold("" + op_1.Op[operator]), colors.white(expected));
                    logger.addLog(logger_1.TYPE.error, hard_corded_value_1.SPACE.repeat(level + 2), colors.red(stack));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
};
