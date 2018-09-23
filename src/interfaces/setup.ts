interface Setup {
  run: (contex) => void;
  canRunWithin: (TestClass) => boolean;
}

export interface BeforeSetup extends Setup {}

export interface AfterSetup extends Setup {}

export interface TestSetup extends Setup {
  message: string;
  ignore: boolean;
}
