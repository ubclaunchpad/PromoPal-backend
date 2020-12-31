module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  rules: {
    quotes: ["error", "double"],
    "no-console": "error",
    "no-debugger": "error",
    "@typescript-eslint/no-explicit-any": ["error", { ignoreRestArgs: true }],
  },
};
