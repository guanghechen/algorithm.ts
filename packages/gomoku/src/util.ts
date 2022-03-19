import type { IScoreMap, IShapeCount } from './types'

export const createScoreMap = (MAX_INLINE: number, MAX_POSSIBLE_INLINE: number): IScoreMap => {
  const continuously: IShapeCount[] = new Array(MAX_POSSIBLE_INLINE + 1)
    .fill([])
    .map(() => [0, 0, 0])
  const gap: IShapeCount[] = new Array(MAX_POSSIBLE_INLINE + 1).fill([]).map(() => [0, 0, 0])

  let maxValue: number = 2 ** 30
  const QUARTER_OF_MAX_VALUE: number = maxValue / 4
  for (let cnt = MAX_INLINE; cnt <= MAX_POSSIBLE_INLINE; ++cnt) {
    continuously[cnt] = [maxValue, maxValue, maxValue]
    gap[cnt] = [QUARTER_OF_MAX_VALUE, QUARTER_OF_MAX_VALUE, QUARTER_OF_MAX_VALUE]
  }

  if (MAX_INLINE > 1) {
    continuously[MAX_INLINE - 1] = [0, QUARTER_OF_MAX_VALUE, maxValue / 2]
    gap[MAX_INLINE - 1] = [QUARTER_OF_MAX_VALUE, QUARTER_OF_MAX_VALUE, QUARTER_OF_MAX_VALUE]
  }

  maxValue /= 8
  for (let cnt = MAX_INLINE - 2; cnt > 0; --cnt, maxValue /= 8) {
    continuously[cnt] = [0, maxValue / 4, maxValue / 2]
    gap[cnt] = [0, maxValue / 8, maxValue / 4]
  }
  return { continuously, gap }
}
