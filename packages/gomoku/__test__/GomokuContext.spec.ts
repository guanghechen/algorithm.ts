import {
  GomokuContext,
  GomokuDirectionType,
  gomokuDirectionTypes,
  leftHalfGomokuDirectionTypes,
  rightHalfGomokuDirectionTypes,
} from '../src'

describe('15x15', () => {
  const context = new GomokuContext(15, 15, 5)

  test('idx', () => {
    expect(context.idx(3, 3)).toEqual(48)
    expect(context.reIdx(48)).toEqual([3, 3])

    for (let i = 0; i < context.TOTAL_PLAYERS; ++i) {
      const [r, c] = context.reIdx(i)
      const id: number = context.idx(r, c)
      expect(id).toEqual(i)
    }
  })

  test('idxIfValid', () => {
    expect(context.idxIfValid(-1, 2)).toEqual(-1)
    expect(context.idxIfValid(-2, -2)).toEqual(-1)
    expect(context.idxIfValid(-2, -1)).toEqual(-1)
    expect(context.idxIfValid(-2, 0)).toEqual(-1)
    expect(context.idxIfValid(0, 0)).toEqual(0)
    expect(context.idxIfValid(1, 0)).toEqual(15)
  })

  test('move', () => {
    expect(context.move(5, 4, GomokuDirectionType.LEFT, 1)).toEqual([5, 3])
    expect(context.move(5, 4, GomokuDirectionType.LEFT, 2)).toEqual([5, 2])
    expect(context.move(5, 4, GomokuDirectionType.LEFT, -3)).toEqual([5, 7])
  })

  test('isValidPos', () => {
    expect(context.isValidPos(0, 0)).toEqual(true)
    expect(context.isValidPos(14, 14)).toEqual(true)
    expect(context.isValidPos(11, 3)).toEqual(true)
    expect(context.isValidPos(-1, 0)).toEqual(false)
    expect(context.isValidPos(0, -1)).toEqual(false)
    expect(context.isValidPos(0, 15)).toEqual(false)
    expect(context.isValidPos(15, 3)).toEqual(false)
  })

  test('visitValidNeighbors', () => {
    const collect = (r: number, c: number): unknown[] => {
      const result: unknown[] = []
      for (const item of context.validNeighbors(r, c)) result.push(item)
      return result
    }
    expect(collect(0, 0)).toEqual([
      [0, 1, GomokuDirectionType.RIGHT],
      [1, 1, GomokuDirectionType.BOTTOM_RIGHT],
      [1, 0, GomokuDirectionType.BOTTOM],
    ])

    expect(collect(7, 6)).toEqual([
      [7, 5, GomokuDirectionType.LEFT],
      [6, 5, GomokuDirectionType.TOP_LEFT],
      [6, 6, GomokuDirectionType.TOP],
      [6, 7, GomokuDirectionType.TOP_RIGHT],
      [7, 7, GomokuDirectionType.RIGHT],
      [8, 7, GomokuDirectionType.BOTTOM_RIGHT],
      [8, 6, GomokuDirectionType.BOTTOM],
      [8, 5, GomokuDirectionType.BOTTOM_LEFT],
    ])
  })

  test('traverseAllDirections', () => {
    const collect = (): unknown[] => {
      const result: unknown[] = []
      context.traverseAllDirections((...args) => void result.push(args))
      return result
    }

    const data = collect() as any[]
    expect(data.length).toEqual(context.TOTAL_POS * gomokuDirectionTypes.length)

    const countMap1: Record<number, number> = {}
    const countMap2: Record<GomokuDirectionType, number> = {} as any
    for (const [r, c, dirType] of data) {
      const id: number = context.idx(r, c)
      countMap1[id] = (countMap1[id] ?? 0) + 1
      countMap2[dirType] = (countMap2[dirType] ?? 0) + 1
    }

    expect(gomokuDirectionTypes.every(dirType => countMap2[dirType] === context.TOTAL_POS)).toEqual(
      true,
    )
    expect(
      new Array(context.TOTAL_POS)
        .fill(0)
        .every((_v, idx) => countMap1[idx] === gomokuDirectionTypes.length),
    ).toEqual(true)
  })

  test('traverseLeftDirections', () => {
    const collect = (): unknown[] => {
      const result: unknown[] = []
      context.traverseLeftDirections((...args) => void result.push(args))
      return result
    }

    const data = collect() as any[]
    expect(data.length).toEqual(context.TOTAL_POS * leftHalfGomokuDirectionTypes.length)

    const countMap1: Record<number, number> = {}
    const countMap2: Record<GomokuDirectionType, number> = {} as any
    for (const [r, c, dirType] of data) {
      const id: number = context.idx(r, c)
      countMap1[id] = (countMap1[id] ?? 0) + 1
      countMap2[dirType] = (countMap2[dirType] ?? 0) + 1
    }

    expect(
      leftHalfGomokuDirectionTypes.every(dirType => countMap2[dirType] === context.TOTAL_POS),
    ).toEqual(true)
    expect(
      new Array(context.TOTAL_POS)
        .fill(0)
        .every((_v, idx) => countMap1[idx] === leftHalfGomokuDirectionTypes.length),
    ).toEqual(true)
  })

  test('traverseRightDirections', () => {
    const collect = (): unknown[] => {
      const result: unknown[] = []
      context.traverseRightDirections((...args) => void result.push(args))
      return result
    }

    const data = collect() as any[]
    expect(data.length).toEqual(context.TOTAL_POS * rightHalfGomokuDirectionTypes.length)

    const countMap1: Record<number, number> = {}
    const countMap2: Record<GomokuDirectionType, number> = {} as any
    for (const [r, c, dirType] of data) {
      const id: number = context.idx(r, c)
      countMap1[id] = (countMap1[id] ?? 0) + 1
      countMap2[dirType] = (countMap2[dirType] ?? 0) + 1
    }

    expect(
      rightHalfGomokuDirectionTypes.every(dirType => countMap2[dirType] === context.TOTAL_POS),
    ).toEqual(true)
    expect(
      new Array(context.TOTAL_POS)
        .fill(0)
        .every((_v, idx) => countMap1[idx] === rightHalfGomokuDirectionTypes.length),
    ).toEqual(true)
  })
})
