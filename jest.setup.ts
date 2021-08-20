import fs from 'fs-extra'
import path from 'path'

export const workspaceRootDir = __dirname
export const testRootDior = path.resolve()

/**
 * Locate fixture filepath.
 * @param p
 * @returns
 */
export const locateFixtures = (...p: string[]): string =>
  path.join(testRootDior, '__test__/fixtures', ...p)

/**
 * Load fixture filepath.
 * @param p
 * @returns
 */
export const loadFixtures = (...p: string[]): string =>
  fs.readFileSync(locateFixtures(...p), 'utf-8')

/**
 * Remove filepaths
 * @param filepaths
 */
export const unlinkSync = (
  ...filepaths: Array<string | null | undefined | string[]>
): void => {
  for (let filepath of filepaths) {
    if (filepath == null) continue
    if (!Array.isArray(filepath)) filepath = [filepath]
    for (const p of filepath) if (fs.existsSync(p)) fs.unlinkSync(p)
  }
}

/**
 * Create a sequence of integers in the range [start, end).
 * @param start
 * @param end
 * @returns
 */
export function range(start: number, end: number): number[] {
  const _size = end - start
  const nums: number[] = new Array(_size)
  for (let i = 0; i < end; ++i) nums[i] = start + i
  return nums
}

/**
 * Create a random integer.
 * @param max
 * @returns
 */
export const randomInt = (max: number): number => Math.ceil(Math.random() * max)
