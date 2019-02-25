const { spawn } = require("child_process");
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

    pids.push(run(transpiledFiles[fileName].outputFile));
  }

  return pids;
};

const run = outputFile => {
  let testOutput = "";
  const job = spawn("node", [outputFile]);
  const exitCode = 0;
  const done = false;
  const testRunning = {
    exitCode,
    job,
    done
  };

  const append = chunk => {
    const out = chunk.toString();
    if (!out) return;
    testOutput += out;
  };

  const display = _ => {
    console.log(testOutput);
    testRunning.done = true;
  };

  job.stdout.on("data", append);
  job.stderr.on("data", chuck => {
    append(chuck);
    testRunning.exitCode = 1;
  });
  job.on("close", display);
  return testRunning;
};
