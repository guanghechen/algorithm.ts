import ghcConfigs from '@guanghechen/eslint-config'

export default [
  {
    ignores: ['.vscode/', '**/__tmp__/', '**/doc/', '**/example/'],
  },
  ...ghcConfigs,
  {
    files: ['**/*.{ts,cts,mts}'],
    rules: {
      'no-plusplus': 'off',
      'space-in-parens': 'off',
    },
  },
  {
    files: ['**/__test__/oj/*.ts'],
    rules: {
      'no-plusplus': 'off',
      'no-return-assign': 'off',
      'no-param-reassign': 'off',
    },
  },
]
