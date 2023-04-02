import { tsMonorepoConfig } from '@guanghechen/jest-config'
import path from 'node:path'
import url from 'node:url'

export default async function () {
  const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
  const baseConfig = await tsMonorepoConfig(__dirname, { useESM: true })
  const { default: manifest } = await import(path.resolve('package.json'), {
    assert: { type: 'json' },
  })

  const config = {
    ...baseConfig,
    preset: 'ts-jest/presets/default-esm',
    coverageProvider: 'babel',
    coverageThreshold: {
      global: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
        ...manifest.jest?.coverageThreshold?.global,
      },
    },
    extensionsToTreatAsEsm: ['.ts', '.mts'],
  }
  return config
}
