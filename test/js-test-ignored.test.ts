import {
  run,
  test,
  after,
  before,
  assertEqual,
  assertStrictEqual,
  assertDeepEqual
} from "../";

import Test from "./test";

@run({ message: "Ignored JsTesting using Annotation", ignore: true })
class JsTestIgnored {
  private test: Test;

  constructor() {}

  @before
  before(): void {
    this.test = new Test();
  }

  @after
  after(): void {
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
}
