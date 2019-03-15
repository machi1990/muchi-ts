import { assertDeepEqual } from "..";
import * as flatten from "../src/cli/flatten";

class FlatArrayContext {
  @Test({
    it: "returns the array"
  })
  public returnsTheArray() {
    // Given
    const array = [1, 2, 3];
    const expected = [1, 2, 3];
    // When
    const actual = flatten(array);
    //Then
    assertDeepEqual(expected, actual);
  }
}

class UnflatArrayInfinityContext {
  @Test({
    it: "returns a flattened array"
  })
  public returnsTheArray() {
    // Given
    const array = [[1, 2], [3, [4, [5, [6]]]]];
    const expected = [1, 2, 3, 4, 5, 6];
    // When
    const actual = flatten(array);
    //Then
    assertDeepEqual(expected, actual);
  }
}

@MuchiTs({
  name: ".class FlattenArray()"
})
class FlattenArrayTest {
  @Context({
    when: "array is already flattened"
  })
  public flatArrayContext() {
    return FlatArrayContext;
  }

  @Context({
    when: "array not flattened"
  })
  public flatArrayLevelOneContext() {
    return UnflatArrayInfinityContext;
  }
}
