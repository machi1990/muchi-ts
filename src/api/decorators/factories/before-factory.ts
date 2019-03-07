import * as colors from "colors";
import { TYPE, Logger } from "../../utils/logger";
import { SPACE } from "../../utils/hard-corded-value";
import { BeforeSetup } from "../../interfaces/setup";
import RunnerOpts from "../../interfaces/runner-opts";
import canRunWithin from "../../utils/can-run-within";
import executeOrTimeOut from "../../utils/executeOrTimeOut";
import BeforeRegistry from "../../registries/before-registry";
import DecoratorFactory from "../../interfaces/muchi-ts-decorator-factory";
import extractClassNameFromTarget from "../../utils/extract-class-name-from-target";

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
      const name = extractClassNameFromTarget(target);

      const beforeSetup: BeforeSetup = {
        run: async (runnerOpts: RunnerOpts) => {
          const level: number = runnerOpts.level * 2 + 1;
          const logger: Logger = runnerOpts.logger;
          const context: any = runnerOpts.contextInstance;
          const timeOut: number = runnerOpts.timeOut;

          try {
            await executeOrTimeOut(context, { method: before, name }, timeOut);
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
      this.registry.register(beforeSetup);
    };
  }
}
