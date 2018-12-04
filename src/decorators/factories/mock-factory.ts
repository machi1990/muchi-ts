import { stub } from "dada-js";
import MuchiTsDecorator from "../../types/muchi-ts-decorator";
import { MockSetup } from "../../interfaces/setup";
import canRunWithin from "../../utils/ts/can-run-within";
import MockRegistry from "../../registries/mock-registry";
import DecoratorFactory from "../../interfaces/muchi-ts-decorator-factory";
import RunnerOpts from "../../interfaces/runner-opts";

export default class MockFactory implements DecoratorFactory {
  constructor(private mockRegistry: MockRegistry) {}
  public create(): MuchiTsDecorator {
    return (Class: any): PropertyDecorator => {
      return (target: Object, key: string) => {
        const mockSetup: MockSetup = {
          key,
          canRunWithin: TestClass => canRunWithin(TestClass, target),
          run: (runnerOpts: RunnerOpts) => {
            const MockClass = () => {};
            MockClass.prototype = Class.prototype;

            const obj: Object = new MockClass();
            const methods = Reflect.ownKeys(
              Object.getPrototypeOf(Class.prototype)
            );
            methods.forEach(fnName => {
              obj[fnName] = stub(obj, fnName);
            });
            runnerOpts.contextInstance[key] = obj;
          }
        };

        this.mockRegistry.register(mockSetup);
      };
    };
  }
}
