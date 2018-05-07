const path = require("path");
const pluginTester = require("babel-plugin-tester");
const plugin = require("babel-plugin-macros");
const prettier = require("prettier");

pluginTester({
  plugin,
  snapshot: true,
  babelOptions: {
    filename: __filename,
  },
  formatResult(result) {
    return prettier.format(result, { trailingComma: "es5" });
  },
  tests: {
    "no usage": `import lqip from '../macro'`,
    "correct usage": `
      import lqip from '../macro';

      const preview = lqip('./fixtures/jonathan-daniels-416786-unsplash.jpg');
    `,
    // "correct usage, wrong file": `
    //   import lqip from '../macro';

    //   const preview = lqip('./fixtures/readme.md');
    // `,
  },
});
