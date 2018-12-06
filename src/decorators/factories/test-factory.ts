import * as colors from "colors";
import { Op } from "../../utils/op";
import MuchiTsDecorator from "../../types/muchi-ts-decorator";
import { TestSetup } from "../../interfaces/setup";
import { TYPE, Logger } from "../../utils/logger";
import RunnerOpts from "../../interfaces/runner-opts";
import canRunWithin from "../../utils/can-run-within";
import TestRegistry from "../../registries/method-registry";
import DecoratorFactory from "../../interfaces/muchi-ts-decorator-factory";
import { TestMethodOpts } from "../../interfaces/annotation-opts";
import {
  SPACE,
  EXPECTS,
  PASSED,
  FAILED,
  SKIPPED
} from "../../utils/hard-corded-value";

export default class TestDecoratorFactory implements DecoratorFactory {
  constructor(private registry: TestRegistry) {}
  public create(): MuchiTsDecorator {
    return (opts: TestMethodOpts): MethodDecorator => {
      return (
        target: Object,
        method: string,
        _descriptor: PropertyDescriptor
      ) => {
        const name = `${target.constructor}`
          .replace(/[fF]unction\s*/g, "")
          .split(/\(/)
          .shift()
          .trim();

        const message: string = opts.it || `${name}.${method}()`;
        const ignore: boolean = opts.ignore || false;
        const only: boolean = opts.only || false;
        /**
         * Create a new test setup and register it
         */
        const testSetup: TestSetup = {
          only,
          ignore,
          message,
          key: method,
          canRunWithin: (TestClass): boolean => canRunWithin(TestClass, target),
          run: (runnerOpts: RunnerOpts) => {
            if (runnerOpts.hasOnly() && !only) {
              return;
            }

            return run(runnerOpts, { method, ignore, message });
          }
        };

        this.registry.register(testSetup);
      };
    };
  }
}

const run = async (runnerOpts: RunnerOpts, { method, ignore, message }) => {
  const level: number = runnerOpts.level * 2;
  const logger: Logger = runnerOpts.logger;
  const skipTest = ignore || runnerOpts.ignore;
  const context: any = runnerOpts.contextInstance;

  if (skipTest) {
    runnerOpts.logger.addLog(
      TYPE.log,
      SPACE.repeat(level + 1),
      SKIPPED,
      colors.cyan(message)
    );
  } else {
    /**
     * Execute before methods
     */
    await runnerOpts.beforeRunner.run(runnerOpts);

    let duration: number = 0;
    const startTime: number = Date.now();
    try {
      await context[method]();
      duration = Date.now() - startTime;
      logger.addLog(
        TYPE.log,
        SPACE.repeat(level + 1),
        PASSED,
        colors.green(message),
        colors.gray(`- ${duration} ms`) // tests logs
      );
    } catch (error) {
      duration = Date.now() - startTime;
      const { actual, expected, operator, stack } = error;
      logger.addLog(
        TYPE.error,
        SPACE.repeat(level + 1),
        FAILED,
        colors.red(message),
        colors.gray(` - ${duration} ms`)
      );
      logger.addLog(
        TYPE.error,
        SPACE.repeat(level + 2),
        EXPECTS,
        colors.white(actual),
        colors.bold(`${Op[operator]}`),
        colors.white(expected)
      );
      logger.addLog(TYPE.error, SPACE.repeat(level + 2), colors.red(stack));
    }
    /**
     * Execute after methods
     */
    await runnerOpts.afterRunner.run(runnerOpts);
  }
};
