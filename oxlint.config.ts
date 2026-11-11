import { defineConfig } from 'oxlint';

// Oxlint also respects .gitignore for dependencies and generated files.
export default defineConfig({
  plugins: [
    'eslint',
    'typescript',
    'unicorn',
    'oxc',
    'nextjs',
    'react',
    'import',
    'jsx-a11y',
    'vitest'
  ],
  categories: {
    correctness: 'error'
  },
  env: {
    builtin: true,
    browser: true,
    node: true
  },
  ignorePatterns: ['build/**', '**/*.min.js'],
  rules: {
    'no-array-constructor': 'error',
    'typescript/ban-ts-comment': 'error',
    'typescript/no-empty-object-type': 'error',
    'typescript/no-explicit-any': 'error',
    'typescript/no-namespace': 'error',
    'typescript/no-require-imports': 'error',
    'typescript/no-unnecessary-type-constraint': 'error',
    'typescript/no-unsafe-function-type': 'error',
    'react/display-name': 'error',
    'react/jsx-no-comment-textnodes': 'error',
    'react/no-unescaped-entities': 'error',
    'import/no-anonymous-default-export': 'error',
    'jsx-a11y/alt-text': [
      'error',
      {
        elements: ['img'],
        img: ['Image']
      }
    ],
    'react/rules-of-hooks': 'error',
    'react/require-render-return': 'error',
    'no-unused-vars': [
      'error',
      {
        args: 'after-used',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true,
        caughtErrors: 'none',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }
    ],
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true
      }
    ],
    'no-empty': [
      'error',
      {
        allowEmptyCatch: true
      }
    ],
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'oxc/no-accumulating-spread': 'error'
  },
  overrides: [
    {
      files: ['**/*.{js,mjs,cjs,jsx}'],
      rules: {
        'no-undef': 'error',
        'typescript/no-require-imports': 'off'
      }
    }
  ]
});
