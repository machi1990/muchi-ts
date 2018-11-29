import { AfterSetup } from "../interfaces/setup";
import canRunWithin from "../utils/can-run-within";
import AfterRegistry from "../registries/after-registry";

const after = (registry: AfterRegistry) => {
  const afterDecorator = (target, key, _descriptor) => {
    /**
     * Declare and register after setup.
     */
    const afterSetup: AfterSetup = {
      run: context => context[key](),
      canRunWithin: (TestClass): boolean => canRunWithin(TestClass, target)
    };
    registry.register(afterSetup);
  };

  return afterDecorator;
};

export default after;
