import "reflect-metadata";
import "source-map-support/register";
import test from "./test";
import after from "./after";
import before from "./before";
import context from "./context";
import * as colors from "colors";
import { Op } from "../utils/op";
import compareTestSetup from "../utils/compare-test-setup";
import AnnotationOpts from "../interfaces/annotation-opts";
import { TestSetup, BeforeSetup, AfterSetup } from "../interfaces/setup";
import {
  SKIPPED,
  SPACE,
  PASSED,
  FAILED,
  ACTUAL,
  EXPECTED
} from "../utils/hard-corded-value";

const JsMuchiRun = (
  beforeSetups: Array<BeforeSetup>,
  testsSetups: Array<TestSetup>,
  afterSetups: Array<AfterSetup>
) => (opts: AnnotationOpts = { message: "", ignore: false }) => {
  return testClass => {
    const message: string = opts.message || testClass.name;
    let testContext, before: BeforeSetup, after: AfterSetup;
    const testClassIgnored: boolean = opts.ignore;
    const targetClass: any = testClass.prototype;

    if (testClassIgnored) {
      /**
       * Skips test class if ignore metadata sets to true
       */
      console.log(SKIPPED, colors.cyan(message));
    } else {
      /**
       * Retrieve before and after annotation if present.
       */
      console.log(colors.white(message));
      testContext = new testClass();
      before = beforeSetups.find(setup => setup.canRunWithin(targetClass));
      after = afterSetups.find(setup => setup.canRunWithin(targetClass));
    }

    /**
     * Sort test setup before execution
     */
    testsSetups.sort(compareTestSetup);

    /**
     * Runs each test
     */
    const beforeAfterSetups = { after, before };
    const context = { testContext, testClassIgnored };
    for (const test of testsSetups) {
      if (!test.canRunWithin(targetClass)) continue;
      runTest(test, context, beforeAfterSetups);
    }
  };
};

const runTest = async (
  test: TestSetup,
  context: any,
  setups: any
): Promise<void> => {
  const { after, before } = setups;
  const { testContext, testClassIgnored } = context;
  const startTime: number = Date.now();
  let duration: number = 0;
  const testIgnored = test.ignore || testClassIgnored;
  if (testIgnored) {
    console.log(SPACE, SKIPPED, colors.cyan(test.message));
    return;
  }

  /**
   * Execute before setup if any
   */
  if (before) before.run(testContext);
  try {
    /**
     * Runs the test within the current context
     */
    await test.run(testContext);
    duration = Date.now() - startTime;
    console.log(
      SPACE,
      PASSED,
      colors.green(test.message),
      colors.gray(`- ${duration} ms`)
    );
  } catch (error) {
    duration = Date.now() - startTime;
    const { actual, expected, operator, stack } = error;
    console.error(
      SPACE,
      FAILED,
      colors.red(test.message),
      colors.gray(` - ${duration} ms`)
    );

    console.info(
      SPACE,
      SPACE,
      "reason",
      ACTUAL,
      colors.green(actual),
      `${Op[operator]}`,
      EXPECTED,
      colors.red(expected)
    );
    console.log(SPACE, SPACE, colors.red(stack));
    console.log(SPACE);
  }
  /**
   * Execute after setup if any
   */
  if (after) after.run(testContext);
};

const JsMuchi = () => {
  const beforeSetups: Array<BeforeSetup> = [],
    testsSetups: Array<TestSetup> = [],
    afterSetups: Array<AfterSetup> = [];

  /**
   * Tests decorators
   */
  return {
    After: after(afterSetups),
    Test: test(testsSetups),
    Context: context(testsSetups),
    Before: before(beforeSetups),
    JsMuchi: JsMuchiRun(beforeSetups, testsSetups, afterSetups)
  };
};

export default JsMuchi;
