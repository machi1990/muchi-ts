const path = require("path");
const ts = require("typescript");
const {
  OnlyAnnotation,
  MuchiTsAnnotation
} = (muchiTsIdentifiers = require("./ts-muchi-annotation"));
const {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  statSync
} = require("fs");
const tsOrJsExtension = /(\.[tj]s)$/;

function findMuchiTsOptions(sourceFile) {
  const declaredMuchiTsIdentifiers = new Set();

  find(sourceFile);

  function find(node) {
    switch (node.kind) {
      case ts.SyntaxKind.Decorator:
        const indentifier = findIdentifierFromNode(node);
        if (muchiTsIdentifiers.includes(indentifier)) {
          declaredMuchiTsIdentifiers.add(indentifier);
        }
        break;
    }

    if (declaredMuchiTsIdentifiers.size === muchiTsIdentifiers.length) return;
    ts.forEachChild(node, find);
  }

  function findIdentifierFromNode(node) {
    if (!node.expression) return "";
    const { escapedText } = node.expression;
    if (escapedText) return escapedText;
    return findIdentifierFromNode(node.expression);
  }

  return [...declaredMuchiTsIdentifiers];
}

function mkdirIfNotExists(dir) {
  if (existsSync(dir)) {
    return;
  }

  mkdirSync(dir, { recursive: true });
}

function writeToFile(file, data) {
  mkdirIfNotExists(path.dirname(file));
  writeFileSync(file, data);
}

function writeSourceMap(sourceMapText, outputFile, sourceFile) {
  const sourceMapFile = outputFile + ".map";
  const sourceMap = JSON.parse(sourceMapText);
  sourceMap["file"] = path.basename(outputFile); // points to the transpiled file
  sourceMap["sources"] = [path.join(process.cwd(), sourceFile)]; // points to the source file
  const sourceMapData = Buffer.from(JSON.stringify(sourceMap));
  writeToFile(sourceMapFile, sourceMapData);
}

function writeTranspileOutputToFile(
  outputText,
  { file, fileName },
  { muchiTsOptions, requirePath }
) {
  const isTestFile = muchiTsOptions.length;
  let requireMuchiTs = "";
  if (isTestFile) {
    /**
     * Make require('..') more dynamic depending on environment
     */
    requireMuchiTs = `const {${muchiTsOptions.join(
      ","
    )}} = require('${requirePath}').muchiTsApi('${fileName}');\n`;
  }
  const transpiledModule =
    requireMuchiTs +
    outputText.replace(
      /sourceMappingURL=module\.js\.map$/,
      `sourceMappingURL=${path.basename(file, ".js")}.js.map`
    );
  const outputData = Buffer.from(transpiledModule);
  writeToFile(file, outputData);
}

function transpileSource(source, outDir) {
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
      exclude: [outDir, "node_modules"]
    }
  });
}

module.exports = (fileNames, outDir, requirePath) => {
  const transpilationResults = {};

  mkdirIfNotExists(outDir);

  fileNames.forEach(fileName => {
    const stat = statSync(fileName);
    if (stat.isDirectory()) {
      mkdirIfNotExists(path.join(outDir, fileName));
      return;
    }

    const fileBuffer = readFileSync(fileName);

    /**
     * Do not transpile neither .ts nor .js file.
     */
    if (!tsOrJsExtension.test(fileName)) {
      writeToFile(path.join(outDir, fileName), fileBuffer);
      return;
    }

    const source = fileBuffer.toString();
    const basename = fileName.substring(0, fileName.length - 3) + ".js";
    const file = path.join(outDir, basename);
    /**
     * Create source file's AST.
     */
    const sourceFile = ts.createSourceFile(
      fileName,
      source,
      ts.ScriptTarget.ES2015,
      false
    );

    /**
     * Find annotation from AST
     */
    const muchiTsOptions = findMuchiTsOptions(sourceFile);
    /**
     * Transpile module
     */
    const { outputText, sourceMapText } = transpileSource(source, outDir);

    writeTranspileOutputToFile(
      outputText,
      { file, fileName },
      { muchiTsOptions, requirePath }
    );

    const transpilationResult = {
      only: muchiTsOptions.includes(OnlyAnnotation),
      runnable: muchiTsOptions.includes(MuchiTsAnnotation),
      outputFile: file
    };

    transpilationResults[fileName] = transpilationResult;

    /**
     * Write source map file.
     */
    writeSourceMap(sourceMapText, file, fileName);
  });

  return transpilationResults;
};
