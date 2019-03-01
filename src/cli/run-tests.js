const fs = require("fs");
const ls = require("./ls");
const path = require("path");
const Module = require("module");
const colors = require("colors");
const cluster = require("cluster");
const tranpile = require("./transpile");

const cwd = process.cwd();
const passed = colors.green("\u2713");
const failure = `${colors.red("\u2718")}`;
const _load = Module._load.bind(Module);
const _findPath = Module._findPath.bind(Module);

let worker;
let requirePath = "";
let passingTestCount = 0;
let failingTestCount = 0;
let transpilationResults = {};
const log = console.log.bind(console);
const error = console.error.bind(console);

console.log = (...args) => {
  passingTestCount += args.join("").includes(passed) ? 1 : 0;
  log.apply(null, args);
};

console.error = (...args) => {
  if (args.join("").includes(failure)) {
    process.exitCode = 1;
    failingTestCount++;
  }
  error.apply(null, args);
};

module.exports = _requirePath => (testsArg, watch) => {
  requirePath = _requirePath;
  const files = ls(".", {
    exclude: ["node_modules", ".git"]
  });
  /**
   * compile
   */
  transpilationResults = tranpile(files, requirePath);

  if (cluster.isMaster) {
    if (!watch) {
      printSummaryBeforeProcessExit();
      /**
       * Run test files once.
       */
      runTranspiledTestFiles(testsArg)(transpilationResults);
    } else {
      worker = cluster.fork();
      /**
       * Watch file changes
       */
      watchFilesChanges(files);
    }
  } else {
    /**
     * Run watched files in child process
     */
    runTranspiledTestFiles(testsArg)(transpilationResults);
  }
};

const watchFilesChanges = files => {
  files.forEach(file => {
    fs.watchFile(file, { persistent: true, interval: 1500 }, (curr, prev) => {
      if (+curr.mtime <= +prev.mtime) {
        return;
      }
      passingTestCount = 0;
      failingTestCount = 0;
      transpilationResults = {
        ...transpilationResults,
        ...tranpile([file], requirePath)
      };
      worker.kill();
      worker = cluster.fork();
    });
  });
};

/**
 * Runs test files
 */
const runTranspiledTestFiles = testsArg => {
  const regexes = testsArg.map(fileArg => new RegExp(fileArg));
  const isTestFile = file => regexes.some(regex => regex.test(file));

  return transpiledFiles => {
    Module._findPath = (request, paths, isMain) => {
      const filename = _findPath(request, paths, isMain);
      if (!filename) return path.join(paths[0], request);
      return filename;
    };

    Module._load = (request, parent, isMain) => {
      const filename = Module._resolveFilename(request, parent, isMain);

      try {
        const loadedModule = _load(request, parent, isMain);
        return loadedModule;
      } catch (error) {
        const transpilationKey = filename.replace(`${cwd}${path.sep}`, "");
        const transpiledModuleSource =
          transpiledFiles[`${transpilationKey}.ts`] ||
          transpiledFiles[`${transpilationKey}.js`];
        if (!transpiledModuleSource) {
          throw error;
        }
        const moduleId = path.join(cwd, transpiledModuleSource.fileName);
        const loadedModule = new Module(moduleId, parent);
        Module._cache[filename] = loadedModule;
        loadedModule.paths = Module._nodeModulePaths(cwd);
        loadedModule.filename = moduleId;
        loadedModule._compile(transpiledModuleSource.output, moduleId);
        return loadedModule.exports;
      }
    };

    const hasOnly = Object.values(transpiledFiles).some(({ only }) => only);
    const canRun = file => {
      const transpiledFile = transpiledFiles[file];
      return (
        isTestFile(file) &&
        transpiledFile.runnable &&
        (!hasOnly || transpiledFile.only)
      );
    };

    const files = Object.keys(transpiledFiles);

    for (let index = 0; index < files.length; index++) {
      const fileName = files[index];
      if (!canRun(fileName)) continue;

      const source = transpiledFiles[fileName].output;
      const filename = path.join(cwd, fileName);
      const main = new Module(filename);
      main.filename = filename;
      main.paths = Module._nodeModulePaths(cwd);
      main._compile(source, filename);
    }
  };
};

const printSummaryBeforeProcessExit = _ => {
  process.on("beforeExit", () => {
    const summary = colors.bold("summary:");
    const failed = colors.red(colors.bold("failed"));
    const passed = colors.green(colors.bold("passed"));
    if (!failingTestCount) {
      log(`\n${summary} ${passingTestCount} ${passed}.`);
    } else {
      log(
        `\n${summary} ${passingTestCount} ${passed}, ${failed} ${failingTestCount}.`
      );
    }
  });
};
