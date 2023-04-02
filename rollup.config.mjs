import { createRollupConfig, tsPresetConfigBuilder } from '@guanghechen/rollup-config'
import path from 'node:path'

const internalModules = new Set(['@algorithm.ts/constant'])

export default async function rollupConfig() {
  const { default: manifest } = await import(path.resolve('package.json'), {
    assert: { type: 'json' },
  })
  const tsBuilder = tsPresetConfigBuilder({
    typescriptOptions: {
      tsconfig: 'tsconfig.src.json',
    },
  })

  const config = await createRollupConfig({
    manifest,
    env: {
      sourcemap: false,
    },
    presetConfigBuilders: [
      {
        name: tsBuilder.name,
        build: async ctx => {
          const config = await tsBuilder.build(ctx)
          return {
            ...config,
            external: (id) => {
              if (internalModules.has(id)) return false
              return config.external(id)
            }
          }
        }
      }
    ],
  })
  return config
}
