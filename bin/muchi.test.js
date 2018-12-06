#!/usr/bin/env node

const runTest = require("./utils/run-test")("..");
const outDir = "build";
const testsFiles = process.argv.slice(2);
const watch = false;

runTest(testsFiles, outDir, watch);
