const fs = require("fs");
const ls = require("./ls");
const tranpile = require("./transpile");
const runTranspiledTestFiles = require("./run-transpiled-test-files");

let currentJobs = [];
let testsToRun = {};
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
  testsToRun = Object.keys(transpilationResults).reduce((obj, key) => {
    if (!tests.includes(key)) return obj;
    return {
      ...obj,
      [key]: transpilationResults[key]
    };
  }, {});

  runTests();

  if (!watch) {
    waitForJobsToFinishBeforeExitingWithAppropriateCode();
  } else {
    watchFilesChangeAndRerunTests(allFiles, outDir, requirePath);
  }
};

const runTests = () => {
  stopsJobs(currentJobs);
  currentJobs = runTranspiledTestFiles(testsToRun);
};

const stopsJobs = jobs => {
  if (!jobs) return;

  jobs.forEach(({ job }) => {
    job.stdin.pause();
    job.kill();
  });
};

const watchFilesChangeAndRerunTests = (allFiles, outDir) => {
  allFiles.forEach(file => {
    fs.watchFile(file, { persistent: true, interval: 500 }, (curr, prev) => {
      if (+curr.mtime <= +prev.mtime) {
        return;
      }
      const transpilationResult = tranpile([file], outDir, requirePath);
      testsToRun[file] = transpilationResult[file];
      runTests();
    });
  });
};

const waitForJobsToFinishBeforeExitingWithAppropriateCode = () => {
  const intervalId = setInterval(() => {
    const done = currentJobs.every(({ done }) => done);
    if (!done) return;
    const code = currentJobs.reduce((acc, { exitCode }) => acc || exitCode, 0);
    clearInterval(intervalId);
    process.exit(code);
  }, 500);
};
