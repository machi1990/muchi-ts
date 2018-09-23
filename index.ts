export * from "./src/assertion";
import muchi from "./src/decorators/js-muchi";
export const { JsMuchi, test, after, before } = muchi();
