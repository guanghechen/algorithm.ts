import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

export enum PieceDataDirName {
  d15x15 = '15x15',
}

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const FIXTURE_DIR = path.join(__dirname, 'fixtures')
export const locateFixtures = (...p: string[]): string => path.resolve(FIXTURE_DIR, ...p)

export const locatePieceDataFilepaths = (
  dirName: PieceDataDirName,
): Array<{ filepath: string; title: string }> =>
  fs
    .readdirSync(locateFixtures(dirName))
    .filter(filename => /pieces\.\d+?\.json$/.test(filename))
    .map(filename => locateFixtures('15x15', filename))
    .filter(filepath => fs.statSync(filepath).isFile())
    .map(filepath => ({ filepath, title: path.parse(filepath).name }))

export const stringify = (data: unknown): string => JSON.stringify(data)
