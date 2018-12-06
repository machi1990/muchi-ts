const runTranspiledFile = require("./run-transpiled-file");

/**
 * Runs test files located in an output folder
 */

module.exports = transpiledFiles => {
  const hasOnly = Object.values(transpiledFiles).some(({ only }) => only);
  const canRun = file => {
    const transpiledFile = transpiledFiles[file];
    return transpiledFile.runnable && (!hasOnly || transpiledFile.only);
  };

  const pids = [];

  for (const fileName in transpiledFiles) {
    if (!canRun(fileName)) continue;

    pids.push(runTranspiledFile(transpiledFiles[fileName].outputFile));
  }

  return pids;
};
