import Decorator from "../../types/decorator";
import RunnerOpts from "../../interfaces/runner-opts";
import { ContextSetup } from "../../interfaces/setup";
import TsMuchiTestRunner from "./ts-muchi-test-runner";
import canRunWithin from "../../utils/ts/can-run-within";
import ContextBuilder from "../../utils/ts/context-builder";
import AfterRegistry from "../../registries/after-registry";
import BeforeRegistry from "../../registries/before-registry";
import MethodRegistry from "../../registries/method-registry";
import DecoratorFactory from "../../interfaces/decorator-factory";
import { ContextClassOpts } from "../../interfaces/annotation-opts";
import { BeforeSetupRunner, AfterSetupRunner } from "./setup-runner";

export default class ContextDecoratorFactory implements DecoratorFactory {
  constructor(
    private beforeRegistry: BeforeRegistry,
    private methodRegistry: MethodRegistry,
    private afterRegistry: AfterRegistry
  ) {}

  public create(): Decorator {
    return (opts: ContextClassOpts) => (target, method, _descriptor) => {
      const name = `${target.constructor}`
        .replace(/[fF]unction\s*/g, "")
        .split(/\(/)
        .shift()
        .trim();

      const message: string = opts.when || `${name}.${method}()`;
      const ignore: boolean = opts.ignore || false;

      /**
       * Create a new test setup and register it
       */
      const contextSetup: ContextSetup = {
        ignore,
        message,
        key: method,
        englobingClass: opts.englobingClass,
        canRunWithin: (TestClass): boolean => canRunWithin(TestClass, target),
        run: async (currentRunnerOpts: RunnerOpts) => {
          const callerContext: any = currentRunnerOpts.contextInstance;
          const clazz = await callerContext[method]();
          if (clazz) {
            const contextInstance = new ContextBuilder(clazz)
              .withEnglobingContext(callerContext)
              .build();

            const beforeRunner = new BeforeSetupRunner();
            beforeRunner.copyRunnerContext(currentRunnerOpts.beforeRunner);

            const afterRunner = new AfterSetupRunner();
            afterRunner.copyRunnerContext(currentRunnerOpts.afterRunner);

            const runnerOpts: RunnerOpts = {
              beforeRunner,
              afterRunner,
              contextInstance,
              contextClazz: clazz.prototype,
              logger: currentRunnerOpts.logger,
              message: opts.when || clazz.name,
              level: currentRunnerOpts.level + 1,
              ignore: ignore || currentRunnerOpts.ignore
            };

            const tsMuchiTestRunner = new TsMuchiTestRunner(
              this.beforeRegistry,
              this.methodRegistry,
              this.afterRegistry
            );

            return tsMuchiTestRunner.run(runnerOpts);
          }
        }
      };

      this.methodRegistry.register(contextSetup);

      /**
       * TODO englobing clazz and attributes
       */
    };
  }
}
