#!/usr/bin/env node

const runTest = require("../src/utils/js/run-test")("..");
const outDir = "build";
const testsFiles = process.argv.slice(2);
const watch = false;

runTest(testsFiles, outDir, watch);
