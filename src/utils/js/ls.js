const path = require("path");
const flatten = require("./flatten");
const { statSync, readdirSync } = require("fs");

/**
 *
 * @param {*} file
 * @param {*} opts {exlude: [], predicate}
 */
const ls = (file, opts) => {
  const stat = statSync(file);
  const exclude = opts.exclude || [];
  const predicate = opts.predicate || (() => true);
  const isTestCodeFile = stat.isFile() && predicate(file);
  const isCodeDir = stat.isDirectory() && !exclude.includes(file);

  if (isCodeDir) {
    const lsDir = readdirSync(file).map(child =>
      ls(path.join(file, child), opts)
    );
    return [file, ...flatten(lsDir)];
  } else if (isTestCodeFile) {
    return [file];
  }
  return [];
};

module.exports = ls;
