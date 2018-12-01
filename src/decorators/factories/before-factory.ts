import Decorator from "../../types/decorator";
import { TYPE, Logger } from "../../utils/ts/logger";
import { BeforeSetup } from "../../interfaces/setup";
import RunnerOpts from "../../interfaces/runner-opts";
import canRunWithin from "../../utils/ts/can-run-within";
import BeforeRegistry from "../../registries/before-registry";
import DecoratorFactory from "../../interfaces/decorator-factory";

export default class BeforeDecoratorFactory implements DecoratorFactory {
  constructor(private registry: BeforeRegistry) {}

  public create(): Decorator {
    return (
      target: Object,
      before: string | number,
      _descriptor: PropertyDescriptor
    ) => {
      /**
       * Declare and register before setup.
       */
      const beforeSetup: BeforeSetup = {
        run: async (runnerOpts: RunnerOpts) => {
          const logger: Logger = runnerOpts.logger;
          const context: any = runnerOpts.contextInstance;
          try {
            await context[before]();
          } catch (error) {
            logger.addLog(TYPE.error, error.stack);
          }
        },
        canRunWithin: (TestClass): boolean => canRunWithin(TestClass, target)
      };
      this.registry.register(beforeSetup);
    };
  }
}
