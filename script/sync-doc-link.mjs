#!/usr/bin/env node

/**
 * Sync documentation links in README.md and package.json files.
 *
 * This script updates version-specific GitHub links to match the current package version.
 * It handles:
 *   - README.md: Updates links like github.com/.../tree/@pkg@x.y.z/...
 *   - package.json: Updates repository.url and homepage fields
 */

import fs from 'node:fs/promises'
import path from 'node:path'

const ROOT_DIR = path.resolve(import.meta.dirname, '..')
const PACKAGES_DIR = path.join(ROOT_DIR, 'packages')

// Semver pattern: x.y.z or x.y.z-prerelease or x.y.z-prerelease+build
const SEMVER = String.raw`\d+\.\d+\.\d+(?:-[\w.-]+)?(?:\+[\w.-]+)?`

// Only match GitHub URLs containing version tags
// e.g., github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/base64@4.0.3/...
const GITHUB_URL_PATTERN = new RegExp(
  String.raw`(github\.com/guanghechen/algorithm\.ts/tree/)(@[\w.-]+/[\w.-]+@)(${SEMVER})`,
  'g',
)

async function getPackages() {
  const entries = await fs.readdir(PACKAGES_DIR, { withFileTypes: true })
  const packages = []

  for (const entry of entries) {
    if (!entry.isDirectory()) continue

    const pkgJsonPath = path.join(PACKAGES_DIR, entry.name, 'package.json')
    try {
      const content = await fs.readFile(pkgJsonPath, 'utf8')
      const pkg = JSON.parse(content)
      packages.push({
        dir: entry.name,
        name: pkg.name,
        version: pkg.version,
      })
    } catch (err) {
      const error = err
      console.warn(`  Warning: Failed to read ${pkgJsonPath}: ${error.message}`)
    }
  }

  return packages
}

function createVersionMap(packages) {
  const map = new Map()
  for (const pkg of packages) {
    map.set(pkg.name, pkg.version)
  }
  return map
}

function updateContent(content, versionMap) {
  return content.replace(GITHUB_URL_PATTERN, (match, prefix, pkgWithAt) => {
    // pkgWithAt is like "@algorithm.ts/base64@", extract package name.
    const pkgName = pkgWithAt.slice(0, -1)
    const newVersion = versionMap.get(pkgName)
    if (newVersion) {
      return `${prefix}${pkgWithAt}${newVersion}`
    }
    return match
  })
}

async function updateFile(filepath, versionMap) {
  try {
    const content = await fs.readFile(filepath, 'utf8')
    const updated = updateContent(content, versionMap)

    if (content !== updated) {
      await fs.writeFile(filepath, updated, 'utf8')
      console.log(`  Updated: ${path.relative(ROOT_DIR, filepath)}`)
      return true
    }
    return false
  } catch (err) {
    const error = err
    if (error.code !== 'ENOENT') {
      console.warn(`  Warning: Failed to update ${filepath}: ${error.message}`)
    }
    return false
  }
}

console.log('Syncing documentation links...\n')

const packages = await getPackages()
const versionMap = createVersionMap(packages)

let updatedCount = 0

for (const pkg of packages) {
  const pkgDir = path.join(PACKAGES_DIR, pkg.dir)

  // Update README.md
  const readmePath = path.join(pkgDir, 'README.md')
  if (await updateFile(readmePath, versionMap)) updatedCount += 1

  // Update package.json
  const pkgJsonPath = path.join(pkgDir, 'package.json')
  if (await updateFile(pkgJsonPath, versionMap)) updatedCount += 1
}

console.log(`\nDone. Updated ${updatedCount} file(s).`)
