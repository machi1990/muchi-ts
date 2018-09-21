export * from "./src/assertion";
import { testing } from "./src/decorators";
export const { run, test, after, before } = testing();
