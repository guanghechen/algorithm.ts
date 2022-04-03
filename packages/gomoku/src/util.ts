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

export const createScoreMap = (MAX_ADJACENT: number): IScoreMap => {
  const gap: IShapeCount[] = new Array(MAX_ADJACENT + 1).fill([]).map(() => [0, 0, 0])
  const con: IShapeCount[] = new Array(MAX_ADJACENT + 1).fill([]).map(() => [0, 0, 0])

  const BASE_VALUE = 2
  let baseValue = BASE_VALUE
  for (let cnt = 1; cnt < MAX_ADJACENT; ++cnt) {
    gap[cnt] = [0, baseValue - BASE_VALUE, baseValue * 2 - BASE_VALUE]
    con[cnt] = [0, baseValue * 2, baseValue * 4]
    baseValue *= 8
  }

  const _v: number = con[MAX_ADJACENT - 1][1]
  gap[MAX_ADJACENT] = [_v, _v, _v]
  con[MAX_ADJACENT] = [baseValue, baseValue, baseValue]
  return { con, gap }
}
