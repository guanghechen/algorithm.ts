import type { IShapeCountScore, IShapeScoreMap } from './types'

// const baseScoreMap: IShapeScoreMap = {
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

export const createScoreMap = (MAX_ADJACENT: number): IShapeScoreMap => {
  const con: IShapeCountScore = new Array(MAX_ADJACENT + 1).fill([]).map(() => [0, 0, 0])
  const gap: IShapeCountScore = new Array(MAX_ADJACENT + 1).fill([]).map(() => [0, 0, 0])

  let BASE_VALUE = 2
  for (let cnt = 1; cnt < MAX_ADJACENT; ++cnt, BASE_VALUE *= 16) {
    con[cnt] = [0, BASE_VALUE, BASE_VALUE * 2]
    con[cnt] = [0, BASE_VALUE / 2, BASE_VALUE]
  }

  const _v: number = con[MAX_ADJACENT - 1][1]
  gap[MAX_ADJACENT - 1] = [_v, _v, _v]
  con[MAX_ADJACENT] = [_v, _v, _v]
  con[MAX_ADJACENT] = [BASE_VALUE, BASE_VALUE, BASE_VALUE]
  return { con, gap }
}
