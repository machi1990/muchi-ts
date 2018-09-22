import * as colors from "colors";

/**
 * testsRegistry by tested class.
 * 1) register target ==> me (class) to reference it later on.
 * 2) @context and implement context execution.
 * 3) async functions / operations.
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

interface Setup {
  key: string;
  before?: boolean;
  after?: boolean;
  me: Function; // TODO 1)
}

interface Test {
  key: string;
  message: string;
  me: Function; // TODO 2)
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
      const test: Test = {
        key,
        message: opts.message,
        me: target,
        ignore: opts.ignore
      };

      testsRegistry.push(test);
    };
  };

  const run = (opts: Opts = { message: "", ignore: false }) => {
    return TestContext => {
      const testContexName: string = TestContext.name;
      const message: string = opts.message || testContexName;

      let testContext, before: Setup, after: Setup;
      const testContextIgnored: boolean = opts.ignore;

      if (testContextIgnored) {
        console.log(SKIPPED, colors.cyan(message));
      } else {
        console.log(colors.white(message));
        testContext = new TestContext();
        before = setups.find(setup => setup.before);
        after = setups.find(setup => setup.after);
      }

      testsRegistry.forEach((test: Test) => {
        const testMessage: string =
          test.message || `${testContexName}.${test.key}()`;
        if (testContextIgnored || test.ignore) {
          console.log(SPACE, SKIPPED, colors.cyan(testMessage));
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
            colors.green(test.message),
            colors.gray(`- ${duration} ms`)
          );
        } catch (error) {
          duration = Date.now() - startTime;
          const { actual, expected, operator } = error;
          console.error(
            SPACE,
            FAILED,
            colors.red(testMessage),
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

        if (after) testContext[after.key]();
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
