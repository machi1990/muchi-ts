import canRunWithin from "./utils/can-run-within";
import { AfterSetup } from "../interfaces/setup";

const after = (afters: Array<AfterSetup>) => (target, key, _descriptor) => {
  const afterSetup: AfterSetup = {
    run: context => context[key](),
    canRunWithin: (TestClass): boolean => canRunWithin(TestClass, target)
  };
  afters.push(afterSetup);
};

export default after;
