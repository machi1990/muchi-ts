export default class ContextBuilder {
  private context = null;

  constructor(private fromClass: any) {}

  public withEnglobingContext(context): ContextBuilder {
    this.context = context;
    return this;
  }

  public build(): any {
    const instance = new this.fromClass();
    if (!this.context) return instance;

    const instanceAttributes: Array<any> = instanceKeys(instance);

    instanceKeys(this.context).forEach(contextAttribute => {
      const containsKey = instanceAttributes.some(instanceAttribute => {
        if (
          typeof contextAttribute === "symbol" &&
          typeof instanceAttribute === "symbol"
        ) {
          return (
            Symbol.keyFor(contextAttribute) === Symbol.keyFor(instanceAttribute)
          );
        }
        return contextAttribute === instanceAttribute;
      });

      if (!containsKey) {
        instance[contextAttribute] = this.context[contextAttribute];
      }
    });

    return instance;
  }
}

function instanceKeys(instance) {
  const keys = [];
  for (const key in instance) keys.push(key);
  return keys;
}
