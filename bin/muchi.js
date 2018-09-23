#!/usr/bin/env node
const path = require("path");
const assert = require("assert");
const colors = require("colors");
const compile = require("../compile");
const { spawn } = require("child_process");
const { statSync, readdirSync } = require("fs");

const tsConfigOutDir = "build";

const runTestFiles = files => {
  files
    .map(file => ({
      file,
      transpiled: path.join(
        tsConfigOutDir,
        file.substring(0, file.length - 3) + ".js"
      )
    }))
    .forEach(runTestFile);
};

const runTestFile = ({ file, transpiled }) => {
  const startTime = Date.now();
  const testRunning = spawn("node", [transpiled]);

  let testOutput = "";

  testRunning.stdout.on("data", chunk => {
    const out = chunk.toString();
    if (!out) return;
    testOutput += out;
  });

  testRunning.stderr.on("data", chunk => {
    const out = chunk.toString();
    if (!out) return;
    testOutput += colors.red(out);
  });

  testRunning.on("close", code => {
    const duration = Date.now() - startTime;

    const finished = code ? colors.red("Finished-") : colors.white("Finished-");
    console.log(testOutput);
    console.log(file, finished, `- ${duration} ms`);
  });
};

const flatten = array => {
  let res = [];
  array.forEach(element => {
    if (Array.isArray(element)) {
      res = res.concat(flatten(element));
    } else {
      res.push(element);
    }
  });
  return res;
};

/**
 * Fetch test files.
 * TODO.
 * - regex???
 */
const filesName = process.argv.slice(2).reduce((allFiles, file) => {
  const fn = file => {
    const stat = statSync(file);
    const isTsFile =
      stat.isFile() &&
      (path.extname(file) === ".ts" || path.extname(file) === ".js");
    if (isTsFile) {
      return [file];
    } else if (stat.isDirectory()) {
      const lsDir = readdirSync(file).map(child => fn(path.join(file, child)));
      return flatten(lsDir);
    }
    return [];
  };

  return [...allFiles, ...fn(file)];
}, []);

/**
 * compile
 */
compile(filesName, tsConfigOutDir);

/**
 * run test files.
 */
runTestFiles(filesName);
