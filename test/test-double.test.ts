import { stub } from "dada-js";
import { assertNotEqual, assertEqual, reflect, revive } from "..";

interface Stub {
  fn: () => any;
}

class ReviveTest {
  private stub: Stub = {
    fn: () => 1
  };

  @Before
  public createTestDoubleFn() {
    stub(this.stub, "fn");
  }

  @Test({
    it: "restores test double methods"
  })
  public testReviveMethodsReflection() {
    // When
    revive(this.stub.fn);
    // Then
    assertEqual(this.stub.fn["reset"], undefined);
    assertEqual(this.stub.fn(), 1);
  }
}

@MuchiTs({
  name: ".reflect()"
})
@Only()
class ReflectMockTest {
  private objToStub: Stub = {
    fn: () => {}
  };

  @Before
  public createTestDoubleFn() {
    stub(this.objToStub, "fn");
  }

  @Test({
    it: "reflects test double methods"
  })
  public testMockObjMethodsReflection() {
    // When
    const reflection = reflect(this.objToStub.fn);

    // Then
    assertNotEqual(reflection.args, undefined);
    assertNotEqual(reflection.when, undefined);
    assertNotEqual(reflection.reset, undefined);
    assertNotEqual(reflection.throws, undefined);
    assertNotEqual(reflection.returns, undefined);
    assertNotEqual(reflection.inspect, undefined);
    assertNotEqual(reflection.callCount, undefined);
    assertNotEqual(reflection.notCalled, undefined);
    assertNotEqual(reflection.calledWith, undefined);
    assertNotEqual(reflection.calledOnce, undefined);
    assertNotEqual(reflection.calledTwice, undefined);
    assertNotEqual(reflection.calledThrice, undefined);
  }

  @Context({
    when: "reviving"
  })
  public reviveTest() {
    return ReviveTest;
  }
}
