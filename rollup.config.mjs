import createRollupConfig from '@guanghechen/rollup-config'
import path from 'node:path'

const internalModules = new Set(['@algorithm.ts/constant'])

export default async function rollupConfig() {
  const { default: manifest } = await import(
    path.resolve('package.json'),
    { assert: { type: 'json' } },
  )
  const configs = await createRollupConfig({
    manifest,
    pluginOptions: {
      typescriptOptions: { tsconfig: 'tsconfig.src.json' },
    },
  })

  configs.forEach(config => {
    if (config.external) {
      const external = config.external
      // eslint-disable-next-line no-param-reassign
      config.external = function (id) {
        if (internalModules.has(id)) return false
        return external(id)
      }
    }
  })
  return configs
}
