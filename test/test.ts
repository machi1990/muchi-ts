export default class Test {
  constructor() {}

  oneString(): string {
    return "one";
  }

  oneNumber(): number {
    return 1;
  }

  object(): Object {
    return {
      en: {
        saying: "hello world"
      },
      fr: {
        saying: "bonjour le monde"
      }
    };
  }
}
