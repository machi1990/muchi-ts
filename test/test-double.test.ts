import { stub } from "js-dada";
import { assertNotEqual, assertEqual, verify, restore } from "..";

interface Stub {
  fn: () => any;
}

class RestoreTest {
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
    restore(this.stub.fn);
    // Then
    assertEqual(this.stub.fn["reset"], undefined);
    assertEqual(this.stub.fn(), 1);
  }
}

@MuchiTs({
  name: ".verify(mock)"
})
@Only()
class VerifyMockTest {
  private objToStub: Stub = {
    fn: () => {}
  };

  @Before
  public createTestDoubleFn() {
    stub(this.objToStub, "fn");
  }

  @Test({
    it: "returns test double methods"
  })
  public testMockObjMethodsReflection() {
    // When
    const verification = verify(this.objToStub.fn);

    // Then
    assertNotEqual(verification.args, undefined);
    assertNotEqual(verification.when, undefined);
    assertNotEqual(verification.reset, undefined);
    assertNotEqual(verification.throws, undefined);
    assertNotEqual(verification.returns, undefined);
    assertNotEqual(verification.inspect, undefined);
    assertNotEqual(verification.callCount, undefined);
    assertNotEqual(verification.notCalled, undefined);
    assertNotEqual(verification.calledWith, undefined);
    assertNotEqual(verification.calledOnce, undefined);
    assertNotEqual(verification.calledTwice, undefined);
    assertNotEqual(verification.calledThrice, undefined);
  }

  @Context({
    when: "restoring"
  })
  public restoreTest() {
    return RestoreTest;
  }
}
