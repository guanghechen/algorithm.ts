import { lcs_dp, lcs_myers, lcs_myers_linear_space } from '@algorithm.ts/lcs'

type IEquals = (x: number, y: number) => boolean

export enum DiffType {
  ADDED = 'added',
  REMOVED = 'removed',
  COMMON = 'common',
}

export interface IDiffItem<T extends string | unknown[]> {
  type: DiffType
  tokens: T
}

export type ILcs = (
  N1: number,
  N2: number,
  equals: (x: number, y: number) => boolean,
) => Array<[number, number]>
export type ILcsAlgorithm = 'myers' | 'myers_linear_space' | 'dp' | ILcs

export interface IDiffOptions<T> {
  equals?: (x: T, y: T) => boolean
  lcs?: ILcsAlgorithm
}

export function diff<T extends string | unknown[]>(
  a: T,
  b: T,
  options: IDiffOptions<T[number]> = {},
): Array<IDiffItem<T>> {
  const N1: number = a.length
  const N2: number = b.length

  const originalEquals = options?.equals
  const equals: IEquals = originalEquals
    ? (x: number, y: number): boolean => originalEquals(a[x], b[y])
    : (x: number, y: number): boolean => a[x] === b[y]

  const lcs: ILcsAlgorithm = options?.lcs ?? 'myers_linear_space'
  const points: ReadonlyArray<[number, number]> = calcMatchPoints(N1, N2, equals, lcs)
  const answers: Array<IDiffItem<T>> = []

  let x: number = 0
  let y: number = 0
  for (let i = 0, j: number; i < points.length; i = j) {
    const [u, v] = points[i]
    if (x < u) answers.push({ type: DiffType.REMOVED, tokens: a.slice(x, u) as T })
    if (y < v) answers.push({ type: DiffType.ADDED, tokens: b.slice(y, v) as T })

    x = u + 1
    y = v + 1
    for (j = i + 1; j < points.length; ++j, ++x, ++y) {
      if (points[j][0] !== x || points[j][1] !== y) break
    }
    answers.push({ type: DiffType.COMMON, tokens: a.slice(u, x) as T })
  }

  if (x < N1) answers.push({ type: DiffType.REMOVED, tokens: a.slice(x, N1) as T })
  if (y < N2) answers.push({ type: DiffType.ADDED, tokens: b.slice(y, N2) as T })
  return answers
}

function calcMatchPoints(
  N1: number,
  N2: number,
  equals: IEquals,
  lcs: ILcsAlgorithm,
): ReadonlyArray<[number, number]> {
  switch (lcs) {
    case 'myers':
      return lcs_myers(N1, N2, equals)
    case 'myers_linear_space':
      return lcs_myers_linear_space(N1, N2, equals)
    case 'dp':
      return lcs_dp(N1, N2, equals)
    default:
      return lcs(N1, N2, equals)
  }
}
