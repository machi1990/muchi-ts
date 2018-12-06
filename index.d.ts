import ReflectMock from "./src/types/reflect-mock-api";

export const assertTruthy: (value: any) => void;
export const assertEqual: (actual, expected) => void;
export const assertNotEqual: (actual, expected) => void;
export const assertStrictEqual: (actual, expected) => void;
export const assertDeepEqual: (actual, expected) => void;
export const assertNotStrictEqual: (actual, expected) => void;
export const assertNotDeepEqual: (actual, expected) => void;

/**
 * Test doubles
 */
export const revive: (obj: Function) => void;
export const reflect: (obj: Function) => ReflectMock;
