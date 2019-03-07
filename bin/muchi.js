#!/usr/bin/env node

const { name, version } = require("../package.json");
const runTests = require("../src/cli/run-tests")(name);
const cli = require("../src/cli/arg-parser")(name, version);

/**
 * Parse cli opts
 */
const { tests, watch, timeOut } = cli(process.argv);

/**
 * compile and run tests
 */
runTests(tests, watch, timeOut);
