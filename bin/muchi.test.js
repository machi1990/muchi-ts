#!/usr/bin/env node

const watch = false;
const testsFiles = process.argv.slice(2);
const runTests = require("../src/cli/run-tests")("..");

runTests(testsFiles, watch);
