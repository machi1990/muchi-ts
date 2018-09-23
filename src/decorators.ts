import "reflect-metadata";
import * as colors from "colors";
import { assertDeepEqual } from "./assertion";

/**
 * 1) @context and implement context execution.
 */
const SPACE: string = " ";
const SKIPPED: string = colors.cyan("Skipped- ");
const PASSED: string = colors.green("Passed- ");
const FAILED: string = colors.red("Failed- ");
const ACTUAL: string = colors.bgGreen("actual - ");
const EXPECTED: string = colors.bgRed("expected - ");

const operatorInWords = {
  truthy: "to be",
  "==": "to equal to",
  "===": "to strict equal to",
  "!==": "to not equal to",
  "!===": "to not strict equal to",
  deepEqual: "to deep equal to",
  notDeepEqual: "to not deep equal to"
};

interface Opts {
  message?: string;
  ignore?: boolean;
}

interface Reflection {
  constructor: string;
  prepertyKeys: Array<PropertyKey>;
}

const isSame = (firstArg: Reflection, secondArg: Reflection): boolean => {
  try {
    assertDeepEqual(firstArg, secondArg);
    return true;
  } catch (error) {
    return false;
  }
};

const canRunWithin = (TestClass, target): boolean => {
  const testClassReflection: Reflection = {
    constructor: TestClass.prototype.constructor,
    prepertyKeys: Reflect.ownKeys(TestClass.prototype)
  };

  const targetReflextion: Reflection = {
    constructor: target.constructor,
    prepertyKeys: Reflect.ownKeys(target)
  };

  return isSame(testClassReflection, targetReflextion);
};

interface Setup {
  run: (contex) => void;
  canRunWithin: (TestClass) => boolean;
}

interface BeforeSetup extends Setup {}

interface AfterSetup extends Setup {}

interface TestSetup extends Setup {
  message: string;
  ignore: boolean;
}

const testing = () => {
  const testsSetups: Array<TestSetup> = [],
    befores: Array<BeforeSetup> = [],
    afters: Array<AfterSetup> = [];

  const before = (target, key, _descriptor) => {
    befores.push({
      run: context => context[key](),
      canRunWithin: (TestClass): boolean => canRunWithin(TestClass, target)
    });
  };

  const after = (target, key, _descriptor) => {
    afters.push({
      run: context => context[key](),
      canRunWithin: (TestClass): boolean => canRunWithin(TestClass, target)
    });
  };

  const test = (
    opts: Opts = {
      message: "",
      ignore: false
    }
  ) => {
    return (target, key, descriptor) => {
      const name = `${target.constructor}`
        .replace(/[fF]unction\s*/g, "")
        .split(/\(/)
        .shift()
        .trim();

      const test: TestSetup = {
        message: opts.message || `${name}.${key}()`,
        ignore: opts.ignore,
        run: context => context[key](),
        canRunWithin: (TestClass): boolean => canRunWithin(TestClass, target)
      };

      testsSetups.push(test);
    };
  };

  // TODO 3)
  const context = (opts: Opts = { message: "", ignore: false }) => {
    return (target, key, _descriptor) => {};
  };

  const run = (opts: Opts = { message: "", ignore: false }) => {
    return TestClass => {
      const message: string = opts.message || TestClass.name;
      let testContext, before: Setup, after: Setup;
      const testClassIgnored: boolean = opts.ignore;

      if (testClassIgnored) {
        console.log(SKIPPED, colors.cyan(message));
      } else {
        console.log(colors.white(message));
        testContext = new TestClass();
        before = befores.find(setup => setup.canRunWithin(TestClass));
        after = afters.find(setup => setup.canRunWithin(TestClass));
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

  return {
    run,
    test,
    after,
    before,
    context
  };
};

export default testing;

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
      `${operatorInWords[operator]}`,
      EXPECTED,
      colors.red(expected)
    );
    console.log(SPACE);
  }
  if (after) after.run(testContext);
};
