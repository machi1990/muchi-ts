import * as colors from "colors";

export const SPACE: string = " ";
export const FAILED: string = colors.red("\u2718");
export const SKIPPED: string = colors.cyan("\u2610");
export const PASSED: string = colors.green("\u2713");
export const EXPECTS: string = colors.bold(colors.green("expects: "));
