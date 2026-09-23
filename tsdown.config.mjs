import { builtinModules } from 'node:module'
import path from 'node:path'
import { defineConfig } from 'tsdown'

const { default: manifest } = await import(path.resolve('package.json'), {
  with: { type: 'json' },
})

const dependencies = new Set([
  ...builtinModules,
  ...builtinModules.map(name => `node:${name}`),
  ...Object.keys(manifest.dependencies ?? {}),
  ...Object.keys(manifest.peerDependencies ?? {}),
  ...Object.keys(manifest.optionalDependencies ?? {}),
])

const neverBundle = id => {
  const name = /^(@[^/]+\/[^/]+|[^/]+)/.exec(id)?.[1]
  return dependencies.has(name)
}

const common = {
  cwd: process.cwd(),
  entry: { index: manifest.source },
  tsconfig: 'tsconfig.lib.json',
  target: 'esnext',
  platform: 'neutral',
  deps: { neverBundle, alwaysBundle: ['@algorithm.ts/internal'], onlyBundle: [] },
  clean: true,
  exports: false,
}

export default defineConfig([
  ...[
    ['esm', manifest.module],
    ['cjs', manifest.main],
  ].map(([format, file]) => ({
    ...common,
    format,
    outDir: path.dirname(file),
    outExtensions: () => ({ js: path.extname(file) }),
    sourcemap: process.env.BUILD_SOURCEMAP === 'true',
    cjsDefault: false,
    dts: false,
    inputOptions: {
      transform: { typescript: { optimizeConstEnums: true } },
    },
    outputOptions: {
      exports: 'named',
      comments: process.env.NODE_ENV !== 'production',
    },
  })),
  {
    ...common,
    format: 'esm',
    outDir: path.dirname(manifest.types),
    outExtensions: () => ({ dts: '.d.ts' }),
    sourcemap: false,
    // Keep non-exported helper types private in declaration files.
    footer: { dts: 'export {};' },
    dts: {
      generator: 'tsgo',
      emitDtsOnly: true,
      sourcemap: false,
      compilerOptions: { declarationMap: false },
    },
  },
])
