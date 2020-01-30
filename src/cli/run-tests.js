const fs = require("fs");
const ls = require("./ls");
const path = require("path");
require("../api/test-counter");
const Module = require("module");
const colors = require("colors");
const cluster = require("cluster");
const tranpile = require("./transpile");

const cwd = process.cwd();
const _load = Module._load.bind(Module);
const _findPath = Module._findPath.bind(Module);

let worker;
let requirePath = "";
let counts = {
  passed: 0,
  failed: 0,
  skipped: 0
};

let transpilationResults = {};
const testCounter = global["muchi-ts-test-counter"];

testCounter.on("passed", () => {
  counts.passed += 1;
});

testCounter.on("failed", () => {
  counts.failed += 1;
  process.exitCode = 1;
});

testCounter.on("skipped", () => {
  counts.skipped += 1;
});

module.exports = _requirePath => (testsArg, watch, timeOut) => {
  requirePath = _requirePath;
  const files = ls(".", {
    exclude: ["node_modules", ".git"]
  });
  /**
   * compile
   */
  transpilationResults = tranpile(files, requirePath, timeOut);

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
      watchFilesChanges(files, timeOut);
    }
  } else {
    /**
     * Run watched files in child process
     */
    runTranspiledTestFiles(testsArg)(transpilationResults);
  }
};

const watchFilesChanges = (files, timeOut) => {
  files.forEach(file => {
    fs.watchFile(file, { persistent: true, interval: 1500 }, (curr, prev) => {
      if (+curr.mtime <= +prev.mtime) {
        return;
      }

      transpilationResults = {
        ...transpilationResults,
        ...tranpile([file], requirePath, timeOut)
      };
      counts = {
        passed: 0,
        failed: 0,
        skipped: 0
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
        return _load(request, parent, isMain);
      } catch (error) {
        let transpilationKey = filename.replace(`${cwd}${path.sep}`, "");
        try {
          fs.lstatSync(filename);
          transpilationKey = (transpilationKey + "/index").replace(
            /\/{2,}/g,
            "/"
          );
        } catch (_) {}

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
        loadedModule.__filename = moduleId;
        loadedModule.__dirname = path.dirname(moduleId);
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
      main.__filename = filename;
      main.__dirname = path.dirname(filename);
      main.paths = Module._nodeModulePaths(cwd);
      main._compile(source, filename);
    }
  };
};

const printSummaryBeforeProcessExit = _ => {
  process.on("beforeExit", () => {
    const summary = Object.keys(counts)
      .filter(key => counts[key])
      .map(key => {
        let summaryMessage = "\n> ";
        if (key === "passed") {
          summaryMessage += colors.green(colors.bold(key));
        } else if (key === "failed") {
          summaryMessage += colors.red(colors.bold(key));
        } else {
          summaryMessage += colors.cyan(colors.bold(key));
        }
        return summaryMessage + " " + counts[key];
      })
      .join();

    const totalMessage = colors.bold(
      "summary:\n> total " +
        Object.values(counts).reduce((acc, count) => acc + count, 0)
    );
    console.log(`\n${totalMessage}${summary}\n`);
  });
};
