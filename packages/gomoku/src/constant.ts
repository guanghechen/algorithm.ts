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
export const GomokuDirections: ReadonlyArray<[dr: number, dc: number]> = Array.from(
  Object.entries({
    [GomokuDirectionType.TOP]: [-1, 0],
    [GomokuDirectionType.TOP_RIGHT]: [-1, 1],
    [GomokuDirectionType.RIGHT]: [0, 1],
    [GomokuDirectionType.BOTTOM_RIGHT]: [1, 1],
    [GomokuDirectionType.BOTTOM]: [1, 0],
    [GomokuDirectionType.BOTTOM_LEFT]: [1, -1],
    [GomokuDirectionType.LEFT]: [0, -1],
    [GomokuDirectionType.TOP_LEFT]: [-1, -1],
  }).reduce(
    (acc, [key, value]) => {
      const index = Number(key)
      // eslint-disable-next-line no-param-reassign
      acc[index] = value as [dr: number, dc: number]
      return acc
    },
    [] as Array<[dr: number, dc: number]>,
  ),
)

export const GomokuDirectionTypes = {
  full: [
    GomokuDirectionType.LEFT,
    GomokuDirectionType.TOP_LEFT,
    GomokuDirectionType.TOP,
    GomokuDirectionType.TOP_RIGHT,
    GomokuDirectionType.RIGHT,
    GomokuDirectionType.BOTTOM_RIGHT,
    GomokuDirectionType.BOTTOM,
    GomokuDirectionType.BOTTOM_LEFT,
  ] as ReadonlyArray<GomokuDirectionType>,
  leftHalf: [
    GomokuDirectionType.LEFT,
    GomokuDirectionType.TOP_LEFT,
    GomokuDirectionType.TOP,
    GomokuDirectionType.TOP_RIGHT,
  ] as ReadonlyArray<GomokuDirectionType>,
  rightHalf: [
    GomokuDirectionType.RIGHT,
    GomokuDirectionType.BOTTOM_RIGHT,
    GomokuDirectionType.BOTTOM,
    GomokuDirectionType.BOTTOM_LEFT,
  ] as ReadonlyArray<GomokuDirectionType>,
}

export const GomokuDirectionTypeBitset = {
  full: GomokuDirectionTypes.full.reduce((acc, dirType) => acc | (1 << dirType), 0),
  leftHalf: GomokuDirectionTypes.leftHalf.reduce((acc, dirType) => acc | (1 << dirType), 0),
  rightHalf: GomokuDirectionTypes.rightHalf.reduce((acc, dirType) => acc | (1 << dirType), 0),
}
