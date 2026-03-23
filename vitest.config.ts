import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import { defineConfig } from 'vitest/config'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

interface ICoverageThresholdValue {
  branches?: number
  functions?: number
  lines?: number
  statements?: number
}

function getCurrentPackageName(): string {
  const manifestPath = path.resolve(process.cwd(), 'package.json')
  if (!fs.existsSync(manifestPath)) return ''

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
  return typeof manifest.name === 'string' ? manifest.name : ''
}

function getPackageAliases(): Record<string, string> {
  const aliases: Record<string, string> = {}
  const packagesDir = path.resolve(__dirname, 'packages')
  if (!fs.existsSync(packagesDir)) return aliases

  const packageDirs = fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

  for (const dir of packageDirs) {
    const packageRoot = path.resolve(packagesDir, dir)
    const manifestPath = path.resolve(packageRoot, 'package.json')
    const srcPath = path.resolve(packageRoot, 'src')
    if (!fs.existsSync(manifestPath) || !fs.existsSync(srcPath)) continue

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
    const packageName = manifest.name
    if (typeof packageName === 'string' && packageName.length > 0) {
      aliases[packageName] = srcPath
    }
  }
  return aliases
}

function getCoverageThresholds(): ICoverageThresholdValue {
  const packageName = getCurrentPackageName()
  const defaults: ICoverageThresholdValue = {
    branches: 100,
    functions: 100,
    lines: 100,
    statements: 100,
  }

  if (!packageName) return defaults

  return {
    ...defaults,
    ...(coverageMap[packageName] ?? {}),
  }
}

const coverageMap: Record<string, ICoverageThresholdValue> = {
  '@algorithm.ts/bipartite-matching': {
    functions: 87,
    lines: 95,
    statements: 95,
  },
  '@algorithm.ts/calculator': {
    branches: 96,
    lines: 98,
    statements: 98,
  },
  '@algorithm.ts/dijkstra': {
    branches: 91,
  },
  '@algorithm.ts/graph': {
    functions: 75,
    lines: 82,
    statements: 82,
  },
  '@algorithm.ts/gomoku': {
    branches: 91,
    lines: 99,
    statements: 99,
  },
  '@algorithm.ts/isap': {
    branches: 96,
  },
  '@algorithm.ts/kth': {
    branches: 98,
  },
  '@algorithm.ts/lcs': {
    branches: 94,
    lines: 97,
    statements: 97,
  },
  '@algorithm.ts/queue': {
    branches: 99,
  },
  '@algorithm.ts/shuffle': {
    branches: 88,
  },
  '@algorithm.ts/sort': {
    branches: 99,
  },
  '@algorithm.ts/sudoku': {
    branches: 92,
    lines: 99,
    statements: 98,
  },
}

export default defineConfig({
  test: {
    environment: 'node',
    include: ['__test__/**/*.spec.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['**/node_modules/**', '**/__test__/fixtures/**', 'src/dev.ts'],
      thresholds: getCoverageThresholds(),
    },
  },
  resolve: {
    alias: {
      '@@': __dirname,
      ...getPackageAliases(),
    },
  },
})
