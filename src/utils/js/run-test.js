const fs = require("fs");
const ls = require("./ls");
const compile = require("./compile");
const runCompiledTestFiles = require("./run-compiled-test-files");

const stopsJobs = jobs => {
  if (!jobs) return;

  jobs.forEach(job => {
    job.stdin.pause();
    job.kill();
  });
};

let currentJobs = [];
const runTest = (tests, outDir) => {
  stopsJobs(currentJobs);
  currentJobs = runCompiledTestFiles(outDir)(tests);
};

const watchFilesChangeAndRerunTests = (allFiles, tests, outDir) => {
  allFiles.forEach(file => {
    fs.watchFile(file, { persistent: true, interval: 500 }, (curr, prev) => {
      if (+curr.mtime <= +prev.mtime) {
        return;
      }

      compile([file], outDir);
      runTest(tests, outDir);
    });
  });
};

module.exports = (testsArg, outDir, watch) => {
  const regexes = testsArg.map(fileArg => new RegExp(fileArg));
  const tsOrJsExtension = /(\.[tj]s)$/;
  const isTestFile = file =>
    tsOrJsExtension.test(file) && regexes.some(regex => regex.test(file));

  const workingDir = ".";
  const allFiles = ls(workingDir, {
    exclude: ["node_modules", ".git", outDir]
  });
  const tests = allFiles.filter(isTestFile);
  /**
   * compile
   */
  compile(tests, outDir);
  runTest(tests, outDir);
  if (!watch) return;
  watchFilesChangeAndRerunTests(allFiles, tests, outDir);
};
