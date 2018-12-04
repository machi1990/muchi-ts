const fs = require("fs");
const ls = require("./ls");
const tranpile = require("./transpile");
const runTranspiledTestFiles = require("./run-transpiled-test-files");

const stopsJobs = jobs => {
  if (!jobs) return;

  jobs.forEach(job => {
    job.stdin.pause();
    job.kill();
  });
};

let currentJobs = [];
let testToRun = {};

const runTest = () => {
  stopsJobs(currentJobs);
  currentJobs = runTranspiledTestFiles(testToRun);
};

const watchFilesChangeAndRerunTests = (allFiles, outDir) => {
  allFiles.forEach(file => {
    fs.watchFile(file, { persistent: true, interval: 500 }, (curr, prev) => {
      if (+curr.mtime <= +prev.mtime) {
        return;
      }

      const transpilationResult = tranpile([file], outDir, requirePath);
      testToRun[file] = transpilationResult[file];
      runTest();
    });
  });
};

let requirePath = "";

module.exports = _requirePath => (testsArg, outDir, watch) => {
  requirePath = _requirePath;
  const workingDir = ".";
  const allFiles = ls(workingDir, {
    exclude: ["node_modules", ".git", outDir]
  });

  /**
   * Find tests files
   */
  const regexes = testsArg.map(fileArg => new RegExp(fileArg));
  const isTestFile = file => regexes.some(regex => regex.test(file));
  const tests = allFiles.filter(isTestFile);

  /**
   * compile
   */
  const transpilationResults = tranpile(allFiles, outDir, requirePath);
  testToRun = Object.keys(transpilationResults).reduce((obj, key) => {
    if (!tests.includes(key)) return obj;
    return {
      ...obj,
      [key]: transpilationResults[key]
    };
  }, {});

  runTest();
  if (!watch) return;
  watchFilesChangeAndRerunTests(allFiles, outDir, requirePath);
};
