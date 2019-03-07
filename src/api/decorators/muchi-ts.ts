import "reflect-metadata";
import "source-map-support/register";
import MuchiTsApi from "../interfaces/muchi-ts-api";
import AfterRegistry from "../registries/after-registry";
import TestRegistry from "../registries/method-registry";
import BeforeRegistry from "../registries/method-registry";
import TestDecoratorFactory from "./factories/test-factory";
import AfterDecoratorFactory from "./factories/after-factory";
import BeforeDecoratorFactory from "./factories/before-factory";
import ContextDecoratorFactory from "./factories/context-factory";
import MuchiTsDecoratorFactory from "./factories/muchi-ts-factory";
import OnlyDecoratorFactory from "./factories/only-factory";
import MockFactory from "./factories/mock-factory";
import MockRegistry from "../registries/mock-registry";

export const muchiTsApi = (
  testFileName: string,
  timeOut: number
): MuchiTsApi => {
  const testRegistry: TestRegistry = new TestRegistry();
  const afterRegistry: AfterRegistry = new AfterRegistry();
  const beforeRegistry: BeforeRegistry = new BeforeRegistry();
  const mockRegistry: MockRegistry = new MockRegistry();

  return {
    Mock: new MockFactory(mockRegistry).create(),
    Test: new TestDecoratorFactory(testRegistry).create(),
    After: new AfterDecoratorFactory(afterRegistry).create(),
    Before: new BeforeDecoratorFactory(beforeRegistry).create(),
    Only: new OnlyDecoratorFactory().create(),
    Context: new ContextDecoratorFactory(
      beforeRegistry,
      testRegistry,
      afterRegistry,
      mockRegistry
    ).create(),
    MuchiTs: new MuchiTsDecoratorFactory(
      beforeRegistry,
      testRegistry,
      afterRegistry,
      mockRegistry,
      testFileName,
      timeOut
    ).create()
  };
};
