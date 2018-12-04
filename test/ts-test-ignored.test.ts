import { assertEqual, assertStrictEqual } from "..";

import TestClass from "./test";

@MuchiTs({ name: "Ignored flag on MuchiTs Annotation", ignore: true })
class TsTestIgnored {
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

  @Test({
    it: "checks equality"
  })
  oneStringEqualityTest(): void {
    // When
    const one: string = this.test.oneString();

    // Then
    assertEqual(one, "one");
  }

  @Test({
    it: "checks strict equality"
  })
  oneStringStrictEqualityTest(): void {
    // When
    const one: string = this.test.oneString();

    // Then
    assertStrictEqual(one, "one");
  }

  @Test({ it: "one number equality with string", ignore: false })
  oneNumberEqualToOneStringTest(): void {
    // When
    const one: number = this.test.oneNumber();

    // Then
    assertEqual(one, "1");
  }

  @Test({ it: "tests one number strict equality with string", ignore: true })
  oneNumberStrictEqualToOneStringTest(): void {
    // When
    const one: number = this.test.oneNumber();
    // Then
    assertStrictEqual(one, "1");
  }

  @Test({ it: "tests async function first" })
  async asyncFunctionTesting1(): Promise<void> {
    //When
    const actual = await this.test.testAsync();

    // Then
    assertEqual(actual, "Hello async world");
  }

  @Test({ it: "tests async function second" })
  async asyncFunctionTesting2(): Promise<void> {
    //When
    const actual = await this.test.testAsync();

    // Then
    assertEqual(actual, "Hello async world");
  }
}
