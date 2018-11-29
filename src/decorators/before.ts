import canRunWithin from "../utils/can-run-within";
import { BeforeSetup } from "../interfaces/setup";
import BeforeRegistry from "../registries/before-registry";

const before = (registry: BeforeRegistry) => {
  const beforeDecorator = (target, key, _descriptor) => {
    /**
     * Declare and register before setup.
     */
    const beforeSetup: BeforeSetup = {
      run: context => context[key](),
      canRunWithin: (TestClass): boolean => canRunWithin(TestClass, target)
    };
    registry.register(beforeSetup);
  };

  return beforeDecorator;
};

export default before;
