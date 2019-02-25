#!/usr/bin/env node

const outDir = "build";
const watch = false;
const testsFiles = process.argv.slice(2);
const runTests = require("../src/cli/run-tests")("..");

runTests(testsFiles, outDir, watch);
