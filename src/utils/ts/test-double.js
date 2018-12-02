"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function reflect(mock) {
  return {
    args: mock.args.bind(mock),
    when: mock.when.bind(mock),
    reset: mock.reset.bind(mock),
    throws: mock.throws.bind(mock),
    returns: mock.returns.bind(mock),
    inspect: mock.inspect.bind(mock),
    notCalled: mock.reset.bind(mock),
    callCount: mock.callCount.bind(mock),
    calledWith: mock.calledWith.bind(mock),
    calledOnce: mock.calledOnce.bind(mock),
    calledTwice: mock.calledTwice.bind(mock),
    calledThrice: mock.calledThrice.bind(mock)
  };
}
exports.reflect = reflect;
/**
 * Restores
 */
function revive(mock) {
  mock["revive"]();
}
exports.revive = revive;
