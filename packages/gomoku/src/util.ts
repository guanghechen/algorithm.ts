import type { IScoreMap, IShapeCount } from './types'

export const createScoreMap = (MAX_INLINE: number): IScoreMap => {
  const continuously: IShapeCount[] = new Array(MAX_INLINE + 1).fill([]).map(() => [0, 0, 0])
  const gap: IShapeCount[] = new Array(MAX_INLINE + 1).fill([]).map(() => [0, 0, 0])

  let maxValue: number = 2 ** 30
  let cnt = MAX_INLINE
  continuously[cnt] = [maxValue, maxValue, maxValue]
  gap[cnt] = [maxValue / 4, maxValue / 4, maxValue / 4]

  if (MAX_INLINE > 1) {
    cnt -= 1
    continuously[cnt] = [0, maxValue / 4, maxValue / 2]
    gap[cnt] = [maxValue / 4, maxValue / 4, maxValue / 4]
  }

  for (maxValue /= 8; cnt >= 0; --cnt, maxValue /= 8) {
    continuously[cnt] = [0, maxValue / 2, maxValue]
    gap[cnt] = [0, maxValue / 4, maxValue / 2]
  }
  return { continuously, gap }
}
