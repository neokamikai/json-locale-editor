module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    "airbnb-typescript/base"
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: ["./tsconfig.json"],
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    "import/no-named-as-default": "off"
  },
};
