import Decorator from "../../types/decorator";
import { Logger } from "../../utils/ts/logger";
import RunnerOpts from "../../interfaces/runner-opts";
import TsMuchiTestRunner from "./ts-muchi-test-runner";
import AfterRegistry from "../../registries/after-registry";
import BeforeRegistry from "../../registries/before-registry";
import MethodRegistry from "../../registries/method-registry";
import { TestClassOpts } from "../../interfaces/annotation-opts";
import DecoratorFactory from "../../interfaces/decorator-factory";
import ContextBuilder from "../../utils/ts/context-builder";
import { BeforeSetupRunner, AfterSetupRunner } from "./setup-runner";

export default class TsMuchiDecoratorFactory implements DecoratorFactory {
  constructor(
    private beforeRegistry: BeforeRegistry,
    private methodRegistry: MethodRegistry,
    private afterRegistry: AfterRegistry
  ) {}

  public create(): Decorator {
    return ({ name, ignore }: TestClassOpts) => testClass => {
      const message: string = name || testClass.name;
      const runnerOpts: RunnerOpts = {
        message,
        ignore,
        level: 0,
        logger: new Logger(),
        contextInstance: new ContextBuilder(testClass).build(),
        contextClazz: testClass.prototype,
        beforeRunner: new BeforeSetupRunner(),
        afterRunner: new AfterSetupRunner()
      };

      const tsMuchiTestRunner = new TsMuchiTestRunner(
        this.beforeRegistry,
        this.methodRegistry,
        this.afterRegistry
      );

      tsMuchiTestRunner
        .run(runnerOpts)
        .then(() => runnerOpts.logger.log())
        .catch(console.error);
    };
  }
}