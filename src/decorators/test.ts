import { TestSetup } from "../interfaces/setup";
import canRunWithin from "../utils/can-run-within";
import AnnotationOpts from "../interfaces/annotation-opts";
import TestRegistry from "../registries/test-registry";

const test = (registry: TestRegistry) => (
  opts: AnnotationOpts = {
    message: "",
    ignore: false
  }
) => {
  return (target, key, _descriptor) => {
    const name = `${target.constructor}`
      .replace(/[fF]unction\s*/g, "")
      .split(/\(/)
      .shift()
      .trim();

    const message: string = opts.message || `${name}.${key}()`;
    const ignore: boolean = opts.ignore || false;

    const correspondingTest: TestSetup = registry.find(
      ({ key: testKey, canRunWithin }) => {
        return key === testKey && canRunWithin(target);
      }
    );

    if (correspondingTest) {
      /**
       * Tests already registered using @Context decorator
       * Updates only message and ignore values
       */
      correspondingTest.message = message;
      correspondingTest.ignore =
        correspondingTest.contextSetup.ignore || ignore;
    } else {
      /**
       * Create a new test setup and register it
       */
      const testSetup: TestSetup = {
        key,
        ignore,
        message,
        order: registry.size(),
        run: context => context[key](),
        canRunWithin: (TestClass): boolean => canRunWithin(TestClass, target)
      };
      registry.register(testSetup);
    }
  };
};

export default test;
