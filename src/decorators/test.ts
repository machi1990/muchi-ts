import AnnotationOpts from "../interfaces/annotation-opts";
import { TestSetup } from "../interfaces/setup";
import canRunWithin from "./utils/can-run-within";

const test = (testsSetups: Array<TestSetup>) => (
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

    const test: TestSetup = {
      message: opts.message || `${name}.${key}()`,
      ignore: opts.ignore,
      run: context => context[key](),
      canRunWithin: (TestClass): boolean => canRunWithin(TestClass, target)
    };

    testsSetups.push(test);
  };
};

export default test;
