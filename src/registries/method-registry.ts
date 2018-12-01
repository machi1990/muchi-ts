import Registry from "./registry";
import { MethodSetup } from "../interfaces/setup";

export default class MethodRegistry extends Registry<MethodSetup> {
  public findTestSetupByName(key, target): MethodSetup {
    return this.find(({ key: testKey, canRunWithin }) => {
      return key === testKey && canRunWithin(target);
    });
  }
}
