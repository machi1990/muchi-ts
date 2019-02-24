#!/usr/bin/env node

const { name, version } = require("../package.json");
const runTest = require("../src/run-test")(name);
const cli = require("../src/cli/arg-parser")(name, version);

/**
 * Parse cli opts
 */
const { tests, outDir, watch } = cli(process.argv);

/**
 * compile and run tests
 */
runTest(tests, outDir, watch);
