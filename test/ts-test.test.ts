import {
  Test,
  After,
  Before,
  TsMuchi,
  assertEqual,
  assertStrictEqual,
  assertDeepEqual
} from "..";

import TestClass from "./test";

@TsMuchi({ name: "Test, Before, After, TsMuchi Annotation", ignore: false })
class TsTest {
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
    it: "one string equality",
    ignore: false
  })
  oneStringEqualityTest(): void {
    // When
    const one: string = this.test.oneString();

    // Then
    assertEqual(one, "one");
  }

  @Test({
    it: "one string strict equality",
    ignore: true
  })
  oneStringStrictEqualityTest(): void {
    // When
    const one: string = this.test.oneString();

    // Then
    assertStrictEqual(one, "one");
  }

  @Test({ it: "one number equality with string" })
  oneNumberEqualToOneStringTest(): void {
    // When
    const one: number = this.test.oneNumber();

    // Then
    assertEqual(one, "1");
  }

  @Test({ it: "one number strict equality with string" })
  oneNumberStrictEqualToOneStringTest(): void {
    // When
    const one: number = this.test.oneNumber();

    // Then
    assertStrictEqual(one, "1");
  }

  @Test({ it: "object strict equality with object" })
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

  @Test({ it: "one number strict equality with string" })
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

  @Test({ it: "Async function" })
  async asyncFunctionTesting(): Promise<void> {
    //When
    const actual = await this.test.testAsync();

    // Then
    assertEqual(actual, "Hello async world");
  }
}
