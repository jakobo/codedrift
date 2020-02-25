// you can (and should) extend me if required. These are the base common rules for eslint
module.exports = {
  root: true,
  parser: "babel-eslint",
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  globals: {
    window: true,
    process: true,
    fetch: false,
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["react", "sort-imports-es6-autofix"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "sort-imports-es6-autofix/sort-imports-es6": [
      2,
      {
        ignoreCase: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
      },
    ],
    "react/prop-types": 0,
    "no-unused-vars": [
      2,
      {
        ignoreRestSiblings: true, // allow destructiring to drop properties
      },
    ],
  },
};
