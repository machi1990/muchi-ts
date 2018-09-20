import { testing } from "./src/js-test";
export const { run, test, after, before } = testing();
export { assertEqual, assertStrictEqual, assertDeepEqual } from "./src/js-test";
