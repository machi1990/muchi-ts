const runCompiledFile = require("./run-transpiled-file");

/**
 * Runs test files located in an output folder
 */

module.exports = transpiledFiles => {
  const hasOnly = Object.values(transpiledFiles).some(({ only }) => only);
  const canRun = file => {
    const transpiledFile = transpiledFiles[file];
    return transpiledFile.runnable && (!hasOnly || transpiledFile.only);
  };

  return Object.keys(transpiledFiles)
    .filter(canRun)
    .map(fileName => {
      const opts = {
        fileName,
        outputFile: transpiledFiles[fileName].outputFile
      };
      return runCompiledFile(opts);
    });
};
