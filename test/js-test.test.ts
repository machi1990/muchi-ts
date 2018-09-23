import {
  test,
  after,
  before,
  JsMuchi,
  assertEqual,
  assertStrictEqual,
  assertDeepEqual
} from "../";

import Test from "./test";

@JsMuchi({ message: "JsTesting using Annotation" })
class JsTest {
  private test: Test;

  constructor() {}

  @before
  before(): void {
    this.test = new Test();
  }

  @after
  after(): any {
    this.test = null;
  }

  @test({
    message: "one string equality",
    ignore: false
  })
  oneStringEqualityTest(): void {
    // When
    const one: string = this.test.oneString();

    // Then
    assertEqual(one, "one");
  }

  @test({
    message: "one string strict equality",
    ignore: true
  })
  oneStringStrictEqualityTest(): void {
    // When
    const one: string = this.test.oneString();

    // Then
    assertStrictEqual(one, "one");
  }

  @test({ message: "one number equality with string" })
  oneNumberEqualToOneStringTest(): void {
    // When
    const one: number = this.test.oneNumber();

    // Then
    assertEqual(one, "1");
  }

  @test({ message: "one number strict equality with string" })
  oneNumberStrictEqualToOneStringTest(): void {
    // When
    const one: number = this.test.oneNumber();

    // Then
    assertStrictEqual(one, "1");
  }

  @test({ message: "object strict equality with object" })
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

  @test({ message: "one number strict equality with string" })
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

  @test({ message: "Async function" })
  async asyncFunctionTesting(): Promise<void> {
    //When
    const actual = await this.test.testAsync();

    // Then
    assertEqual(actual, "Hello async world");
  }
}
