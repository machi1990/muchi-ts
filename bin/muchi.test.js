#!/usr/bin/env node

const outDir = "build";
const watch = false;
const testsFiles = process.argv.slice(2);
const runTest = require("../src/cli/run-test")("..");

runTest(testsFiles, outDir, watch);
