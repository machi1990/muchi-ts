import ReflectMock from "../types/reflect-mock-api";

export function reflect(mock): ReflectMock {
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

/**
 * Restores
 */
export function revive(mock: any) {
  mock["revive"]();
}
