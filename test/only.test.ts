import TestClass from "./test";
import { assertEqual, assertTruthy } from "..";

@MuchiTs({ name: "@Only Test", ignore: false })
class OnlyTest {
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
    assertEqual(one, "on");
  }

  @Test({
    it: "undefined to be false",
    ignore: false
  })
  undefinedShouldBeFalsy(): void {
    // Given
    const val = undefined;
    // When

    // Then
    assertTruthy(!undefined);
  }
}
