import { assertEqual, reflect } from "..";
import TestClass from "./test";

class TestGrandChild extends TestClass {
  constructor(hello) {
    super();
    console.log(hello.repeat(5));
  }
}

class ClassWithMock {
  constructor(private mock: TestGrandChild) {}

  public callMock(): number {
    return this.mock.oneNumber();
  }
}

@MuchiTs({ name: "Mocking Annotation", ignore: false })
class TsTest {
  @Mock(TestGrandChild)
  private mock: TestClass;

  private classWithMock: ClassWithMock;

  private;
  constructor() {}

  @Before
  public before() {
    this.classWithMock = new ClassWithMock(this.mock);
  }

  @After
  public after() {
    this.classWithMock = null;
  }

  @Test({
    it: "maintains instance of behaviour",
    ignore: false
  })
  isInstanceOf(): void {
    // When
    const isInstanceOf: boolean = this.mock instanceof TestGrandChild;

    // Then
    assertEqual(isInstanceOf, true);
  }

  @Test({
    it: "calls mock's methods",
    ignore: false
  })
  mockShouldBeCalled(): void {
    // When
    this.classWithMock.callMock();

    // Then
    assertEqual(reflect(this.mock.oneNumber).callCount(), 1);
  }
}
