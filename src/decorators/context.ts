import canRunWithin from "../utils/can-run-within";
import AnnotationOpts from "../interfaces/annotation-opts";
import { TestSetup, ContextSetup } from "../interfaces/setup";
import TestRegistry from "../registries/test-registry";

const context = (registry: TestRegistry) => {
  const contextDecorator = ({
    ignore = false,
    message = ""
  }: AnnotationOpts) => (target, key, _descriptor) => {
    let recordedOrder: number;

    const contextSetup: ContextSetup = {
      name: message,
      ignore
    };

    const testWithSameContextSetup: TestSetup = registry.findTestWithSameContextSetup(
      contextSetup,
      target
    );

    if (testWithSameContextSetup) {
      /**
       * Context already registered with the target class.
       * Updates ignore value an update previous registerd value
       */
      contextSetup.ignore =
        testWithSameContextSetup.contextSetup.ignore || ignore;
      testWithSameContextSetup.contextSetup = contextSetup;
      recordedOrder = testWithSameContextSetup.order;
    }

    const correspondingTestSetup: TestSetup = registry.findTestSetupByName(
      key,
      target
    );

    if (correspondingTestSetup) {
      /**
       * Tests already registered using @Test decorator
       * Update test setup ignore, order and contextSetup values
       */
      correspondingTestSetup.contextSetup = contextSetup;
      correspondingTestSetup.ignore =
        contextSetup.ignore || correspondingTestSetup.ignore;
      correspondingTestSetup.order =
        recordedOrder !== undefined
          ? recordedOrder
          : correspondingTestSetup.order;
    } else {
      /**
       * Declare a new test setup and register it.
       */
      const testSetup: TestSetup = {
        key,
        contextSetup,
        ignore: undefined,
        message: undefined,
        order: recordedOrder !== undefined ? recordedOrder : registry.size(),
        run: context => context[key](),
        canRunWithin: (TestClass): boolean => canRunWithin(TestClass, target)
      };
      registry.register(testSetup);
    }
  };
  return contextDecorator;
};

export default context;
