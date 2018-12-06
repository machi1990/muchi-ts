const { spawn } = require("child_process");

module.exports = outputFile => {
  let testOutput = "";
  const testRunning = spawn("node", [outputFile]);
  const append = chunk => {
    const out = chunk.toString();
    if (!out) return;
    testOutput += out;
  };

  const display = code => {
    if (code) {
      console.log(testOutput);
    } else {
      console.error(testOutput);
    }
  };

  testRunning.stdout.on("data", append);
  testRunning.stderr.on("data", append);
  testRunning.on("close", display);
  return testRunning;
};
