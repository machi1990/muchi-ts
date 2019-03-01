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
  const isFile = stat.isFile() && predicate(file);
  const isDirectory = stat.isDirectory() && !exclude.includes(file);

  if (isDirectory) {
    const lsDir = readdirSync(file).map(child =>
      ls(path.join(file, child), opts)
    );
    return [file, ...flatten(lsDir)];
  } else if (isFile) {
    return [file];
  }
  return [];
};

module.exports = ls;
