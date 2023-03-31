module.exports = {
  extends: ['@cybozu', '@cybozu/eslint-config/globals/kintone'],
  rules: {
    'max-statements': 'off',
    indent: 'off',
    'object-curly-spacing': ['error', 'always'],
    'prefer-arrow-callback': 'off',
    'no-unused-vars': 'off',
    'no-undef': 'warn',
  },
  env: {
    browser: true,
    es2021: true,
  },
};