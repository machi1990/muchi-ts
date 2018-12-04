#!/usr/bin/env node

const colors = require("colors");
const muchiTsProgram = require("commander");
const { name, version } = require("../package.json");
const runTest = require("../src/utils/js/run-test")(name);

const collect = (val, memo) => {
  memo.push(val);
  return memo;
};

muchiTsProgram
  .version(`${name} ${version}`, "-v, --version")
  .option(
    "-o, --outDir [outDir]",
    "A string specifying build output directory.",
    /^[^\/].*/i,
    "build"
  )
  .option("-w, --watch", "Rerun tests on file changes.")
  .option(
    "-t, --tests  <tests>",
    "A path to test files or a regex describing this path.",
    collect,
    []
  )
  .parse(process.argv);

const outDir = muchiTsProgram.outDir;
const testsFiles = muchiTsProgram.tests;
const watch = muchiTsProgram.watch || false;

if (!testsFiles.length) {
  console.error(
    colors.red(
      'You must supply a path to test files. Use the "-t" option to do so.'
    )
  );
  process.exit(0);
}

runTest(testsFiles, outDir, watch);
