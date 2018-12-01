export * from "./src/assertion";
import tsMuchi from "./src/decorators/ts-muchi";

export const { TsMuchi, Test, After, Context, Before } = tsMuchi();
