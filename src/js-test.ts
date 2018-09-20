import * as colors from "colors";
import * as assert from "assert";

/**
 * testsRegistry by tested class.
 * 1) Closure - an instance of testsRegistry par each test class.
 * 3) register target ==> me (class) to reference it later on.
 * Group by me (file path / name ?) to establist an registry by function during test execution.
 */
const SPACE: string = " ";
const SKIPPED: string = colors.cyan("Skipped- ");
const PASSED: string = colors.green("Passed- ");
const FAILED: string = colors.red("Failed- ");
const ACTUAL: string = colors.bgGreen("actual - ");
const EXPECTED: string = colors.bgRed("expected - ");

const operatorInWords = {
  "==": "equal to",
  "===": "strict equal to",
  deepEqual: "deep equal to",
  deepStrictEqual: "deep strict equal to"
};

interface Opts {
  message: string;
  ignore?: boolean;
}

interface Setup {
  key: string;
  before?: boolean;
  after?: boolean;
  me: Function;
}

interface Test {
  key: string;
  message: string;
  name: string;
  me: Function;
  ignore: boolean;
}

export const testing = () => {
  const testsRegistry: Array<Test> = [];
  const setups: Array<Setup> = [];

  const before = (target, key, _descriptor) => {
    setups.push({
      key,
      before: true,
      me: target
    });
  };

  const after = (target, key, _descriptor) => {
    setups.push({
      key,
      after: true,
      me: target
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
        .replace(/function\s*/, "")
        .split(/\s*\(/)[0]
        .trim();
      const test: Test = {
        key,
        message: opts.message,
        name: `${name}.${key}()`,
        me: target,
        ignore: opts.ignore
      };

      testsRegistry.push(test);
    };
  };

  const run = (opts: Opts = { message: "", ignore: false }) => {
    return TestContext => {
      const name: string = `${TestContext}`
        .replace(/function\s*/, "")
        .split(/\s*\(/)[0]
        .trim();
      const message: string = opts.message;

      let testContext, before: Setup, after: Setup;
      const testContextIgnored: boolean = opts.ignore;

      if (testContextIgnored) {
        console.log(SKIPPED, colors.cyan(name), colors.cyan(message));
      } else {
        console.log(colors.white(name), colors.white(message));
        testContext = new TestContext();
        before = setups.find(setup => setup.before);
        after = setups.find(setup => setup.after);
      }

      testsRegistry.forEach((test: Test, index: number) => {
        if (testContextIgnored || test.ignore) {
          console.log(
            SPACE,
            SKIPPED,
            colors.cyan(test.name),
            colors.cyan(test.message)
          );
          return;
        }

        if (before) testContext[before.key]();
        const startTime: number = Date.now();
        let duration: number = 0;
        try {
          testContext[test.key]();
          duration = Date.now() - startTime;
          console.log(
            SPACE,
            PASSED,
            colors.green(test.name),
            colors.green(test.message),
            colors.gray(`- ${duration} ms`)
          );
        } catch (error) {
          duration = Date.now() - startTime;
          const { message, actual, expected, operator } = error;
          console.error(
            SPACE,
            FAILED,
            colors.red(`${test.name} ${test.message}`),
            colors.gray(` - ${duration} ms`)
          );
          console.info(
            SPACE,
            "assert",
            ACTUAL,
            colors.green(actual),
            ` to ${operatorInWords[operator]}`,
            EXPECTED,
            colors.red(expected)
          );
        }

        if (after) testContext[after.key]();
      });
    };
  };

  return {
    run,
    test,
    after,
    before
  };
};

export const assertEqual = (firstArg, secondArg) => {
  assert.equal(firstArg, secondArg);
};

export const assertStrictEqual = (firstArg, secondArg) => {
  assert.strictEqual(firstArg, secondArg);
};

export const assertDeepEqual = (firstArg, secondArg) => {
  assert.deepEqual(firstArg, secondArg);
};
