#!/usr/bin/env node

const { name, version } = require("../package.json");
const runTests = require("../src/cli/run-tests")(name);
const cli = require("../src/cli/arg-parser")(name, version);

/**
 * Parse cli opts
 */
const { tests, outDir, watch } = cli(process.argv);

/**
 * compile and run tests
 */
runTests(tests, outDir, watch);
