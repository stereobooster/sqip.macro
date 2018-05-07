const path = require("path");
const lqip = require("lqip");
const { createMacro } = require("babel-plugin-macros");

export default createMacro(lqipMacros);

async function lqipMacros({ references, state, babel }) {
  await Promise.all(
    references.default.map(async referencePath => {
      if (referencePath.parentPath.type === "CallExpression") {
        await requirelqip({ referencePath, state, babel });
      } else {
        throw new Error(
          `This is not supported: \`${referencePath
            .findParent(babel.types.isExpression)
            .getSource()}\`. Please see the lqip.macro documentation`,
        );
      }
    }),
  );
}

async function requirelqip({ referencePath, state, babel }) {
  const filename = state.file.opts.filename;
  const t = babel.types;
  const callExpressionPath = referencePath.parentPath;
  const dirname = path.dirname(filename);
  let lqipPath;

  try {
    lqipPath = callExpressionPath.get("arguments")[0].evaluate().value;
  } catch (err) {
    // swallow error, print better error below
  }

  if (lqipPath === undefined) {
    throw new Error(
      `There was a problem evaluating the value of the argument for the code: ${callExpressionPath.getSource()}. ` +
        `If the value is dynamic, please make sure that its value is statically deterministic.`,
    );
  }

  const fullPath = path.resolve(dirname, lqipPath);
  const fileContent = await lqip.base64(fullPath);

  referencePath.parentPath.replaceWith(
    t.expressionStatement(t.stringLiteral(fileContent)),
  );
}
