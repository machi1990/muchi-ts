import { stub } from "dada-js";
import { MockSetup } from "../../interfaces/setup";
import RunnerOpts from "../../interfaces/runner-opts";
import canRunWithin from "../../utils/can-run-within";
import MockRegistry from "../../registries/mock-registry";
import MuchiTsDecorator from "../../types/muchi-ts-decorator";
import DecoratorFactory from "../../interfaces/muchi-ts-decorator-factory";

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
            for (const method in obj) {
              if (method === "constructor" || typeof obj[method] !== "function")
                continue;
              obj[method] = stub(obj, method);
            }
            runnerOpts.contextInstance[key] = obj;
          }
        };

        this.mockRegistry.register(mockSetup);
      };
    };
  }
}
