import {
  Test,
  After,
  Before,
  Context,
  JsMuchi,
  assertEqual,
  assertStrictEqual
} from "../";

import TestClass from "./test";

@JsMuchi({ message: "Ignored JsTesting using Annotation", ignore: true })
class JsTestIgnored {
  private test: TestClass;

  constructor() {}

  @Before
  before(): void {
    this.test = new TestClass();
  }

  @After
  after(): void {
    this.test = null;
  }

  @Test()
  oneStringEqualityTest(): void {
    // When
    const one: string = this.test.oneString();

    // Then
    assertEqual(one, "one");
  }

  @Test()
  oneStringStrictEqualityTest(): void {
    // When
    const one: string = this.test.oneString();

    // Then
    assertStrictEqual(one, "one");
  }

  @Test({ message: "one number equality with string", ignore: false })
  oneNumberEqualToOneStringTest(): void {
    // When
    const one: number = this.test.oneNumber();

    // Then
    assertEqual(one, "1");
  }

  @Test({ message: "one number strict equality with string", ignore: true })
  oneNumberStrictEqualToOneStringTest(): void {
    // When
    const one: number = this.test.oneNumber();
    // Then
    assertStrictEqual(one, "1");
  }

  @Test({ message: "Async function first" })
  @Context({ message: "When testing async" })
  async asyncFunctionTesting1(): Promise<void> {
    //When
    const actual = await this.test.testAsync();

    // Then
    assertEqual(actual, "Hello async world");
  }

  @Test({ message: "Async function second" })
  @Context({ message: "When testing async" })
  async asyncFunctionTesting1(): Promise<void> {
    //When
    const actual = await this.test.testAsync();

    // Then
    assertEqual(actual, "Hello async world");
  }
}
