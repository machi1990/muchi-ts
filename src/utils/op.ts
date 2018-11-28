export const TRUTHY = "truthy";
export const EQL_OP = "==";
export const STRICT_EQL_OP = "===";
export const DEEP_EQL_OP = "deepEqual";
export const NOT_EQL_OP = "!==";
export const NOT_STRICT_EQL_OP = "!===";
export const NOT_DEEP_EQL_OP = "notDeepEqual";

/**
 * Assertion operators
 */
export const Op = {
  [TRUTHY]: "to be",
  [EQL_OP]: "to equal to",
  [NOT_EQL_OP]: "to not equal to",
  [STRICT_EQL_OP]: "to strict equal to",
  [NOT_STRICT_EQL_OP]: "to not strict equal to",
  [DEEP_EQL_OP]: "to deep equal to",
  [NOT_DEEP_EQL_OP]: "to not deep equal to"
};
