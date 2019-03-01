const colors = require("colors");
const muchiTsProgram = require("commander");

const collect = (val, memo) => {
  memo.push(val);
  return memo;
};

module.exports = (name, version) => argv => {
  muchiTsProgram
    .version(`${name} ${version}`, "-v, --version")
    .option("-w, --watch", "Rerun tests on file changes.")
    .option(
      "-t, --tests  <tests>",
      "A path to test files or a regex describing this path. This option can be used many times.",
      collect,
      []
    )
    .parse(argv);

  if (!muchiTsProgram.tests.length) {
    console.error(
      colors.red(
        'You must supply a path to test files. Use the "-t" option to do so.'
      )
    );
    process.exit(0);
  }

  return { ...muchiTsProgram };
};
