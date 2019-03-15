import { assertDeepEqual } from "..";
import * as argParser from "../src/cli/arg-parser";

@MuchiTs({
  name: ".class ArgParser()"
})
class ArgParserTest {
  @Test({
    it: "parses cli args",
    ignore: true
  })
  public argvContainsTestsFiles() {
    // Given
    const argv = [
      "bin",
      "script",
      "hello",
      "-s",
      "2000",
      "-t",
      "test/tests test/*.test",
      "-w",
      "true"
    ];
    const expectedArgs = {
      tests: ["test/tests", "test/*test"],
      timeOut: 2000,
      watch: true
    };
    // When
    const actual = argParser("test", "")(argv);
    // Then
    assertDeepEqual(expectedArgs, actual);
  }
}
