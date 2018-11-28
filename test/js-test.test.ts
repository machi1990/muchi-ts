import {
  Test,
  After,
  Before,
  Context,
  JsMuchi,
  assertEqual,
  assertStrictEqual,
  assertDeepEqual
} from "../";

import TestClass from "./test";

@JsMuchi({ message: "JsTesting using Annotation" })
class JsTest {
  private test: TestClass;

  constructor() {}

  @Before
  before(): void {
    this.test = new TestClass();
  }

  @After
  after(): any {
    this.test = null;
  }

  @Test({
    message: "one string equality",
    ignore: false
  })
  oneStringEqualityTest(): void {
    // When
    const one: string = this.test.oneString();

    // Then
    assertEqual(one, "one");
  }

  @Test({
    message: "one string strict equality",
    ignore: true
  })
  oneStringStrictEqualityTest(): void {
    // When
    const one: string = this.test.oneString();

    // Then
    assertStrictEqual(one, "one");
  }

  @Test({ message: "one number equality with string" })
  oneNumberEqualToOneStringTest(): void {
    // When
    const one: number = this.test.oneNumber();

    // Then
    assertEqual(one, "1");
  }

  @Test({ message: "one number strict equality with string" })
  oneNumberStrictEqualToOneStringTest(): void {
    // When
    const one: number = this.test.oneNumber();

    // Then
    assertStrictEqual(one, "1");
  }

  @Test({ message: "object strict equality with object" })
  objectStrictEqualTest(): void {
    // When
    const helloWorld: Object = this.test.object();

    // Then
    assertStrictEqual(helloWorld, {
      en: {
        saying: "hello world"
      },
      fr: {
        saying: "bonjour le monde"
      }
    });
  }

  @Test({ message: "Async function third" })
  @Context({ message: "When testing async" })
  async asyncFunctionTesting3(): Promise<void> {
    //When
    const actual = await this.test.testAsync();

    // Then
    assertEqual(actual, "Hello async world");
  }

  @Test({ message: "one number strict equality with string" })
  objectStrictNotEqualTest(): void {
    // When
    const helloWorld: Object = this.test.object();

    // Then
    assertDeepEqual(helloWorld["fr"], {
      en: {
        saying: "hello world"
      }
    });
  }

  @Test({ message: "Async function first" })
  @Context({ message: "When testing async" })
  async asyncFunctionTesting(): Promise<void> {
    //When
    const actual = await this.test.testAsync();

    // Then
    assertEqual(actual, "Hello async world");
  }

  @Test({ message: "Async function second" })
  @Context({ message: "When testing async" })
  async asyncFunctionTesting2(): Promise<void> {
    //When
    const actual = await this.test.testAsync();

    // Then
    assertEqual(actual, "Hello async world");
  }
}
