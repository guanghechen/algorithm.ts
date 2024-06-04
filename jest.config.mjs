import { tsMonorepoConfig } from '@guanghechen/jest-config'
import path from 'node:path'
import url from 'node:url'

export default async function () {
  const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
  const { default: manifest } = await import(path.resolve('package.json'), {
    assert: { type: 'json' },
  })
  const baseConfig = await tsMonorepoConfig(__dirname, {
    useESM: true,
    tsconfigFilepath: path.join(__dirname, 'tsconfig.test.json'),
  })

  const config = {
    ...baseConfig,
    coveragePathIgnorePatterns: [
      ...(baseConfig.coveragePathIgnorePatterns || []),
      '<rootDir>/src/dev.ts',
    ],
    coverageThreshold: {
      ...coverageMap[manifest.name],

      global: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
        ...coverageMap[manifest.name]?.global,
      },
    },
    extensionsToTreatAsEsm: ['.ts', '.mts'],
  }
  return config
}

const coverageMap = {
  '@algorithm.ts/bipartite-matching': {
    global: { functions: 87, lines: 95, statements: 95 },
  },
  '@algorithm.ts/calculator': {
    global: { branches: 97, lines: 98, statements: 98 },
  },
  '@algorithm.ts/graph': {
    global: { functions: 75, lines: 82, statements: 82 },
  },
  '@algorithm.ts/gomoku': {
    global: { branches: 92, lines: 99, statements: 99 },
  },
  '@algorithm.ts/kth': {
    global: { branches: 98 },
  },
  '@algorithm.ts/shuffle': {
    global: { branches: 88 },
  },
  '@algorithm.ts/sort': {
    global: { branches: 99 },
  },
  '@algorithm.ts/sudoku': {
    global: { branches: 96, lines: 99, statements: 99 },
  },
}
