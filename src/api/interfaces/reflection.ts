import { assertDeepEqual } from "../assertion";

export interface Reflection {
  constructor: string;
  prepertyKeys: Array<PropertyKey>;
}

export const isSame = (
  firstArg: Reflection,
  secondArg: Reflection
): boolean => {
  try {
    assertDeepEqual(firstArg, secondArg);
    return true;
  } catch (error) {
    return false;
  }
};
