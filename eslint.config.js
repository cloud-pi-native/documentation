import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: {
    overrides: {
      'style/comma-dangle': ['error', 'always-multiline'],
      'style/quote-props': ['error', 'as-needed', { keywords: false, unnecessary: true }],
      'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'style/max-statements-per-line': ['error', { max: 2 }],
      'jsonc/sort-keys': 'off',
      'node/prefer-global/process': ['error', 'always'],
      'node/prefer-global/console': ['error', 'always'],
      'yaml/quotes': ['error', { prefer: 'double' }],
    },
  },
  yaml: {
    overrides: {
      'yaml/quotes': ['error', { prefer: 'double' }],
    },
  },
  ignores: [
    '**/node_modules',
    '**/pnpm-lock.yaml',
    '**/.turbo',
    'helm/templates',
    '**/tsconfig.base.json',
    '**/tsconfig.json',
  ],
})
