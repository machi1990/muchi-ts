import * as colors from "colors";

export const SPACE: string = " ";
export const SKIPPED: string = colors.cyan("Skipped- ");
export const PASSED: string = colors.green("Passed- ");
export const FAILED: string = colors.red("Failed- ");
export const ACTUAL: string = colors.bgGreen("actual - ");
export const EXPECTED: string = colors.bgRed("expected - ");
