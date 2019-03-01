const fs = require("fs");
const ls = require("./ls");
const path = require("path");
const Module = require("module");
const colors = require("colors");
const tranpile = require("./transpile");

const cwd = process.cwd();
const failure = `${colors.red("\u2718")}`;
const _load = Module._load.bind(Module);
const _findPath = Module._findPath.bind(Module);

let requirePath = "";
let transpilationResults = {};
const error = console.error.bind(console);

console.error = (...args) => {
  process.exitCode = args.join("").includes(failure) ? 1 : process.exitCode;
  error.apply(null, args);
};

module.exports = _requirePath => (testsArg, watch) => {
  requirePath = _requirePath;
  const workingDir = ".";
  const allFiles = ls(workingDir, {
    exclude: ["node_modules", ".git"]
  });

  /**
   * compile
   */
  transpilationResults = tranpile(allFiles, requirePath);
  runTranspiledTestFiles(testsArg)(transpilationResults);

  if (!watch) {
    return;
  }

  watchFilesChangeAndRerunTests(testsArg)(allFiles, requirePath);
};

const watchFilesChangeAndRerunTests = testsArg => allFiles => {
  allFiles.forEach(file => {
    fs.watchFile(file, { persistent: true, interval: 1500 }, (curr, prev) => {
      if (+curr.mtime <= +prev.mtime) {
        return;
      }
      fileChanged = true;
      const transpilationResult = tranpile([file], requirePath);
      transpilationResults[file] = transpilationResult[file];
      runTranspiledTestFiles(testsArg)(transpilationResults);
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
