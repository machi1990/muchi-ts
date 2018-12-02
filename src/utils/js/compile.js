const fs = require('fs');
const path = require("path");
const ts = require("typescript");
const colors = require("colors");

module.exports = (fileNames, outDir) => {
  const defaultCompilerOpts = {
    allowJs: false,
    checkJs: false,
    lib: ["es6", "dom"],
    noEmitOnError: false,
    types: ["@types/node"],
    listFiles: true,
    listEmittedFiles: true,
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS,
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
    inlineSourceMap: true,
    inlineSources: true,
    exclude: [outDir, "node_modules"]
  };

  const compileOpts = {
    ...{
      outDir: path.join(process.cwd(), outDir)
    },
    ...defaultCompilerOpts
  };

  const emitResult = ts.createProgram(fileNames, compileOpts).emit();
  if (emitResult.emitSkipped) {
    console.log(colors.red('compilation failed for:', fileNames));
    process.exit(1);
  }
}
