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
    const output = transpileSource(source, outDir);

    writeTranspiledOutputToFile(
      output,
      { file, fileName },
      { muchiTsOptions, requirePath }
    );

    const transpilationResult = {
      only: muchiTsOptions.includes(OnlyAnnotation),
      runnable: muchiTsOptions.includes(MuchiTsAnnotation),
      outputFile: file
    };

    transpilationResults[fileName] = transpilationResult;
  });

  return transpilationResults;
};

const mkdirIfNotExists = dir => {
  if (existsSync(dir)) {
    return;
  }

  mkdirSync(dir, { recursive: true });
};

const writeToFile = (file, data) => {
  mkdirIfNotExists(path.dirname(file));
  writeFileSync(file, data);
};

const findMuchiTsOptions = sourceFile => {
  const declaredMuchiTsIdentifiers = new Set();
  findOptions(declaredMuchiTsIdentifiers)(sourceFile);
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

const transpileSource = (source, outDir) => {
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
      exclude: [outDir, "node_modules"]
    }
  });
};

const writeTranspiledOutputToFile = (
  {outputText, sourceMapText},
  { file, fileName },
  { muchiTsOptions, requirePath }
) => {
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
  const sourceMap = encodeSourceMap(sourceMapText, file, fileName);

  const transpiledModule =
    requireMuchiTs +
    outputText.replace(
      /sourceMappingURL=module\.js\.map$/,
      `sourceMappingURL=data:application/json;base64,${sourceMap}`
    );
  const outputData = Buffer.from(transpiledModule);
  writeToFile(file, outputData);
};

const encodeSourceMap = (sourceMapText, outputFile, sourceFile) => {
  const sourceMap = JSON.parse(sourceMapText);
  sourceMap["file"] = path.basename(outputFile); // points to the transpiled file
  sourceMap["sources"] = [path.join(process.cwd(), sourceFile)]; // points to the source file
  return Buffer.from(JSON.stringify(sourceMap)).toString('base64');
};
