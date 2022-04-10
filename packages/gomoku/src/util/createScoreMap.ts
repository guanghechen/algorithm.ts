import type { IShapeCountScore, IShapeScoreMap } from '../types'

export const createScoreMap = (MAX_ADJACENT: number): IShapeScoreMap => {
  const con: IShapeCountScore = new Array(MAX_ADJACENT + 1).fill([]).map(() => [0, 0, 0])
  const gap: IShapeCountScore = new Array(MAX_ADJACENT + 1).fill([]).map(() => [0, 0, 0])

  let uintValue = 16
  const COST_OF_GAP = uintValue * 2
  for (let cnt = 1; cnt < MAX_ADJACENT; ++cnt, uintValue *= 16) {
    con[cnt] = [0, uintValue, uintValue * 2]
    gap[cnt] = [0, uintValue / 2 - COST_OF_GAP, uintValue - COST_OF_GAP]
  }

  const _v: number = con[MAX_ADJACENT - 1][1]
  gap[MAX_ADJACENT - 1] = [_v - COST_OF_GAP, _v - COST_OF_GAP / 2, _v - COST_OF_GAP / 4]
  gap[MAX_ADJACENT] = [_v - COST_OF_GAP, _v - COST_OF_GAP / 2, _v - COST_OF_GAP / 4]
  con[MAX_ADJACENT] = [uintValue, uintValue, uintValue]
  return { con, gap }
}
