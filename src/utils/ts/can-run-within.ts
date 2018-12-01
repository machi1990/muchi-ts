import { Reflection, isSame } from "../../interfaces/reflection";

/**
 * Checks if two classes are the same #mini-hack
 * @param TestClass
 * @param target
 */
const canRunWithin = (TestClass, target): boolean => {
  const testClassReflection: Reflection = {
    constructor: TestClass.constructor,
    prepertyKeys: Reflect.ownKeys(TestClass)
  };

  const targetReflextion: Reflection = {
    constructor: target.constructor,
    prepertyKeys: Reflect.ownKeys(target)
  };

  return isSame(testClassReflection, targetReflextion);
};

export default canRunWithin;
