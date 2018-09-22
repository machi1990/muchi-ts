import "reflect-metadata";
import * as colors from "colors";
import { assertDeepEqual } from "./assertion";
import { Context } from "vm";
/**
 * testsRegistry by tested class.
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

interface Setup {
  run: (contex) => void;
  canRunWithin: (TestClass) => boolean;
}

interface BeforeSetup extends Setup {}

interface AfterSetup extends Setup {}

interface Test {
  message: string;
  ignore: boolean;
  run: (context: any) => void;
  canRunWithin: (context) => boolean;
}

export const testing = () => {
  const testsRegistry: Array<Test> = [],
    befores: Array<BeforeSetup> = [],
    afters: Array<AfterSetup> = [];

  const reflectTarget = (target): Reflection => {
    return {
      constructor: target.constructor,
      prepertyKeys: Reflect.ownKeys(target)
    };
  };

  const isSameReflection = (
    firstArg: Reflection,
    secondArg: Reflection
  ): boolean => {
    try {
      assertDeepEqual(firstArg, secondArg);
      return true;
    } catch (error) {
      return false;
    }
  };

  const canRunWithin = (TestClass, target): boolean => {
    const testContextReflection = {
      constructor: TestClass.prototype.constructor,
      prepertyKeys: Reflect.ownKeys(TestClass.prototype)
    };

    return isSameReflection(testContextReflection, reflectTarget(target));
  };

  const before = (target, key, _descriptor) => {
    befores.push({
      run: context => context[key](),
      canRunWithin: (TestClass): boolean => canRunWithin(TestClass, target)
    });
  };

  const after = (target, key, _descriptor) => {
    afters.push({
      canRunWithin: (TestClass): boolean => canRunWithin(TestClass, target),
      run: context => context[key]()
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
        .replace(/function\s*/g, "")
        .split(/\(/)[0]
        .trim();

      const test: Test = {
        message: opts.message || `${name}.${key}()`,
        ignore: opts.ignore,
        run: context => context[key](),
        canRunWithin: (TestClass): boolean => canRunWithin(TestClass, target)
      };

      testsRegistry.push(test);
    };
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

      testsRegistry.forEach(async (test: Test) => {
        if (!test.canRunWithin(TestClass)) return;

        const testIgnored = test.ignore || testClassIgnored;
        if (testIgnored) {
          console.log(SPACE, SKIPPED, colors.cyan(test.message));
          return;
        }

        const startTime: number = Date.now();
        let duration: number = 0;

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
          console.info(
            SPACE,
            "assert",
            ACTUAL,
            colors.green(actual),
            `${operatorInWords[operator]}`,
            EXPECTED,
            colors.red(expected)
          );
        }

        if (after) after.run(testContext);
      });
    };
  };

  // TODO 3)
  const context = (opts: Opts = { message: "", ignore: false }) => {
    return (target, key, _descriptor) => {};
  };

  return {
    run,
    test,
    after,
    before,
    context
  };
};
