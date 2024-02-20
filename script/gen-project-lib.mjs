import { chalk } from '@guanghechen/chalk/node'
import { Reporter, ReporterLevelEnum } from '@guanghechen/reporter'
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import { detectTestDir, genAndWriteNxProjectJson } from './nx/project.mjs'

const reporter = new Reporter(chalk, {
  baseName: 'gen-project-lib',
  level: ReporterLevelEnum.INFO,
  flights: { inline: false, colorful: true },
})

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const workspaceRoot = path.dirname(__dirname)

const projectNames = fs
  .readdirSync(path.join(workspaceRoot, 'packages'))
  .filter(d => fs.existsSync(path.join(workspaceRoot, 'packages', d, 'package.json')))

/** @type {Promise<import('./nx/project.mjs').IGenNxProjectJsonParams>[]} */
const entries = [
  ...projectNames.map(projectName => ({
    projectName,
    projectDir: 'packages/' + projectName,
    projectType: 'lib',
  })),
].map(async entry => {
  const { projectDir } = entry
  const absolutePackageDir = path.resolve(workspaceRoot, projectDir)
  const absoluteTestDir = path.join(absolutePackageDir, '__test__')
  const hasTest = await detectTestDir(absoluteTestDir)
  return {
    ...entry,
    workspaceRoot,
    entries: entry.entries ?? [
      //
      'clean',
      'build',
      'watch',
      hasTest ? 'test' : '',
    ],
  }
})

for await (const entry of entries) {
  await genAndWriteNxProjectJson(entry, reporter)
}
