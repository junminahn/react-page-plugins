module.exports = {
  extends: ['airbnb-typescript', 'prettier'],
  env: { es6: true, browser: true },
  plugins: ['jest'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    createDefaultProgram: true,
  },
  root: true,
  rules: {
    '@typescript-eslint/dot-notation': 0,
    '@typescript-eslint/naming-convention': 0,
    '@typescript-eslint/no-shadow': 0,
    '@typescript-eslint/no-unused-vars': 0,
    'arrow-body-style': 0,
    'func-names': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': 0,
    'import/prefer-default-export': 0,
    'no-console': 0,
    'no-plusplus': 0,
    'no-underscore-dangle': 0,
    'no-param-reassign': 0,
    'no-nested-ternary': 0,
    'prefer-destructuring': 0,
    'react/destructuring-assignment': 0,
    'react/jsx-filename-extension': 0,
    'react/jsx-props-no-spreading': 0,
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 0,
    'react/require-default-props': 0,
    'react/no-unescaped-entities': 0,
    'import/no-mutable-exports': 0,
  },
  overrides: [],
};
