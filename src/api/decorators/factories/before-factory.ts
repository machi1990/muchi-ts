import { TYPE, Logger } from "../../utils/logger";
import { BeforeSetup } from "../../interfaces/setup";
import RunnerOpts from "../../interfaces/runner-opts";
import canRunWithin from "../../utils/can-run-within";
import BeforeRegistry from "../../registries/before-registry";
import DecoratorFactory from "../../interfaces/muchi-ts-decorator-factory";

export default class BeforeDecoratorFactory implements DecoratorFactory {
  constructor(private registry: BeforeRegistry) {}

  public create(): MethodDecorator {
    return (
      target: Object,
      before: string,
      _descriptor: PropertyDescriptor
    ) => {
      /**
       * Declare and register beforeSetup.
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
