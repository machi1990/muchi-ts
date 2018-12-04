import MuchiTsDecorator from "../../types/muchi-ts-decorator";
import { Logger } from "../../utils/ts/logger";
import RunnerOpts from "../../interfaces/runner-opts";
import MuchiTsTestRunner from "./muchi-ts-test-runner";
import AfterRegistry from "../../registries/after-registry";
import BeforeRegistry from "../../registries/before-registry";
import MethodRegistry from "../../registries/method-registry";
import { TestClassOpts } from "../../interfaces/annotation-opts";
import DecoratorFactory from "../../interfaces/muchi-ts-decorator-factory";
import ContextBuilder from "../../utils/ts/context-builder";
import { BeforeSetupRunner, AfterSetupRunner } from "./setup-runner";
import MockRegistry from "../../registries/mock-registry";

export default class MuchiTsDecoratorFactory implements DecoratorFactory {
  constructor(
    private beforeRegistry: BeforeRegistry,
    private methodRegistry: MethodRegistry,
    private afterRegistry: AfterRegistry,
    private mockRegistry: MockRegistry
  ) {}

  public create(): MuchiTsDecorator {
    return ({ name, ignore }: TestClassOpts): ClassDecorator => testClass => {
      const message: string = name || testClass.name;
      const runnerOpts: RunnerOpts = {
        message,
        ignore,
        level: 0,
        logger: new Logger(),
        contextInstance: new ContextBuilder(testClass).build(),
        contextClazz: testClass.prototype,
        beforeRunner: new BeforeSetupRunner(),
        afterRunner: new AfterSetupRunner(),
        hasOnly: () => {
          return !!this.methodRegistry.find(({ only }) => only);
        }
      };

      const muchiTsTestRunner = new MuchiTsTestRunner(
        this.beforeRegistry,
        this.methodRegistry,
        this.afterRegistry,
        this.mockRegistry
      );

      muchiTsTestRunner
        .run(runnerOpts)
        .then(() => runnerOpts.logger.log())
        .catch(console.error);
    };
  }
}
