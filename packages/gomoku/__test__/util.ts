import fs from 'fs-extra'
import { locateFixtures } from 'jest.setup'
import path from 'path'

export enum PieceDataDirName {
  d15x15 = '15x15',
}

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
