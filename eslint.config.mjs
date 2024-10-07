export default [
  {
    files: ["main.js", "src/modules/**/*.js"],
    rules: {
      "prefer-const": "warn",
      "no-constant-binary-expression": "error"
    }
  }
];
