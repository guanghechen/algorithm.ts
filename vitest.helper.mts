import type { Reporter } from '@guanghechen/reporter'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import url from 'node:url'
import { expect, vi } from 'vitest'
import type { MockInstance } from 'vitest'

// ============================================================================
// Inline utilities from @guanghechen/std to avoid import/no-extraneous-dependencies
// ============================================================================

const identity = <T,>(data: T): T => data
const isArray = (v: unknown): v is unknown[] => Array.isArray(v)
const isNumber = (v: unknown): v is number =>
  Object.prototype.toString.call(v) === '[object Number]'
const isObject = (v: unknown): v is object =>
  Object.prototype.toString.call(v) === '[object Object]'
const isString = (v: unknown): v is string =>
  Object.prototype.toString.call(v) === '[object String]'

// ============================================================================
// Desensitizer utilities (ported from @guanghechen/helper-jest)
// ============================================================================

export type IDesensitizer<T> = (data: T, key?: string) => T

interface IJsonDesensitizerOptions {
  fallback?: IDesensitizer<unknown>
  string?: IDesensitizer<string>
  number?: IDesensitizer<number>
  error?: IDesensitizer<Error>
}

export function createJsonDesensitizer(
  valDesensitizers: IJsonDesensitizerOptions = {},
  keyDesensitizer?: IDesensitizer<string>,
): IDesensitizer<unknown> {
  const fallback = valDesensitizers.fallback == null ? identity : valDesensitizers.fallback
  const desensitizers = {
    key: keyDesensitizer == null ? identity : keyDesensitizer,
    string: valDesensitizers.string == null ? fallback : valDesensitizers.string,
    number: valDesensitizers.number == null ? fallback : valDesensitizers.number,
    error: valDesensitizers.error == null ? fallback : valDesensitizers.error,
    fallback,
  }
  const desensitize = (json: unknown, key?: string): unknown => {
    if (isString(json)) return desensitizers.string(json, key) as string
    if (isNumber(json)) return desensitizers.number(json, key) as number
    if (json instanceof Error) return desensitizers.error(json, key) as Error
    if (isArray(json)) {
      return json.map((value, index) => desensitize(value, '' + index))
    }
    if (isObject(json)) {
      const results: Record<string, unknown> = {}
      for (const _key of Object.keys(json)) {
        const k = desensitizers.key(_key) as string
        results[k] = desensitize((json as Record<string, unknown>)[_key], _key)
      }
      return results
    }
    return desensitizers.fallback(json)
  }
  return desensitize
}

export function createFilepathDesensitizer(
  baseDir: string,
  replaceString = '<WORKSPACE>',
): IDesensitizer<string> {
  const source = baseDir
    .replace(/[\\/]*$/, '')
    .replace(/[/\\]+/g, '/')
    .replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1')
    .replace(/\\\//g, '[\\\\|/]')
  const regex = new RegExp(source, 'g')
  return (text: string) => text.replace(regex, replaceString)
}

export function composeStringDesensitizers(
  ...desensitizers: IDesensitizer<string>[]
): IDesensitizer<string> {
  return (text: string, key?: string): string => {
    let result = text
    for (const desensitize of desensitizers) {
      result = desensitize(result, key)
    }
    return result
  }
}

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
export const workspaceRootDir = __dirname

/**
 * Desensitize test data.
 */
export const desensitize: IDesensitizer<any> & IDesensitizer<string> = createJsonDesensitizer({
  string: composeStringDesensitizers(
    createFilepathDesensitizer(workspaceRootDir, '<$WORKSPACE$>'),
    text => text.replace(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/, '<$Date$>'),
    text => text.replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/, '<$ISO-Date$>'),
  ),
}) as IDesensitizer<any>

/**
 * Locate fixture filepath.
 * @param p
 * @returns
 */
export const locateFixtures = (...p: string[]): string => {
  const relativePackagePath: string = path
    .relative(workspaceRootDir, path.resolve())
    .split(path.sep)
    .slice(0, 2)
    .join(path.sep)
  const testRootDior: string = path.resolve(workspaceRootDir, relativePackagePath)
  return path.resolve(testRootDior, '__test__/fixtures', ...p)
}

/**
 * Load fixture filepath.
 * @param p
 * @returns
 */
export const loadFixtures = (...p: string[]): string =>
  fs.readFileSync(locateFixtures(...p), 'utf-8')

// ============================================================================
// File system utilities (ported from @guanghechen/fs)
// ============================================================================

/**
 * Remove all files under the given directory path.
 * @param dirpath
 * @param createIfNotExist
 */
export async function emptyDir(dirpath: string, createIfNotExist = true): Promise<void> {
  if (fs.existsSync(dirpath)) {
    if (!fs.statSync(dirpath).isDirectory()) {
      throw new Error(`[emptyDir] not a directory. (${dirpath})`)
    }
    await rm(dirpath)
    await fsp.mkdir(dirpath, { recursive: true })
  } else {
    if (createIfNotExist) await fsp.mkdir(dirpath, { recursive: true })
  }
}

/**
 * Create a path of directories.
 * @param filepath  the give file path
 * @param isDir     Whether the given path is a directory
 */
export function mkdirsIfNotExists(filepath: string, isDir: boolean): void {
  const dirpath = isDir ? filepath : path.dirname(filepath)
  if (fs.existsSync(dirpath)) return
  fs.mkdirSync(dirpath, { recursive: true })
}

/**
 * Remove filepath/dirpath recursively.
 * @param fileOrDirPath
 */
export async function rm(fileOrDirPath: string): Promise<void> {
  if (fs.existsSync(fileOrDirPath)) {
    await fsp.rm(fileOrDirPath, { recursive: true, force: true })
  }
}

/**
 * Check whether if the filepath is a file path. (synchronizing)
 * @param filepath   file path
 */
export function isFileSync(filepath: string | null): boolean {
  if (filepath == null) return false
  if (!fs.existsSync(filepath)) return false
  return fs.statSync(filepath).isFile()
}

/**
 * If the path is not existed, created before write.
 * @param filepath
 * @param content
 * @param options
 */
export async function writeFile(
  filepath: string,
  content: string | NodeJS.ArrayBufferView,
  options?: fs.WriteFileOptions,
): Promise<void> {
  const dirpath = path.dirname(filepath)
  await fsp.mkdir(dirpath, { recursive: true })
  await fsp.writeFile(filepath, content, options)
}

/**
 * Remove filepaths
 * @param filepaths
 */
export const unlinkSync = (...filepaths: (string | null | undefined | string[])[]): void => {
  for (let filepath of filepaths) {
    if (filepath == null) continue
    if (!Array.isArray(filepath)) filepath = [filepath]
    for (const p of filepath) if (fs.existsSync(p)) fs.unlinkSync(p)
  }
}

export const assertPromiseThrow = async (
  fn: () => Promise<unknown>,
  errorPattern: string | RegExp,
): Promise<void> => {
  await expect(() => fn()).rejects.toThrow(errorPattern)
}

export const assertPromiseNotThrow = async (fn: () => Promise<unknown>): Promise<void> => {
  await expect(fn().then(() => undefined)).resolves.toBeUndefined()
}

export type IConsoleMethodField = 'debug' | 'log' | 'info' | 'warn' | 'error'

export interface IConsoleMock {
  get(methodName: IConsoleMethodField): readonly (readonly unknown[])[]
  getIndiscriminateAll(): readonly (readonly unknown[])[]
  reset(): void
  restore(): void
}

export function createConsoleMock(
  methodNames: readonly IConsoleMethodField[] = ['debug', 'log', 'info', 'warn', 'error'],
  desensitizeFn?: (args: unknown[]) => unknown[],
): IConsoleMock {
  const mockFnMap: Record<string, MockInstance> = {}
  const callsMap: Record<string, unknown[][]> = {}
  const allCalls: unknown[][] = []

  for (const field of methodNames) {
    callsMap[field] = []
    mockFnMap[field] = vi.spyOn(console, field).mockImplementation((...args: unknown[]) => {
      const processedArgs = desensitizeFn ? desensitizeFn(args) : args
      callsMap[field].push(processedArgs)
      allCalls.push(processedArgs)
    })
  }

  return {
    get(methodName: IConsoleMethodField): readonly (readonly unknown[])[] {
      return callsMap[methodName] ?? []
    },
    getIndiscriminateAll(): readonly (readonly unknown[])[] {
      return allCalls
    },
    reset(): void {
      for (const field of methodNames) {
        callsMap[field] = []
      }
      allCalls.length = 0
    },
    restore(): void {
      for (const mock of Object.values(mockFnMap)) {
        mock.mockRestore()
      }
    },
  }
}

export interface ICreateReporterMockOptions {
  reporter: Reporter
  desensitize?(args: readonly unknown[]): unknown[]
}

export interface IReporterMock {
  getIndiscriminateAll(): readonly (readonly unknown[])[]
  reset(): void
  restore(): void
}

export function createReporterMock(options: ICreateReporterMockOptions): IReporterMock {
  const { reporter, desensitize: desensitizeFn } = options
  const allCalls: unknown[][] = []

  // Enable mock mode on reporter to capture logs
  reporter.mock()

  return {
    getIndiscriminateAll(): readonly (readonly unknown[])[] {
      const entries = reporter.collect()
      reporter.mock() // Re-enable mock mode after collect
      for (const entry of entries) {
        const args = desensitizeFn ? desensitizeFn(entry.args) : entry.args
        allCalls.push(args)
      }
      return allCalls.slice()
    },
    reset(): void {
      reporter.collect() // Clear by collecting
      reporter.mock() // Re-enable mock mode
      allCalls.length = 0
    },
    restore(): void {
      reporter.collect() // Exit mock mode
    },
  }
}
