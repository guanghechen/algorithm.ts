import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const packagesDir = path.join(root, 'packages')
const expectSourcemap = !process.argv.includes('--production')
const consumerDir = fs.mkdtempSync(path.join(tmpdir(), 'algorithm-dist-'))

try {
  const packages = []
  for (const name of fs.readdirSync(packagesDir)) {
    const packageDir = path.join(packagesDir, name)
    const manifest = JSON.parse(fs.readFileSync(path.join(packageDir, 'package.json'), 'utf8'))
    if (manifest.private) continue

    for (const file of [manifest.module, manifest.main, manifest.types]) {
      const filepath = path.resolve(packageDir, file)
      assert.ok(fs.existsSync(filepath), `${manifest.name}: missing ${file}`)
      // The type-only package has no runtime source to map.
      const needsMap =
        file !== manifest.types && expectSourcemap && manifest.name !== '@algorithm.ts/graph.types'
      assert.equal(
        fs.existsSync(`${filepath}.map`),
        needsMap,
        `${manifest.name}: ${file} sourcemap`,
      )
      assert.equal(
        /sourceMappingURL=/.test(fs.readFileSync(filepath, 'utf8')),
        needsMap,
        `${manifest.name}: ${file} sourcemap reference`,
      )
      if (needsMap) {
        const map = JSON.parse(fs.readFileSync(`${filepath}.map`, 'utf8'))
        assert.equal(map.version, 3)
        assert.ok(Array.isArray(map.sources))
      }
    }

    // Resolve from an isolated published layout, without workspace source aliases or private packages.
    const installedDir = path.join(consumerDir, 'node_modules', manifest.name)
    fs.mkdirSync(installedDir, { recursive: true })
    fs.cpSync(path.join(packageDir, 'lib'), path.join(installedDir, 'lib'), { recursive: true })
    fs.writeFileSync(path.join(installedDir, 'package.json'), JSON.stringify(manifest))
    packages.push({ manifest, installedDir })
  }

  const require = createRequire(path.join(consumerDir, 'consumer.cjs'))
  const imports = []
  for (const [index, { manifest, installedDir }] of packages.entries()) {
    const esm = await import(pathToFileURL(path.resolve(installedDir, manifest.module)).href)
    const cjs = require(manifest.name)
    const exportedNames = Object.keys(esm).sort()
    if (manifest.name !== '@algorithm.ts/graph.types') {
      assert.ok(exportedNames.length > 0, `${manifest.name}: missing runtime exports`)
    }
    assert.deepEqual(
      Object.keys(cjs)
        .filter(key => key !== '__esModule')
        .sort(),
      exportedNames,
      `${manifest.name}: ESM and CJS exports must agree`,
    )
    const bindings = exportedNames.map(name => `${name} as package${index}_${name}`)
    imports.push(`export { ${bindings.join(', ')} } from '${manifest.name}'`)

    if (manifest.name === '@algorithm.ts/gcd') {
      for (const module of [esm, cjs]) assert.equal(module.gcd(84, 30), 6)
    }
    if (manifest.name === '@algorithm.ts/sudoku') {
      for (const module of [esm, cjs]) {
        assert.equal(module.SudokuConstraint.SLOT, 0)
        assert.equal(module.SudokuConstraint.ROW, 1)
        assert.equal(module.SudokuConstraint.COL, 2)
        assert.equal(module.SudokuConstraint.SUB, 3)
      }
    }
    if (manifest.name === '@algorithm.ts/queue') {
      for (const module of [esm, cjs]) {
        const queue = new module.PriorityQueue({ compare: (x, y) => x - y })
        queue.enqueue(3)
        queue.enqueue(1)
        assert.equal(queue.dequeue(), 1)
      }
    }
  }

  imports.push(
    '// @ts-expect-error Bundled helper types must remain private.',
    "import type { DeepReadonly } from '@algorithm.ts/dijkstra'",
  )
  const consumerPath = path.join(consumerDir, 'consumer.mts')
  fs.writeFileSync(consumerPath, `${imports.join('\n')}\n`)
  const result = spawnSync(
    'tsc',
    ['--noEmit', '--strict', '--target', 'esnext', '--module', 'nodenext', consumerPath],
    { cwd: consumerDir, encoding: 'utf8', shell: process.platform === 'win32' },
  )
  assert.ifError(result.error)
  assert.equal(result.status, 0, `Published declarations: ${result.stdout}${result.stderr}`)
  console.log(`${packages.length} packages: ESM, CJS, declarations and sourcemaps passed`)
} finally {
  fs.rmSync(consumerDir, { recursive: true, force: true })
}
