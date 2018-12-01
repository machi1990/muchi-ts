#!/usr/bin/env node

const tsConfigOutDir = "build/";

const ls = require("../src/utils/js/ls");
const compile = require("../src/utils/js/compile");
const runCompiledTestFiles = require("../src/utils/js/run-compiled-test-files")(
  tsConfigOutDir
);

const testsFilesArg = process.argv.slice(2);

const fileRegexes = testsFilesArg.map(fileArg => new RegExp(fileArg));
const tsOrJsExtension = /(\.[tj]s)$/;
const isTestFile = file =>
  tsOrJsExtension.test(file) && fileRegexes.some(regex => regex.test(file));

const workingDir = ".";
const filesName = ls(workingDir, {
  exclude: ["node_modules", ".git", tsConfigOutDir],
  predicate: isTestFile
});

/**
 * compile
 */
compile(filesName, tsConfigOutDir);

/**
 * run test files.
 */
runCompiledTestFiles(filesName);
