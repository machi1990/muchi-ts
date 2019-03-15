import AssertionOptions from "../interfaces/assertion-error";

export default (context: any, { name, method }: any, timeOut: number) => {
  return Promise.race([
    context[method](),
    new Promise((_, reject) => {
      setTimeout(() => {
        const timeOutError: AssertionOptions = {
          operator: undefined,
          expected: undefined,
          actual: undefined,
          stack: `${name}.${method}() has depassed a time out of ${timeOut}ms.`
        };
        reject(timeOutError);
      }, timeOut);
    })
  ]);
};
