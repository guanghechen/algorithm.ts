import type { IScoreMap, IShapeCount } from './types'

export const createScoreMap = (MAX_INLINE: number): IScoreMap => {
  const continuously: IShapeCount[] = new Array(MAX_INLINE + 1).fill([]).map(() => [0, 0, 0])
  const gap: IShapeCount[] = new Array(MAX_INLINE + 1).fill([]).map(() => [0, 0, 0])

  let maxValue: number = 2 ** 30
  const QUARTER_OF_MAX_VALUE: number = maxValue / 4

  let cnt = MAX_INLINE
  continuously[cnt] = [maxValue, maxValue, maxValue]
  gap[cnt] = [QUARTER_OF_MAX_VALUE, QUARTER_OF_MAX_VALUE, QUARTER_OF_MAX_VALUE]

  if (MAX_INLINE > 1) {
    cnt -= 1
    continuously[cnt] = [0, QUARTER_OF_MAX_VALUE, maxValue / 2]
    gap[cnt] = [QUARTER_OF_MAX_VALUE, QUARTER_OF_MAX_VALUE, QUARTER_OF_MAX_VALUE]
  }

  maxValue /= 8
  for (; cnt > 0; --cnt, maxValue /= 8) {
    continuously[cnt] = [0, maxValue / 4, maxValue / 2]
    gap[cnt] = [0, maxValue / 8, maxValue / 4]
  }
  return { continuously, gap }
}
