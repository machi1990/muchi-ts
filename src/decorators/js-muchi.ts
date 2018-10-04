import "reflect-metadata";
import { Op } from "./utils/op";
import test from "./test";
import after from "./after";
import before from "./before";
import * as colors from "colors";
import AnnotationOpts from "../interfaces/annotation-opts";
import { TestSetup, BeforeSetup, AfterSetup } from "../interfaces/setup";
import {
  SKIPPED,
  SPACE,
  PASSED,
  FAILED,
  ACTUAL,
  EXPECTED
} from "./utils/hard-corded-value";

const JsMuchiRun = (
  beforeSetups: Array<BeforeSetup>,
  testsSetups: Array<TestSetup>,
  afterSetups: Array<AfterSetup>
) => (opts: AnnotationOpts = { message: "", ignore: false }) => {
  return TestClass => {
    const message: string = opts.message || TestClass.name;
    let testContext, before: BeforeSetup, after: AfterSetup;
    const testClassIgnored: boolean = opts.ignore;

    if (testClassIgnored) {
      console.log(SKIPPED, colors.cyan(message));
    } else {
      console.log(colors.white(message));
      testContext = new TestClass();
      before = beforeSetups.find(setup => setup.canRunWithin(TestClass));
      after = afterSetups.find(setup => setup.canRunWithin(TestClass));
    }

    testsSetups.forEach(async (test: TestSetup) => {
      if (!test.canRunWithin(TestClass)) return;
      await runTest(
        test,
        {
          testContext,
          testClassIgnored
        },
        {
          after,
          before
        }
      );
    });
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

  if (before) before.run(testContext);
  try {
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
    const { actual, expected, operator } = error;
    console.error(
      SPACE,
      FAILED,
      colors.red(test.message),
      colors.gray(` - ${duration} ms`)
    );
    /**
     * Add filename and line number.
     */

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
    console.log(SPACE);
  }
  if (after) after.run(testContext);
};

const JsMuchi = () => {
  const beforeSetups: Array<BeforeSetup> = [],
    testsSetups: Array<TestSetup> = [],
    afterSetups: Array<AfterSetup> = [];

  return {
    after: after(afterSetups),
    test: test(testsSetups),
    before: before(beforeSetups),
    JsMuchi: JsMuchiRun(beforeSetups, testsSetups, afterSetups)
  };
};

export default JsMuchi;
