import type { ICompare } from '@algorithm.ts/internal'
import type { IDataWithIndex } from './types'

export const numberCompare: ICompare<number> = (x, y) => x - y
export const stringCompare: ICompare<string> = (x, y) => (x === y ? 0 : x < y ? -1 : 1)
export const stringOrNumberCompare: ICompare<string | number> = (x, y) =>
  x === y ? 0 : x < y ? -1 : 1

export const numberDataWithIndexCompare: ICompare<IDataWithIndex<number>> = (x, y) =>
  numberCompare(x.value, y.value)
export const stringDataWithIndexCompare: ICompare<IDataWithIndex<string>> = (x, y) =>
  stringCompare(x.value, y.value)

export const numberDataWithIndexStableCompare: ICompare<IDataWithIndex<number>> = (x, y) => {
  const delta = numberDataWithIndexCompare(x, y)
  return delta === 0 ? x.index - y.index : delta
}
export const stringDataWithIndexStableCompare: ICompare<IDataWithIndex<string>> = (x, y) => {
  const delta = stringDataWithIndexCompare(x, y)
  return delta === 0 ? x.index - y.index : delta
}
