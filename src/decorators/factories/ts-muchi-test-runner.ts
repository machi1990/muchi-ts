import * as colors from "colors";
import { TYPE, Logger } from "../../utils/ts/logger";
import RunnerOpts from "../../interfaces/runner-opts";
import { SPACE } from "../../utils/ts/hard-corded-value";
import BeforeRegistry from "../../registries/before-registry";
import AfterRegistry from "../../registries/after-registry";
import MethodRegistry from "../../registries/method-registry";
import { MethodSetup } from "../../interfaces/setup";
import { BeforeSetupContext, AfterSetupContext } from "./setup-runner";

export default class {
  private afterRegistry: AfterRegistry = new AfterRegistry();
  private methodRegistry: MethodRegistry = new MethodRegistry();
  private beforeRegistry: BeforeRegistry = new BeforeRegistry();

  constructor(
    _beforeRegistry: BeforeRegistry,
    _methodRegistry: MethodRegistry,
    _afterRegistry: AfterRegistry
  ) {
    /**
     * copy test entries to new register to keep to avoid sharing a global registry
     */
    _beforeRegistry.feed(this.beforeRegistry);
    _afterRegistry.feed(this.afterRegistry);
    _methodRegistry.feed(this.methodRegistry);
  }

  async run(runnerOpts: RunnerOpts): Promise<void> {
    const message: string = runnerOpts.message;
    const logger: Logger = runnerOpts.logger;

    /**
     * Retrieve before and after annotation.
     */
    const beforeSetupContexts: Array<
      BeforeSetupContext
    > = this.beforeRegistry
      .keepOnly(setup => setup.canRunWithin(runnerOpts.contextClazz))
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
      .keepOnly(setup => setup.canRunWithin(runnerOpts.contextClazz))
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
      logger.addLog(
        TYPE.log,
        SPACE.repeat(runnerOpts.level),
        colors.cyan(message)
      );
    } else {
      logger.addLog(TYPE.log, SPACE.repeat(runnerOpts.level), message);
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
