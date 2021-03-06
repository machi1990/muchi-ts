export interface Setup {
  run: (runnerOpts) => any;
  canRunWithin: (TestClass) => boolean;
}

export interface BeforeSetup extends Setup {}

export interface AfterSetup extends Setup {}

export interface MethodSetup extends Setup {
  message: string;
  ignore: boolean;
  key: string | number;
  only: boolean;
}

export interface ContextSetup extends MethodSetup {}

export interface TestSetup extends MethodSetup {}

export interface MockSetup extends Setup {
  key: string | number;
}
