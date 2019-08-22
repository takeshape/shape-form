module.exports =  {
  parser:  '@typescript-eslint/parser',  // Specifies the ESLint parser
  parserOptions:  {
    ecmaVersion:  2018,  // Allows for the parsing of modern ECMAScript features
    sourceType:  'module',  // Allows for the use of imports
  },

  extends:  [
    'xo',
    'xo-react',
    'plugin:@typescript-eslint/recommended',  // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint',  // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'prettier/react',
    'plugin:prettier/recommended',  // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  plugins: [
    'jest',
    'filenames'
  ],
  rules: {
    'new-cap': 'off',
    'react/jsx-sort-props': 'off',
    'react/jsx-no-bind': 'warn',
    'react/no-deprecated': 'warn',
    'react/no-unused-prop-types': 'off',
    'react/require-default-props': 'off',
    'valid-jsdoc': 'off',
    'padding-line-between-statements': 'off',
    'lines-between-class-members': 'off',
    'capitalized-comments': 'off',
    'no-multi-assign': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/explicit-function-return-type': ['error', {allowHigherOrderFunctions: true, allowTypedFunctionExpressions: true}],
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/ban-ts-ignore': 'warn', // ONLY WHILE WE STILL HAVE JS FILES
    'filenames/match-regex': [2, '^[a-z0-9\\-\\.]+$']
  },
  overrides: [
    {
      files: ['**/*.{js,jsx}'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        'dot-notation': 'warn',
        'no-else-return': 'warn',
        'no-unneeded-ternary': 'warn',
        'react/jsx-curly-brace-presence': 'warn',
        'react/jsx-fragments': 'warn',
        'react/no-array-index-key': 'warn',
        'react/no-unsafe': 'warn',
        'react/button-has-type': 'warn'
      }
    },
    {
      files: ['**/*.tsx'],
      rules: {
        'react/prop-types': 'off'
      }
    }
  ],
  env: {
    'jest/globals': true,
    browser: true
  },
  globals: {
    '__DEV__': true,
    '__DEVTOOLS__': true,
    '__VERSION__': true
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
