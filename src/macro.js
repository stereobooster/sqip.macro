const path = require("path");
const sqip = require("sqip");
const svgToMiniDataURI = require("mini-svg-data-uri");

const { createMacro } = require("babel-plugin-macros");

export default createMacro(sqipMacros);

function sqipMacros({ references, state, babel }) {
  references.default.map(referencePath => {
    if (referencePath.parentPath.type === "CallExpression") {
      requiresqip({ referencePath, state, babel });
    } else {
      throw new Error(
        `This is not supported: \`${referencePath
          .findParent(babel.types.isExpression)
          .getSource()}\`. Please see the sqip.macro documentation`,
      );
    }
  });
}

function requiresqip({ referencePath, state, babel }) {
  const filename = state.file.opts.filename;
  const t = babel.types;
  const callExpressionPath = referencePath.parentPath;
  const dirname = path.dirname(filename);
  let sqipPath;

  try {
    sqipPath = callExpressionPath.get("arguments")[0].evaluate().value;
  } catch (err) {
    // swallow error, print better error below
  }

  if (sqipPath === undefined) {
    throw new Error(
      `There was a problem evaluating the value of the argument for the code: ${callExpressionPath.getSource()}. ` +
        `If the value is dynamic, please make sure that its value is statically deterministic.`,
    );
  }

  const fullPath = path.resolve(dirname, sqipPath);
  let fileContent;
  try {
    fileContent = sqip({
      filename: fullPath,
      numberOfPrimitives: 10,
    }).final_svg;
  } catch (err) {
    throw new Error(
      `There was a problem getting sqip for: ${sqipPath}. ` +
        `Unsupported image format`,
    );
  }

  referencePath.parentPath.replaceWith(
    t.expressionStatement(t.stringLiteral(`${svgToMiniDataURI(fileContent)}`)),
  );
}
