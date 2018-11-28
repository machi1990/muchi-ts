const colors = require("colors");
const { spawn } = require("child_process");

module.exports = ({ file, transpiled }) => {
  const startTime = Date.now();
  const testRunning = spawn("node", [transpiled]);
  let testOutput = "";

  testRunning.stdout.on("data", chunk => {
    const out = chunk.toString();
    if (!out) return;
    testOutput += out;
  });

  testRunning.stderr.on("data", chunk => {
    const out = chunk.toString();
    if (!out) return;
    testOutput += colors.red(out);
  });

  testRunning.on("close", code => {
    const duration = Date.now() - startTime;
    const finished = code ? colors.red("Finished-") : colors.white("Finished-");

    console.log(testOutput);
    console.log(file, finished, `- ${duration} ms`);
  });
};
