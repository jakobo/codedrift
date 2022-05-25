module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: ["next/core-web-vitals"],
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  ignorePatterns: [
    "vendor/*",
    "node_modules/*",
    ".next/*",
    "src/*.generated.ts",
  ],
};
