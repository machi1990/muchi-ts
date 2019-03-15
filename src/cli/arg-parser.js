const colors = require("colors");
const muchiTsProgram = require("commander");

const collect = (val, memo) => {
  memo.push(val);
  return memo;
};

const parseTimeOut = time => {
  if (Number.isInteger(time)) return +time;
  return 1000;
};

const parseWatchMode = watch => {
  console.log({ watch });
};

module.exports = (name, version) => argv => {
  const { tests, watch, timeOut } = muchiTsProgram
    .version(`${name} ${version}`, "-v, --version")
    .option(
      "-w, --watch <watch>",
      "Rerun tests on file changes. Defaults to false",
      parseWatchMode,
      false
    )
    .option(
      "-s, --timeOut <timeOut>",
      "Time limit in ms after which a test execution times out with an error. Defaults to 1000ms",
      parseTimeOut,
      "1000"
    )
    .option(
      "-t, --tests  <tests>",
      "A path to test files or a regex describing this path. This option can be used many times.",
      collect,
      []
    )
    .parse(argv);

  if (!tests.length) {
    console.error(
      colors.red(
        'You must supply a path to test files. Use the "-t" option to do so.'
      )
    );
    process.exit(0);
  }

  return { tests, watch, timeOut };
};
