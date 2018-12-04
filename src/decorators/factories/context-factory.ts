import RunnerOpts from "../../interfaces/runner-opts";
import { ContextSetup } from "../../interfaces/setup";
import MuchiTsTestRunner from "./muchi-ts-test-runner";
import canRunWithin from "../../utils/ts/can-run-within";
import MockRegistry from "../../registries/mock-registry";
import ContextBuilder from "../../utils/ts/context-builder";
import AfterRegistry from "../../registries/after-registry";
import BeforeRegistry from "../../registries/before-registry";
import MethodRegistry from "../../registries/method-registry";
import MuchiTsDecorator from "../../types/muchi-ts-decorator";
import DecoratorFactory from "../../interfaces/muchi-ts-decorator-factory";
import { ContextClassOpts } from "../../interfaces/annotation-opts";
import { BeforeSetupRunner, AfterSetupRunner } from "./setup-runner";

export default class ContextDecoratorFactory implements DecoratorFactory {
  constructor(
    private beforeRegistry: BeforeRegistry,
    private methodRegistry: MethodRegistry,
    private afterRegistry: AfterRegistry,
    private mockRegistry: MockRegistry
  ) {}

  public create(): MuchiTsDecorator {
    return (opts: ContextClassOpts): MethodDecorator => (
      target: Object,
      method: string,
      _descriptor: PropertyDescriptor
    ) => {
      const name = `${target.constructor}`
        .replace(/[fF]unction\s*/g, "")
        .split(/\(/)
        .shift()
        .trim();

      const message: string = opts.when || `${name}.${method}()`;
      const ignore: boolean = opts.ignore || false;
      const only: boolean = opts.only || false;

      /**
       * Create a new test setup and register it
       */
      const contextSetup: ContextSetup = {
        only,
        ignore,
        message,
        key: method,
        canRunWithin: (TestClass): boolean => canRunWithin(TestClass, target),
        run: async (currentRunnerOpts: RunnerOpts) => {
          const callerContext: any = currentRunnerOpts.contextInstance;
          const clazz = await callerContext[method]();
          if (clazz) {
            const contextClazz = clazz.prototype;
            const hasTestWithOnlyFn = !!this.methodRegistry.find(
              setup => setup.only && setup.canRunWithin(contextClazz)
            );
            const hasOnly: boolean =
              only || !currentRunnerOpts.hasOnly() || hasTestWithOnlyFn;
            if (!hasOnly) {
              return;
            }
            /**
             * Execute before methods
             */
            await currentRunnerOpts.beforeRunner.run(currentRunnerOpts);
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
              contextClazz,
              logger: currentRunnerOpts.logger,
              message: opts.when || clazz.name,
              level: currentRunnerOpts.level + 1,
              ignore: ignore || currentRunnerOpts.ignore,
              hasOnly: () => hasTestWithOnlyFn
            };

            const muchiTsTestRunner = new MuchiTsTestRunner(
              this.beforeRegistry,
              this.methodRegistry,
              this.afterRegistry,
              this.mockRegistry
            );

            await muchiTsTestRunner.run(runnerOpts);

            /**
             * Execute before methods
             */
            return currentRunnerOpts.beforeRunner.run(currentRunnerOpts);
          }
        }
      };

      this.methodRegistry.register(contextSetup);
    };
  }
}
