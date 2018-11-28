import canRunWithin from "../utils/can-run-within";
import { BeforeSetup } from "../interfaces/setup";

/**
 * TODO - before setup registry
 */
const before = (befores: Array<BeforeSetup>) => {
  const beforeDecorator = (target, key, _descriptor) => {
    /**
     * Declare and register before setup.
     */
    const beforeSetup: BeforeSetup = {
      run: context => context[key](),
      canRunWithin: (TestClass): boolean => canRunWithin(TestClass, target)
    };
    befores.push(beforeSetup);
  };

  return beforeDecorator;
};

export default before;
