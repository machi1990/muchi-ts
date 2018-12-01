import { BeforeSetup, Setup, AfterSetup } from "../../interfaces/setup";
import RunnerOpts from "../../interfaces/runner-opts";

export interface SetupContext<T extends Setup> {
  setup: T;
  contextInstance: any;
  contextClazz: any;
}

export interface BeforeSetupContext extends SetupContext<BeforeSetup> {}

export interface AfterSetupContext extends SetupContext<AfterSetup> {}

class SetupRunner<T extends SetupContext<Setup>> {
  private setupContexts: Array<T>;
  constructor() {
    this.setupContexts = new Array<T>();
  }

  public add(detupContext: T): void {
    this.setupContexts.push(detupContext);
  }

  public addAll(setupContexts: Array<T>): void {
    this.setupContexts = [...this.setupContexts, ...setupContexts];
  }

  public copyRunnerContext(beforeRunner: SetupRunner<T>): void {
    this.addAll(beforeRunner.setupContexts);
  }

  public async run(runnerOptions: RunnerOpts) {
    const runs: Array<any> = this.setupContexts.map(
      ({ setup, contextInstance, contextClazz }) => {
        return setup.run({
          ...runnerOptions,
          contextInstance,
          contextClazz
        });
      }
    );

    return Promise.all(runs);
  }
}

export class BeforeSetupRunner extends SetupRunner<BeforeSetupContext> {}
export class AfterSetupRunner extends SetupRunner<AfterSetupContext> {}
