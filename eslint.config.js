import ghcConfigs from '@guanghechen/eslint-config'

export default [
  {
    ignores: [
      '.DS_Store',
      '**/*.hbs',
      '.vscode/',
      '**/.husky/',
      '**/.nx/',
      '**/.git/',
      '**/.yarn/',
      '**/__tmp__/',
      '**/__test__/cases/',
      '**/__test__/fixtures/',
      '**/coverage/',
      '**/dist/',
      '**/doc/',
      '**/example/',
      '**/lib/',
      '**/node_modules/',
      '**/resources/',
      '**/test/',
    ],
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
