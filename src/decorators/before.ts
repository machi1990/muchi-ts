import canRunWithin from "./utils/can-run-within";
import { BeforeSetup } from "../interfaces/setup";

const before = (befores: Array<BeforeSetup>) => (target, key, _descriptor) => {
  const beforeSetup: BeforeSetup = {
    run: context => context[key](),
    canRunWithin: (TestClass): boolean => canRunWithin(TestClass, target)
  };
  befores.push(beforeSetup);
};

export default before;
