import AssertionOptions from "../interfaces/assertion-error";

export default (context, { name, method }, timeOut) => {
  return Promise.race([
    context[method](),
    new Promise((resolve, reject) => {
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
