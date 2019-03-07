import * as colors from "colors";
import { SPACE } from "../../utils/hard-corded-value";
import { AfterSetup } from "../../interfaces/setup";
import { Logger, TYPE } from "../../utils/logger";
import RunnerOpts from "../../interfaces/runner-opts";
import canRunWithin from "../../utils/can-run-within";
import AfterRegistry from "../../registries/after-registry";
import DecoratorFactory from "../../interfaces/muchi-ts-decorator-factory";
import extractClassNameFromTarget from "../../utils/extract-class-name-from-target";
import executeOrTimeOut from "../../utils/executeOrTimeOut";

export default class AfterDecoratorFactory implements DecoratorFactory {
  constructor(private registry: AfterRegistry) {}

  public create(): MethodDecorator {
    return (target: Object, after: string, _descriptor: PropertyDescriptor) => {
      /**
       * Declare and register afterSetup.
       */
      const name = extractClassNameFromTarget(target);
      const afterSetup: AfterSetup = {
        run: async (runnerOpts: RunnerOpts) => {
          const logger: Logger = runnerOpts.logger;
          const level: number = runnerOpts.level * 2 + 1;
          const context: any = runnerOpts.contextInstance;
          const timeOut: number = runnerOpts.timeOut;
          try {
            await executeOrTimeOut(context, { method: after, name }, timeOut);
          } catch (error) {
            logger.addLog(
              TYPE.error,
              SPACE.repeat(level),
              colors.red(error.stack)
            );
          }
        },
        canRunWithin: (TestClass): boolean => canRunWithin(TestClass, target)
      };
      this.registry.register(afterSetup);
    };
  }
}
