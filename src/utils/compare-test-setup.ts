import { TestSetup } from "../interfaces/setup";

const compare = (previous: TestSetup, next: TestSetup) => {
  return previous.order - next.order;
};

export default compare;
