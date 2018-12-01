import { mock } from "dada-js";
import Decorator from "../../types/decorator";
import { MockSetup } from "../../interfaces/setup";
import canRunWithin from "../../utils/ts/can-run-within";
import MockRegistry from "../../registries/mock-registry";
import DecoratorFactory from "../../interfaces/decorator-factory";
import RunnerOpts from "../../interfaces/runner-opts";

export default class MockFactory implements DecoratorFactory {
  constructor(private mockRegistry: MockRegistry) {}
  public create(): Decorator {
    return (Class: any) => {
      return (target: Object, key: string | number) => {
        const mockSetup: MockSetup = {
          key,
          canRunWithin: TestClass => canRunWithin(TestClass, target),
          run: (runnerOpts: RunnerOpts) => {
            const MockClass = () => {};
            MockClass.prototype = Class.prototype;

            const mockObj: Object = new MockClass();
            const methods = Reflect.ownKeys(
              Object.getPrototypeOf(Class.prototype)
            );
            methods.forEach(fnName => {
              mockObj[fnName] = mock(mockObj, fnName);
            });
            runnerOpts.contextInstance[key] = mockObj;
          }
        };

        this.mockRegistry.register(mockSetup);
      };
    };
  }
}
