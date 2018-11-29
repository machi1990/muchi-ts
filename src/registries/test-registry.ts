import Registry from "./registry";
import { TestSetup, ContextSetup } from "../interfaces/setup";
import compareTestSetup from "../utils/compare-test-setup";

export default class TestRegistry extends Registry<TestSetup> {
  public sort(): void {
    this.sortBy(compareTestSetup);
  }

  public findTestWithSameContextSetup(
    contextSetup: ContextSetup,
    target: any
  ): TestSetup {
    return this.find(
      ({
        canRunWithin,
        contextSetup: testContextSetup = { name: undefined }
      }) => {
        return (
          contextSetup.name === testContextSetup.name && canRunWithin(target)
        );
      }
    );
  }

  public findTestSetupByName(key, target): TestSetup {
    return this.find(({ key: testKey, canRunWithin }) => {
      return key === testKey && canRunWithin(target);
    });
  }
}
