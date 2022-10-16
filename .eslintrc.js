const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'),
);

module.exports = {
  env: {
    browser: true,
    jest: true,
  },
  extends: ['airbnb-typescript-prettier'], // if you're using typescript
  plugins: ['react', 'prettier', '@typescript-eslint', 'jest'],
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2020,
    project: ['tsconfig.json'],
    sourceType: 'module',
  },
  parser: '@typescript-eslint/parser',
  rules: {
    'react/jsx-props-no-spreading': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'no-param-reassign': 0,
    'prefer-destructuring': 0,
    'import/no-cycle': 0,
    'import/no-unresolved': 0,
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/interactive-supports-focus': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'import/prefer-default-export': 0,
    'react/require-default-props': 0,
    '@typescript-eslint/no-unused-vars': ['warn'],
    "no-unused-expressions": "off",
    "@typescript-eslint/no-unused-expressions": ["off"],
  },
};
