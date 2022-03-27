import type { IScoreMap, IShapeCount } from './types'

// const baseScoreMap: IScoreMap = {
//   continuously: [
//     [0, 0, 0], // 0
//     [0, 1, 2], // 1
//     [0, 4, 8], // 2
//     [0, 16, 32], // 3
//     [0, 64, 128], // 4
//     [1024, 1024, 1024], // 5
//   ] ,
//   gap: [
//     [0, 0, 0],
//     [0, 0, 0],
//     [0, 2, 4],
//     [0, 8, 16],
//     [64, 64, 64],
//     [64, 64, 64],
//   ]
// }

export const createScoreMap = (TOTAL_POS: number, MAX_INLINE: number): IScoreMap => {
  const gap: IShapeCount[] = new Array(MAX_INLINE + 1).fill([]).map(() => [0, 0, 0])
  const con: IShapeCount[] = new Array(MAX_INLINE + 1).fill([]).map(() => [0, 0, 0])

  let baseValue = 2
  for (let cnt = 1; cnt < MAX_INLINE; ++cnt) {
    gap[cnt] = [0, baseValue / 2, baseValue]
    con[cnt] = [0, baseValue, baseValue * 2]
    const scale: number = Math.min(4, Math.round((TOTAL_POS / cnt) * cnt))
    baseValue *= scale
  }

  const _v: number = con[MAX_INLINE - 1][1]
  gap[MAX_INLINE - 1] = [_v, _v, _v]
  gap[MAX_INLINE] = [_v, _v, _v]
  con[MAX_INLINE] = [baseValue, baseValue, baseValue]
  return { con: con, gap }
}
