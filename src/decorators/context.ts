import after from "./after";
import test from "./test";
import before from "./before";
import { BeforeSetup, TestSetup, AfterSetup } from "../interfaces/setup";

/**
 * TODO
 * @param beforeSetups
 * @param testsSetups
 * @param afterSetups
 */
const context = (
  beforeSetups: Array<BeforeSetup>,
  testsSetups: Array<TestSetup>,
  afterSetups: Array<AfterSetup>
) => (target, key, descriptor) => {};

const Context = () => {
  const beforeSetups: Array<BeforeSetup> = [],
    testsSetups: Array<TestSetup> = [],
    afterSetups: Array<AfterSetup> = [];

  return {
    testContext: test(testsSetups),
    afterContext: after(afterSetups),
    beforeContext: before(beforeSetups),
    context: context(beforeSetups, testsSetups, afterSetups)
  };
};

export default Context;
