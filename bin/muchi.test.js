#!/usr/bin/env node

const watch = true;
const testsFiles = process.argv.slice(2);
const runTests = require("../src/cli/run-tests")("..");

runTests(testsFiles, watch);
