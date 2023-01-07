import { tsMonorepoConfig } from '@guanghechen/jest-config'
import path from 'node:path'
import url from 'node:url'

export default async function () {
  const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
  const baseConfig = await tsMonorepoConfig(__dirname, { useESM: true })

  const config = {
    ...baseConfig,
    preset: 'ts-jest/presets/default-esm',
    coverageProvider: 'babel',
    coverageThreshold: {
      global: {
        branches: 90,
        functions: 95,
        lines: 95,
        statements: 95,
      },
    },
    extensionsToTreatAsEsm: ['.ts', '.mts'],
  }
  return config
}
