const colors = require("colors");
const { spawn } = require("child_process");

module.exports = ({ file, compilationPath }) => {
  const startTime = Date.now();
  const testRunning = spawn("node", [compilationPath]);
  let testOutput = "";

  const append = chunk => {
    const out = chunk.toString();
    if (!out) return;
    testOutput += out;
  };

  const display = code => {
    const duration = Date.now() - startTime;
    const finished = code ? colors.red("Finished-") : colors.white("Finished-");

    console.log(testOutput);
    console.log(file, finished, `- ${duration} ms`);
  };

  testRunning.stdout.on("data", append);
  testRunning.stderr.on("data", append);
  testRunning.on("close", display);
  return testRunning;
};
