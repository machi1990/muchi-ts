import "reflect-metadata";
import "source-map-support/register";
import TsMuchiApi from "../interfaces/ts-muchi-api";
import AfterRegistry from "../registries/after-registry";
import TestRegistry from "../registries/method-registry";
import BeforeRegistry from "../registries/method-registry";
import TestDecoratorFactory from "./factories/test-factory";
import AfterDecoratorFactory from "./factories/after-factory";
import BeforeDecoratorFactory from "./factories/before-factory";
import ContextDecoratorFactory from "./factories/context-factory";
import TsMuchiDecoratorFactory from "./factories/ts-muchi-factory";

export default (): TsMuchiApi => {
  const testRegistry: TestRegistry = new TestRegistry();
  const afterRegistry: AfterRegistry = new AfterRegistry();
  const beforeRegistry: BeforeRegistry = new BeforeRegistry();

  return {
    Test: new TestDecoratorFactory(testRegistry).create(),
    After: new AfterDecoratorFactory(afterRegistry).create(),
    Before: new BeforeDecoratorFactory(beforeRegistry).create(),
    Context: new ContextDecoratorFactory(
      beforeRegistry,
      testRegistry,
      afterRegistry
    ).create(),
    TsMuchi: new TsMuchiDecoratorFactory(
      beforeRegistry,
      testRegistry,
      afterRegistry
    ).create()
  };
};
