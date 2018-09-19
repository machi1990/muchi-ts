#!/usr/bin/env node
const colors = require("colors");
const path = require("path");
const { spawn } = require("child_process");
/**
 * Read test files from supplied arguments.
 */
const testFiles = ["test/js-test.test.ts"];

/**
 * Make tsconfig an env varibale.
 */
const tsconfig = "tsconfig.json";
const compileOpts = ["--build", tsconfig];

/**
 * Read output folder from tsconfig.
 */
const tsConfigOutDir = "build";

const runTestFile = file => {
  const outputFile = path.join(
    tsConfigOutDir,
    file.substring(0, file.length - 3) + ".js"
  );
  const startTime = Date.now();

  const testRunning = spawn("node", [outputFile]);
  /**
   * testRunning.stdout.on('data', () => {}) to display output par test.
   */
  let output = "";

  testRunning.stdout.on("data", chunk => {
    const out = chunk.toString();
    if (!out) return;
    output += out;
  });

  testRunning.stderr.on("data", chunk => {
    const out = chunk.toString();
    if (!out) return;
    output += colors.red(out);
  });

  testRunning.on("close", code => {
    const duration = Date.now() - startTime;

    const finished = code ? colors.red("Finished-") : colors.white("Finished-");
    console.log(output);
    console.log(outputFile, finished, `- ${duration} ms`);
  });
};

const fileCompilation = spawn("tsc", compileOpts);
fileCompilation.stdout.pipe(process.stdout);
fileCompilation.stderr.pipe(process.stderr);
fileCompilation.on("close", exitCode => {
  if (exitCode) process.exit(exitCode);
  testFiles.forEach(runTestFile);
});
