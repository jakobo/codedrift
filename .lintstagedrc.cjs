const path = require("path");

// https://nextjs.org/docs/basic-features/eslint#lint-staged
const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`;

module.exports = {
  // global configurations, these are always cleaned with prettier
  "{*,**/*}.{json,gql,graphql,md,yaml,yml}": ["prettier --write"],
  // next.js linting
  "{*,**/*}.{js,ts,jsx,tsx,vue}": [buildEslintCommand],
};
