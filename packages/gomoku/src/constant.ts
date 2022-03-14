import type { IShapeCount } from './types'

export enum GomokuDirectionType {
  LEFT = 0,
  TOP_LEFT = 2,
  TOP = 4,
  TOP_RIGHT = 6,
  RIGHT = 1,
  BOTTOM_RIGHT = 3,
  BOTTOM = 5,
  BOTTOM_LEFT = 7,
}

// Canvas x-arias direction.
// Directions in canvas coordinates.
export const gomokuDirections: Array<[dr: number, dc: number]> = Array.from(
  Object.entries({
    [GomokuDirectionType.TOP]: [-1, 0],
    [GomokuDirectionType.TOP_RIGHT]: [-1, 1],
    [GomokuDirectionType.RIGHT]: [0, 1],
    [GomokuDirectionType.BOTTOM_RIGHT]: [1, 1],
    [GomokuDirectionType.BOTTOM]: [1, 0],
    [GomokuDirectionType.BOTTOM_LEFT]: [1, -1],
    [GomokuDirectionType.LEFT]: [0, -1],
    [GomokuDirectionType.TOP_LEFT]: [-1, -1],
  }).reduce((acc, [key, value]) => {
    // eslint-disable-next-line no-param-reassign
    acc[key] = value
    return acc
  }, []),
)

export const leftHalfGomokuDirectionTypes: GomokuDirectionType[] = [
  GomokuDirectionType.LEFT,
  GomokuDirectionType.TOP_LEFT,
  GomokuDirectionType.TOP,
  GomokuDirectionType.TOP_RIGHT,
]

export const rightHalfGomokuDirectionTypes: GomokuDirectionType[] = [
  GomokuDirectionType.RIGHT,
  GomokuDirectionType.BOTTOM_RIGHT,
  GomokuDirectionType.BOTTOM,
  GomokuDirectionType.BOTTOM_LEFT,
]

export const gomokuDirectionTypes = leftHalfGomokuDirectionTypes.concat(
  rightHalfGomokuDirectionTypes,
)

export const continuouslyShapeScoreMap: IShapeCount[] = [
  [0, 0, 0], // 0
  [0, 1, 8], // 1
  [0, 2, 16], // 2
  [0, 32, 64], // 3
  [0, 520, 520], // 4
]
