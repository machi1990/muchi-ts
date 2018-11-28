const path = require("path");
const runFile = require("./run-file");
/**
 * Runs test files located in an ouput folder
 */
module.exports = outputDir => files => {
  files.map(file =>
    runFile({
      file,
      transpiled: path.join(
        outputDir,
        file.substring(0, file.length - 3) + ".js" // filename with relative directory path
      )
    })
  );
};
