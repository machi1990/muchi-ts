import { join } from "path";
import { readFile } from "fs";
import { promisify } from "util";
import { assertNotEqual, assertEqual } from "..";
import executeOrTimeout from "../src/api/utils/executeOrTimeout";
const readFilePromise = promisify(readFile);
const cheap = Symbol("cheap");
const expensive = Symbol("expensive");

class Operations {
  public expensive() {
    return readFilePromise(join(__dirname, "../index.js"), "utf-8");
  }

  public cheap() {
    return Promise.resolve("I am fast");
  }
}

@MuchiTs({
  name: ".class ExecuteOrTimeout()"
})
class ExecuteOrTimeOutTest {
  @Test({
    it: "times out with an error message"
  })
  public async expensiveShouldTimeOut() {
    // Given
    const expensiveOperation = new Operations();
    // When
    const data = await executeOrTimeout(
      expensiveOperation,
      { method: "expensive", name: "reading file" },
      1
    );
    // Then
    assertNotEqual(data, null);
  }

  @Test({
    it: "does not time out"
  })
  public async cheapShouldNotTimeOut() {
    // Given
    const expensiveOperation = new Operations();
    // When
    const data = await executeOrTimeout(
      expensiveOperation,
      { method: "cheap", name: "reading file" },
      1
    );
    // Then
    assertEqual(data, "I am fast");
  }
}
