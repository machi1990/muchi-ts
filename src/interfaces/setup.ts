export interface Setup {
  run: (runnerOpts) => void;
  canRunWithin: (TestClass) => boolean;
}

export interface BeforeSetup extends Setup {}

export interface AfterSetup extends Setup {}

export interface MethodSetup extends Setup {
  message: string;
  ignore: boolean;
  key: string;
}

export interface ContextSetup extends MethodSetup {
  englobingClass: any;
}

export interface TestSetup extends MethodSetup {}
