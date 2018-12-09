interface CallInspection {
  args: () => Array<any>;
  calledWith: (...args) => boolean;
}

interface WhenConstruct {
  throws: (...args) => any;
  returns: (...args) => any;
}

export default interface Mocks extends CallInspection {
  reset: () => void;
  callCount: () => number;
  notCalled: () => boolean;
  calledOnce: () => boolean;
  throws: (...args) => any;
  returns: (...args) => any;
  calledTwice: () => boolean;
  calledThrice: () => boolean;
  when: (...args) => WhenConstruct;
  inspect: (count: number) => CallInspection;
}
