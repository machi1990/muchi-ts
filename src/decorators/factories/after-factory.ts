import { AfterSetup } from "../../interfaces/setup";
import { Logger, TYPE } from "../../utils/logger";
import RunnerOpts from "../../interfaces/runner-opts";
import canRunWithin from "../../utils/can-run-within";
import AfterRegistry from "../../registries/after-registry";
import DecoratorFactory from "../../interfaces/muchi-ts-decorator-factory";

export default class AfterDecoratorFactory implements DecoratorFactory {
  constructor(private registry: AfterRegistry) {}

  public create(): MethodDecorator {
    return (target: Object, after: string, _descriptor: PropertyDescriptor) => {
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
