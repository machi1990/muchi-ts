import * as colors from "colors";
import { TYPE, Logger } from "../../utils/ts/logger";
import RunnerOpts from "../../interfaces/runner-opts";
import { SPACE, SKIPPED } from "../../utils/ts/hard-corded-value";
import BeforeRegistry from "../../registries/before-registry";
import AfterRegistry from "../../registries/after-registry";
import MethodRegistry from "../../registries/method-registry";
import { MethodSetup } from "../../interfaces/setup";
import { BeforeSetupContext, AfterSetupContext } from "./setup-runner";
import MockRegistry from "../../registries/mock-registry";

export default class {
  private afterRegistry: AfterRegistry = new AfterRegistry();
  private methodRegistry: MethodRegistry = new MethodRegistry();
  private beforeRegistry: BeforeRegistry = new BeforeRegistry();
  private mockRegistry: MockRegistry = new MockRegistry();

  constructor(
    _beforeRegistry: BeforeRegistry,
    _methodRegistry: MethodRegistry,
    _afterRegistry: AfterRegistry,
    _mockRegistry: MockRegistry
  ) {
    /**
     * copy test entries to new register to keep to avoid sharing a global registry
     */
    _beforeRegistry.feed(this.beforeRegistry);
    _afterRegistry.feed(this.afterRegistry);
    _methodRegistry.feed(this.methodRegistry);
    _mockRegistry.feed(this.mockRegistry);
  }

  async run(runnerOpts: RunnerOpts): Promise<void> {
    const message: string = colors.bold(runnerOpts.message);
    const logger: Logger = runnerOpts.logger;
    const level: number = runnerOpts.level * 2;

    /**
     * Mock that's need to be mocked
     */
    this.mockRegistry
      .filter(setup => setup.canRunWithin(runnerOpts.contextClazz))
      .map(setup => setup.run(runnerOpts));

    /**
     * Retrieve before and after annotation.
     */
    const beforeSetupContexts: Array<
      BeforeSetupContext
    > = this.beforeRegistry
      .filter(setup => setup.canRunWithin(runnerOpts.contextClazz))
      .map(setup => {
        return {
          setup,
          contextInstance: runnerOpts.contextInstance,
          contextClazz: runnerOpts.contextClazz
        };
      });

    const afterSetupContexts: Array<
      AfterSetupContext
    > = this.afterRegistry
      .filter(setup => setup.canRunWithin(runnerOpts.contextClazz))
      .map(setup => {
        return {
          setup,
          contextInstance: runnerOpts.contextInstance,
          contextClazz: runnerOpts.contextClazz
        };
      });

    runnerOpts.beforeRunner.addAll(beforeSetupContexts);
    runnerOpts.afterRunner.addAll(afterSetupContexts);

    if (runnerOpts.ignore) {
      /**
       * Skips test class if ignore metadata sets to true
       */
      const skipMsg = level === 0 ? message : `${SKIPPED} ${message}`;
      logger.addLog(TYPE.log, SPACE.repeat(level), colors.cyan(skipMsg));
    } else {
      logger.addLog(TYPE.log, SPACE.repeat(level), message);
    }

    /**
     * Runs all tests
     */
    await this.runAllRecursive(runnerOpts);
  }

  async runAllRecursive(runnerOpts: RunnerOpts) {
    const { value } = this.methodRegistry.next();
    if (!value) return;

    if (value.canRunWithin(runnerOpts.contextClazz)) {
      await this.runTest(runnerOpts, value);
    }

    return this.runAllRecursive(runnerOpts);
  }

  async runTest(
    runnerOpts: RunnerOpts,
    methodSetup: MethodSetup
  ): Promise<void> {
    /**
     * Execute before setup if any
     */
    await runnerOpts.beforeRunner.run(runnerOpts);

    /**
     * Execute test setup using current runner options
     */
    await methodSetup.run(runnerOpts);

    /**
     * Execute after setup if any
     */
    await runnerOpts.afterRunner.run(runnerOpts);
  }
}
