const path = require("path");
const runCompiledFile = require("./run-compiled-file");
/**
 * Runs test files located in an ouput folder
 */
module.exports = outputDir => files => {
  files.map(file =>
    runCompiledFile({
      file,
      compilationPath: path.join(
        outputDir,
        file.substring(0, file.length - 3) + ".js" // filename with relative directory path
      )
    })
  );
};
