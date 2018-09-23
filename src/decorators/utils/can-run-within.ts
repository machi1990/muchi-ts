import { Reflection, isSame } from "../../interfaces/reflection";

const canRunWithin = (TestClass, target): boolean => {
  const testClassReflection: Reflection = {
    constructor: TestClass.prototype.constructor,
    prepertyKeys: Reflect.ownKeys(TestClass.prototype)
  };

  const targetReflextion: Reflection = {
    constructor: target.constructor,
    prepertyKeys: Reflect.ownKeys(target)
  };

  return isSame(testClassReflection, targetReflextion);
};

export default canRunWithin;
