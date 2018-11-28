import canRunWithin from "../utils/can-run-within";
import AnnotationOpts from "../interfaces/annotation-opts";
import { TestSetup, ContextSetup } from "../interfaces/setup";

/**
 * TODO - test setup registry
 */

const context = (testsSetups: Array<TestSetup>) => {
  const contextDecorator = ({
    ignore = false,
    message = ""
  }: AnnotationOpts) => (target, key, _descriptor) => {
    let recordedOrder: number;

    const contextSetup: ContextSetup = {
      name: message,
      ignore
    };

    const testWithSameContextSetup: TestSetup = testsSetups.find(
      ({
        canRunWithin,
        contextSetup: testContextSetup = { name: undefined }
      }) => {
        return (
          contextSetup.name === testContextSetup.name && canRunWithin(target)
        );
      }
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

    const correspondingTestSetup: TestSetup = testsSetups.find(
      ({ key: testKey, canRunWithin }) => {
        return key === testKey && canRunWithin(target);
      }
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
        order: recordedOrder !== undefined ? recordedOrder : testsSetups.length,
        run: context => context[key](),
        canRunWithin: (TestClass): boolean => canRunWithin(TestClass, target)
      };
      testsSetups.push(testSetup);
    }
  };
  return contextDecorator;
};

export default context;
