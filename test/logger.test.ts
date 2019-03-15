import { assertEqual } from "..";
const consoleApis = ["log", "warn", "error", "info"];
import { Logger, TYPE } from "../src/api/utils/logger";

@MuchiTs({
  name: ".class Logger()"
})
class LoggerTest {
  private oldConsoleApis = [];
  private callCount = 0;
  @Before
  public setup() {
    this.callCount = 0;
    consoleApis.forEach(api => {
      const oldApi = console[api].bind(console);
      console[api] = _ => {
        this.callCount++;
      };
      this.oldConsoleApis.push(oldApi);
    });
  }

  @After
  public teardown() {
    consoleApis.forEach((api, index) => {
      console[api] = this.oldConsoleApis[index].bind(console);
    });
  }

  @Test({
    it: "calls console api"
  })
  public callsConsoleApis() {
    // Given
    const logger: Logger = new Logger();
    logger.addLog(TYPE.log, "log");
    logger.addLog(TYPE.info, "info");
    logger.addLog(TYPE.warn, "warning");
    logger.addLog(TYPE.error, "error");
    const expectedCallCount = 4;
    // When
    logger.log();
    // Then
    assertEqual(expectedCallCount, this.callCount);
  }

  @Test({
    it: "appends another logger"
  })
  public appendsAnotherLogger() {
    // Given
    const logger1: Logger = new Logger();
    logger1.addLog(TYPE.log, "log");
    logger1.addLog(TYPE.info, "info");
    const logger2: Logger = new Logger();
    logger2.addLog(TYPE.warn, "warning");
    logger2.addLog(TYPE.error, "error");
    logger1.append(logger2);
    const expectedCallCount = 4;
    // When
    logger1.log();
    // Then
    assertEqual(expectedCallCount, this.callCount);
  }

  @Test({
    it: "does not append null logger"
  })
  public doesNotAppendsAnotherLogger() {
    // Given
    const logger1: Logger = new Logger();
    logger1.addLog(TYPE.log, "log");
    logger1.addLog(TYPE.info, "info");
    const logger2: Logger = null;
    logger1.append(logger2);
    const expectedCallCount = 2;
    // When
    logger1.log();
    // Then
    assertEqual(expectedCallCount, this.callCount);
  }
}
