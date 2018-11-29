export interface Setup {
  run: (contex) => void;
  canRunWithin: (TestClass) => boolean;
}

export interface BeforeSetup extends Setup {}

export interface AfterSetup extends Setup {}

export interface ContextSetup {
  name: string;
  ignore: boolean;
}

export interface TestSetup extends Setup {
  message: string;
  ignore: boolean;
  order: number;
  key: string;
  contextSetup?: ContextSetup;
}
