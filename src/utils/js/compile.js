const path = require("path");
const ts = require("typescript");
const colors = require("colors");

module.exports = (fileNames, outputDir = undefined) => {
  const outDir = outputDir || "build";

  const defaultCompilerOpts = {
    allowJs: true,
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

  const compilerOpts = {
    ...{
      outDir: path.join(process.cwd(), outDir)
    },
    ...defaultCompilerOpts
  };

  const emitResult = ts.createProgram(fileNames, compilerOpts).emit();
  if (emitResult.emitSkipped) {
    console.log(colors.red("compilation failed", fileNames));
    process.exit(1);
  }
};
