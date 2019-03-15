import { assertTruthy, assertEqual } from "..";
import * as transpile from "../src/cli/transpile";

@MuchiTs({
  name: ".class TranspileTest()"
})
class TranspileTest {
  @Test({
    it: "transpiles ts file"
  })
  public transpilesTsFile() {
    // Given
    const filename = module.filename;
    // When
    const transpilationResult = transpile([filename], "..", 2000);
    //Then
    assertTruthy(transpilationResult[filename]);
  }

  @Test({
    it: "does not transpiles js file"
  })
  public transpilesTsFile() {
    // Given
    const filename = "index.js";
    // When
    const transpilationResult = transpile([filename], "..", 2000);
    //Then
    assertEqual(transpilationResult[filename], undefined);
  }
}
