const colors = require("colors");
const { spawn } = require("child_process");

module.exports = ({ fileName, outputFile }) => {
  const startTime = Date.now();
  const testRunning = spawn("node", [outputFile]);
  let testOutput = "";

  const append = chunk => {
    const out = chunk.toString();
    if (!out) return;
    testOutput += out;
  };

  const display = code => {
    const duration = Date.now() - startTime;
    const finished = code ? colors.red("Finished-") : colors.white("Finished-");

    console.log(fileName, finished, `- ${duration} ms`);
    console.log(testOutput);
  };

  testRunning.stdout.on("data", append);
  testRunning.stderr.on("data", append);
  testRunning.on("close", display);
  return testRunning;
};
