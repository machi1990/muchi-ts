import * as colors from "colors";
import * as assert from "assert";

/**
 * testsRegistry by tested class.
 * 1) Closure - an instance of testsRegistry par each test class.
 * 3) register target ==> me (class) to reference it later on.
 * Group by me (file path / name ?) to establist an registry by function during test execution.
 */
const SPACE: string = " ";
const PENDING: string = colors.cyan("PENDING:");
const PASSED: string = colors.green("PASSED: ");
const FAILURE: string = colors.red("FAILURE:");
const ACTUAL: string = colors.green("actual: ");
const EXPECTED: string = colors.red("expected: ");

export const testing = () => {
  const testsRegistry = [];
  const setups = [];

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

  interface Opts {
    message: string;
    ignore?: boolean;
  }

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

      testsRegistry.push({
        key,
        message: opts.message,
        name: `${name}.${key}()`,
        me: target,
        ignore: opts.ignore
      });
    };
  };

  const run = (opts: Opts = { message: "", ignore: false }) => {
    return TestContext => {
      const name = `${TestContext}`
        .replace(/function\s*/, "")
        .split(/\s*\(/)[0]
        .trim();
      const message = opts.message;

      let testContext, before, after;
      const testContextIgnored: boolean = opts.ignore;

      if (testContextIgnored) {
        console.log(PENDING, colors.cyan(name), colors.cyan(message));
      } else {
        console.log(colors.white(name), colors.white(message));
        testContext = new TestContext();
        before = setups.find(setup => setup.before);
        after = setups.find(setup => setup.after);
      }

      testsRegistry.forEach((test, index) => {
        if (testContextIgnored || test.ignore) {
          console.log(
            SPACE,
            PENDING,
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
          const { message, actual, expected } = error;
          console.error(
            SPACE,
            FAILURE,
            colors.red(`${test.name} ${test.message}`),
            colors.gray(` - ${duration} ms`)
          );
          console.info(SPACE, ACTUAL, colors.green(actual));
          console.info(SPACE, EXPECTED, colors.red(expected));
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

export const assertDeepStrictEqual = (firstArg, secondArg) => {
  assert.assertDeepStrictEqual(firstArg, secondArg);
};
