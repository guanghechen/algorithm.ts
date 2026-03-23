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

interface ICoverageThresholdFile {
  global?: ICoverageThresholdValue
  files?: Record<string, ICoverageThresholdValue>
}

function getPackageDirName(): string {
  const cwd = process.cwd()
  const match = cwd.match(/packages[/\\]([^/\\]+)$/)
  return match ? match[1] : ''
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

function loadCoverageThresholds(): Record<string, ICoverageThresholdValue | number> {
  const packageDir = getPackageDirName()
  const defaults: Record<string, ICoverageThresholdValue | number> = {
    branches: 100,
    functions: 100,
    lines: 100,
    statements: 100,
  }

  if (!packageDir) {
    return defaults
  }

  const thresholdPath = path.resolve(__dirname, 'packages', packageDir, 'coverage.thresholds.json')
  if (!fs.existsSync(thresholdPath)) {
    return defaults
  }

  const thresholdFile: ICoverageThresholdFile = JSON.parse(fs.readFileSync(thresholdPath, 'utf-8'))
  const globalThresholds = thresholdFile.global ?? {}
  const fileThresholds = thresholdFile.files ?? {}

  return {
    ...defaults,
    ...globalThresholds,
    ...Object.fromEntries(
      Object.entries(fileThresholds).map(([filePath, thresholds]) => [filePath, thresholds]),
    ),
  }
}

// Get all package directory names to exclude from coverage (except current package)
function getOtherPackageExcludes(): string[] {
  const packagesDir = path.resolve(__dirname, 'packages')
  const currentPackage = getPackageDirName()
  if (!fs.existsSync(packagesDir)) return []

  const packages = fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name !== currentPackage)
    .map(dirent => `${path.resolve(packagesDir, dirent.name, 'src')}/**`)

  return packages
}

export default defineConfig({
  test: {
    environment: 'node',
    include: ['__test__/**/*.spec.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['**/node_modules/**', '**/__test__/**', ...getOtherPackageExcludes()],
      thresholds: loadCoverageThresholds(),
    },
  },
  resolve: {
    alias: {
      '@@': __dirname,
      'vitest.helper': path.resolve(__dirname, 'vitest.helper.mts'),
      ...getPackageAliases(),
    },
  },
})
