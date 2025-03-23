module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  plugins: ['react', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier', // отключает конфликты с Prettier
  ],
  rules: {
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'react/react-in-jsx-scope': 'off', // не нужен в React 17+
    '@typescript-eslint/no-unused-vars': ['warn'],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
