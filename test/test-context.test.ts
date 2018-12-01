import TestClass from "./test";
import { Context, TsMuchi, Test, assertEqual, Before } from "..";

class ContextTestInContainer3 {
  private test: TestClass;

  @Before
  public before() {
    this.test = new TestClass();
  }

  @Test({ it: "Async function third" })
  async contextFunctionTesting3(): Promise<void> {
    //When
    const actual = await this.test.testAsync();

    // Then
    assertEqual(actual, "Hello asnc world");
  }
}

class ContextTestInContainer2 {
  private test: TestClass;

  @Test({ it: "Async function second" })
  async contextFunctionTesting2(): Promise<void> {
    //When
    const actual = await this.test.testAsync();

    // Then
    assertEqual(actual, "Hello async world");
  }

  @Context({
    englobingClass: ContextTestInContainer2,
    when: "testing context api sub sub level"
  })
  async contextFunctionTesting3() {
    return ContextTestInContainer3;
  }
}

class ContextTestInContainer {
  private test: TestClass;

  @Test({ it: "Context function first" })
  async contextFunctionTesting1(): Promise<void> {
    //When
    const actual = await this.test.testAsync();

    // Then
    assertEqual(actual, "Hello async world");
  }

  @Context({
    englobingClass: ContextTestInContainer,
    when: "testing context api sub level",
    ignore: true
  })
  async contextFunctionTesting2() {
    return ContextTestInContainer2;
  }
}

@TsMuchi({
  name: "Context Annotation",
  ignore: false
})
class ContextTest {
  private test: TestClass;

  @Before
  public before() {
    this.test = new TestClass();
  }

  @Context({
    englobingClass: ContextTest,
    when: "testing context api",
    ignore: false
  })
  public shouldRunAllTestInContainer(): any {
    return ContextTestInContainer;
  }

  @Test({ it: "one number equality with string" })
  oneNumberEqualToOneStringTest(): void {
    // When
    const one: number = this.test.oneNumber();
    // Then
    assertEqual(one, "1");
  }

  @Test({
    it: "adds two to one"
  })
  public onePlusTwoEqualsThree() {
    // Given
    const one = 1;
    const two = 2;
    const expected = 3;
    // When
    const actual = one + two;
    // Then
    assertEqual(actual, expected);
  }
}
