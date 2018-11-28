import { AfterSetup } from "../interfaces/setup";
import canRunWithin from "../utils/can-run-within";

/**
 * TODO - after setup registry
 */
const after = (afters: Array<AfterSetup>) => {
  const afterDecorator = (target, key, _descriptor) => {
    /**
     * Declare and register after setup.
     */
    const afterSetup: AfterSetup = {
      run: context => context[key](),
      canRunWithin: (TestClass): boolean => canRunWithin(TestClass, target)
    };
    afters.push(afterSetup);
  };

  return afterDecorator;
};

export default after;
