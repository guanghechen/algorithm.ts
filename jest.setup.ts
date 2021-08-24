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
  path.resolve(testRootDior, '__test__/fixtures', ...p)

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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createReader(content: string) {
  const integerRegex = /-?\d+/g
  const lines: string[] = content.split(/\n/g)
  return { readIntegersOfLine }

  /**
   * Read integers.
   */
  function readIntegersOfLine(): number[] {
    const line = nextNonBlankLine()!
    const m = line.match(integerRegex)
    if (m == null) return []
    return m.map(x => Number(x))
  }

  /**
   * Get a blank line.
   * @returns
   */
  function nextNonBlankLine(): string | undefined {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const line = lines.shift()
      if (line === undefined) return undefined
      if (/\S/.test(line)) return line
    }
  }
}
