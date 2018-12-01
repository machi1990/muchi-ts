import Decorator from "../../types/decorator";
import { AfterSetup } from "../../interfaces/setup";
import { Logger, TYPE } from "../../utils/ts/logger";
import RunnerOpts from "../../interfaces/runner-opts";
import canRunWithin from "../../utils/ts/can-run-within";
import AfterRegistry from "../../registries/after-registry";
import DecoratorFactory from "../../interfaces/decorator-factory";

export default class AfterDecoratorFactory implements DecoratorFactory {
  constructor(private registry: AfterRegistry) {}

  public create(): Decorator {
    return (target, after, _descriptor) => {
      /**
       * Declare and register after setup.
       */
      const afterSetup: AfterSetup = {
        run: async (runnerOpts: RunnerOpts) => {
          const logger: Logger = runnerOpts.logger;
          const context: any = runnerOpts.contextInstance;
          try {
            await context[after]();
          } catch (error) {
            logger.addLog(TYPE.error, error.stack);
          }
        },
        canRunWithin: (TestClass): boolean => canRunWithin(TestClass, target)
      };
      this.registry.register(afterSetup);
    };
  }
}
