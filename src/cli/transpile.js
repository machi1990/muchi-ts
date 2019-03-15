const path = require("path");
const ts = require("typescript");
const nyc = new (require("nyc"))();
const { readFileSync, statSync } = require("fs");
const {
  OnlyAnnotation,
  MuchiTsAnnotation
} = (muchiTsIdentifiers = require("./ts-muchi-annotation"));

const tsExtension = /(\.[t]s)$/;
const coverageInstrumenter = nyc.instrumenter();
module.exports = (fileNames, requirePath, timeOut) => {
  const transpilationResults = {};

  fileNames.forEach(fileName => {
    const stat = statSync(fileName);
    if (stat.isDirectory()) {
      return;
    }

    const fileBuffer = readFileSync(fileName);

    /**
     * Transpile only .ts file.
     */
    if (!tsExtension.test(fileName)) {
      return;
    }

    const source = fileBuffer.toString();
    /**
     * Create source file's AST.
     */
    const tsSourceFile = ts.createSourceFile(
      fileName,
      source,
      ts.ScriptTarget.ES2015,
      false
    );

    /**
     * Find annotation from AST
     */
    const muchiTsOptions = findMuchiTsOptions(tsSourceFile);
    /**
     * Transpile module
     */
    const output = transpileSource(source);

    const transpiledSource = getTranspiledSource(output, fileName, {
      muchiTsOptions,
      requirePath,
      timeOut
    });

    const transpilationResult = {
      fileName,
      only: muchiTsOptions.includes(OnlyAnnotation),
      runnable: muchiTsOptions.includes(MuchiTsAnnotation),
      output: coverageInstrumenter.instrumentSync(transpiledSource, fileName)
    };

    transpilationResults[fileName] = transpilationResult;
  });

  return transpilationResults;
};

const findMuchiTsOptions = tsSourceFile => {
  const declaredMuchiTsIdentifiers = new Set();
  findOptions(declaredMuchiTsIdentifiers)(tsSourceFile);
  return [...declaredMuchiTsIdentifiers];
};

const findOptions = declaredMuchiTsIdentifiers => node => {
  switch (node.kind) {
    case ts.SyntaxKind.Decorator:
      const indentifier = findIdentifierFromNode(node);
      if (muchiTsIdentifiers.includes(indentifier)) {
        declaredMuchiTsIdentifiers.add(indentifier);
      }
      break;
  }

  if (declaredMuchiTsIdentifiers.size === muchiTsIdentifiers.length) return;
  ts.forEachChild(node, findOptions(declaredMuchiTsIdentifiers));
};

const findIdentifierFromNode = node => {
  if (!node.expression) return "";
  const { escapedText } = node.expression;
  if (escapedText) return escapedText;
  return findIdentifierFromNode(node.expression);
};

const transpileSource = source => {
  return ts.transpileModule(source, {
    compilerOptions: {
      allowJs: false,
      checkJs: false,
      lib: ["es6", "dom"],
      noEmitOnError: false,
      types: ["@types/node", "@types/muchi-ts"],
      listFiles: true,
      alwaysStrict: false,
      noImplicitUseStrict: false,
      listEmittedFiles: true,
      target: ts.ScriptTarget.ES5,
      module: ts.ModuleKind.CommonJS,
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
      sourceMap: true,
      inlineSourceMap: false,
      exclude: ["node_modules"]
    }
  });
};

const getTranspiledSource = (
  { outputText, sourceMapText },
  fileName,
  { muchiTsOptions, requirePath, timeOut }
) => {
  const isTestFile = muchiTsOptions.length;
  let requireMuchiTs = "";
  if (isTestFile) {
    /**
     * Make require('..') more dynamic depending on environment
     */
    requireMuchiTs = `const {${muchiTsOptions.join(
      ","
    )}} = require('${requirePath}').muchiTsApi('${fileName}', ${timeOut});\n`;
  }
  const sourceMap = encodeSourceMap(sourceMapText, fileName);

  const transpiledModule =
    requireMuchiTs +
    outputText.replace(
      /sourceMappingURL=module\.js\.map$/,
      `sourceMappingURL=data:application/json;base64,${sourceMap}`
    );
  return transpiledModule;
};

const encodeSourceMap = (sourceMapText, sourceFile) => {
  const sourceMap = JSON.parse(sourceMapText);
  sourceMap["file"] = path.basename(sourceFile); // points to the transpiled file
  sourceMap["sources"] = [path.join(process.cwd(), sourceFile)]; // points to the source file
  return Buffer.from(JSON.stringify(sourceMap)).toString("base64");
};
