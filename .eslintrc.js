module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  settings: {
    "import/resolver": {
      typescript: {},
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
    react: {
      version: "detect",
    },
  },
  plugins: ["react", "import", "@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
  ],
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
  rules: {
    "react/prop-types": 0,
    "react/no-unescaped-entities": 0,
    "import/named": 0, // import {} from react-native
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
  },
};
