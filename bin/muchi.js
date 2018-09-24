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

const testsFilesArg = process.argv.slice(2);
const fileRegexes = testsFilesArg.map(fileArg => new RegExp(fileArg));
const tsOrJsExtension = /(\.[tj]s)$/;
const isTestFile = file =>
  tsOrJsExtension.test(file) && fileRegexes.some(regex => regex.test(file));

const ls = file => {
  const stat = statSync(file);
  const isTestCodeFile = stat.isFile() && isTestFile(file);
  const isCodeDir =
    stat.isDirectory() && !["node_modules", ".git"].includes(file);

  if (isCodeDir) {
    const lsDir = readdirSync(file).map(child => ls(path.join(file, child)));
    return flatten(lsDir);
  } else if (isTestCodeFile) {
    return [file];
  }
  return [];
};

const workingDir = ".";
const filesName = ls(workingDir);

/**
 * compile
 */
compile(filesName, tsConfigOutDir);

/**
 * run test files.
 */
runTestFiles(filesName);
