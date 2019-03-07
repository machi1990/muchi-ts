#!/usr/bin/env node

const watch = false;
const timeOut = 1;
const testsFiles = process.argv.slice(2);
const runTests = require("../src/cli/run-tests")("..");

runTests(testsFiles, watch, timeOut);
