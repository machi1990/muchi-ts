import "reflect-metadata";
import "source-map-support/register";
import test from "./test";
import after from "./after";
import before from "./before";
import context from "./context";
import * as colors from "colors";
import { Op } from "../utils/op";
import { TYPE, Logger } from "../utils/logger";
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
import BeforeRegistry from "../registries/test-registry";
import AfterRegistry from "../registries/after-registry";
import TestRegistry from "../registries/test-registry";

const JsMuchiRun = (
  beforeRegistry: BeforeRegistry,
  afterRegistry: AfterRegistry,
  testRegistry: TestRegistry
) => (opts: AnnotationOpts = { message: "", ignore: false }) => {
  return testClass => {
    const testContext = new testClass();
    const classLogger: Logger = new Logger();
    const targetClass: any = testClass.prototype;
    const testClassIgnored: boolean = opts.ignore;
    const message: string = opts.message || testClass.name;

    let before: BeforeSetup, after: AfterSetup;
    if (testClassIgnored) {
      /**
       * Skips test class if ignore metadata sets to true
       */
      classLogger.addLog(TYPE.log, SKIPPED, colors.cyan(message));
    } else {
      /**
       * Retrieve before and after annotation if present.
       */
      before = beforeRegistry.find(setup => setup.canRunWithin(targetClass));
      after = afterRegistry.find(setup => setup.canRunWithin(targetClass));
      classLogger.addLog(TYPE.log, colors.white(message));
    }

    /**
     * Log class messages
     */
    classLogger.log();

    /**
     * Sort test setup before execution
     */
    testRegistry.sort();
    /**
     * Runs each test
     */
    const context = {
      testContext,
      testClassIgnored,
      targetClass,
      after,
      before
    };

    runAsyncAtIndex(testRegistry, context);
  };
};

const runAsyncAtIndex = async (testRegistry: TestRegistry, context: any) => {
  const { value } = testRegistry.next();

  if (!value) return;

  const { targetClass } = context;
  if (value.canRunWithin(targetClass)) {
    await runTest(value, context);
  }

  return runAsyncAtIndex(testRegistry, context);
};

const runTest = async (test: TestSetup, context: any): Promise<void> => {
  const startTime: number = Date.now();
  let duration: number = 0;
  const logger: Logger = new Logger();
  const { testContext, testClassIgnored, after, before } = context;
  const testIgnored = test.ignore || testClassIgnored;
  if (testIgnored) {
    logger.addLog(TYPE.log, SPACE, SKIPPED, colors.cyan(test.message));
    logger.log();
    return;
  }

  /**
   * Execute before setup if any
   */
  if (before) await before.run(testContext);

  try {
    /**
     * Runs the test within the current context
     */
    await test.run(testContext);
    duration = Date.now() - startTime;
    logger.addLog(
      TYPE.log,
      SPACE,
      PASSED,
      colors.green(test.message),
      colors.gray(`- ${duration} ms`)
    );
  } catch (error) {
    duration = Date.now() - startTime;
    const { actual, expected, operator, stack } = error;
    logger.addLog(
      TYPE.error,
      SPACE,
      FAILED,
      colors.red(test.message),
      colors.gray(` - ${duration} ms`)
    );

    logger.addLog(
      TYPE.info,
      SPACE,
      SPACE,
      "reason",
      ACTUAL,
      colors.green(actual),
      `${Op[operator]}`,
      EXPECTED,
      colors.red(expected)
    );
    logger.addLog(TYPE.log, SPACE, SPACE, colors.red(stack));
    logger.addLog(TYPE.log, SPACE);
  }
  /**
   * Execute after setup if any
   */
  if (after) await after.run(testContext);
  logger.log();
};

const JsMuchi = () => {
  const testRegistry: TestRegistry = new TestRegistry();
  const afterRegistry: AfterRegistry = new AfterRegistry();
  const beforeRegistry: BeforeRegistry = new BeforeRegistry();
  /**
   * Tests decorators
   */
  return {
    After: after(afterRegistry),
    Test: test(testRegistry),
    Context: context(testRegistry),
    Before: before(beforeRegistry),
    JsMuchi: JsMuchiRun(beforeRegistry, afterRegistry, testRegistry)
  };
};

export default JsMuchi;
