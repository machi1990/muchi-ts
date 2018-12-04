import { assertEqual } from "..";
import TestClass from "./test";
import { assertTruthy } from "../src/assertion";

@MuchiTs({ name: "@Only Test", ignore: false })
@Only()
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
    assertEqual(one, "one");
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
