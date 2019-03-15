import { readFile } from "fs";
import { join } from "path";
import { promisify } from "util";
import { assertNotEqual } from "..";

const readFilePromise = promisify(readFile);

@MuchiTs({
  name: "class TimeOut()"
})
class TimeOutTest {
  @Before
  public async setupShouldTimeOut() {
    // Given
    const expensiveOperation = readFilePromise(
      join(__dirname, "../index.js"),
      "utf-8"
    );

    // When
    await expensiveOperation;
  }

  @After
  public async tearDownShouldTimeOut() {
    // Given
    const expensiveOperation = readFilePromise(
      join(__dirname, "../index.js"),
      "utf-8"
    );

    // When
    await expensiveOperation;
  }
}
