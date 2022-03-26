import {
  GomokuContext,
  GomokuDirectionType,
  gomokuDirectionTypes,
  gomokuDirections,
  leftHalfGomokuDirectionTypes,
  rightHalfGomokuDirectionTypes,
} from '../src'

describe('15x15', () => {
  const context = new GomokuContext(15, 15, 5)

  test('idx', () => {
    for (let r = 0; r < context.MAX_ROW; ++r) {
      for (let c = 0; c < context.MAX_COL; ++c) {
        const id: number = r * context.MAX_ROW + c
        const message = `[r, c]: ${[r, c].join(', ')}`
        expect([message, context.idx(r, c)]).toEqual([message, id])
      }
    }
  })

  test('idxIfValid', () => {
    for (let r = 0; r < context.MAX_ROW; ++r) {
      for (let c = 0; c < context.MAX_COL; ++c) {
        const id: number = r * context.MAX_ROW + c
        const message = `[r, c]: ${[r, c].join(', ')}`
        expect([message, context.idxIfValid(r, c)]).toEqual([message, id])
      }
    }
    expect(context.idxIfValid(-1, 2)).toEqual(-1)
    expect(context.idxIfValid(-2, -2)).toEqual(-1)
    expect(context.idxIfValid(-2, -1)).toEqual(-1)
    expect(context.idxIfValid(-2, 0)).toEqual(-1)
    expect(context.idxIfValid(0, 0)).toEqual(0)
    expect(context.idxIfValid(1, 0)).toEqual(15)
  })

  test('revIdx', () => {
    for (let r = 0; r < context.MAX_ROW; ++r) {
      for (let c = 0; c < context.MAX_COL; ++c) {
        const id: number = r * context.MAX_ROW + c
        const message = `[id]: ${[id].join(', ')}`
        expect([message, context.revIdx(id)]).toEqual([message, [r, c]])
      }
    }
  })

  test('safeMove', () => {
    const MAX_STEPS: number = Math.max(context.MAX_ROW, context.MAX_COL)
    for (const dirType of gomokuDirectionTypes) {
      const [dr, dc] = gomokuDirections[dirType]
      for (let id = 0; id < context.TOTAL_POS; ++id) {
        const [r, c] = context.revIdx(id)
        for (let step = 0; step <= MAX_STEPS; ++step) {
          const r2: number = r + dr * step
          const c2: number = c + dc * step
          const id2: number = context.idxIfValid(r2, c2)
          const message = `[r, c, dirType, step, r2, c2]: ${[r, c, dirType, step, r2, c2].join(
            ', ',
          )}`
          expect([message, context.safeMove(id, dirType, step)]).toEqual([message, id2])
        }
      }
    }
  })

  test('safeMoveOnStep', () => {
    for (const dirType of gomokuDirectionTypes) {
      const [dr, dc] = gomokuDirections[dirType]
      for (let id = 0; id < context.TOTAL_POS; ++id) {
        const [r, c] = context.revIdx(id)
        const r2: number = r + dr
        const c2: number = c + dc
        const id2: number = context.idxIfValid(r2, c2)
        const message = `[r, c, dirType, r2, c2]: ${[r, c, dirType, r2, c2].join(', ')}`
        expect([message, context.safeMoveOneStep(id, dirType)]).toEqual([message, id2])
      }
    }
  })

  test('fastMove', () => {
    const MAX_STEPS: number = Math.max(context.MAX_ROW, context.MAX_COL)
    for (const dirType of gomokuDirectionTypes) {
      const [dr, dc] = gomokuDirections[dirType]
      for (let id = 0; id < context.TOTAL_POS; ++id) {
        const [r, c] = context.revIdx(id)
        for (let step = 0; step <= MAX_STEPS; ++step) {
          const r2: number = r + dr * step
          const c2: number = c + dc * step
          const id2: number = context.idxIfValid(r2, c2)
          if (id2 < 0) continue

          const message = `[r, c, dirType, step, r2, c2]: ${[r, c, dirType, step, r2, c2].join(
            ', ',
          )}`
          expect([message, context.fastMove(id, dirType, step)]).toEqual([message, id2])
        }
      }
    }
  })

  test('fastMoveOnStep', () => {
    for (const dirType of gomokuDirectionTypes) {
      const [dr, dc] = gomokuDirections[dirType]
      for (let id = 0; id < context.TOTAL_POS; ++id) {
        const [r, c] = context.revIdx(id)
        const r2: number = r + dr
        const c2: number = c + dc
        const id2: number = context.idxIfValid(r2, c2)
        if (id2 < 0) continue

        const message = `[r, c, dirType, r2, c2]: ${[r, c, dirType, r2, c2].join(', ')}`
        expect([message, context.fastMoveOneStep(id, dirType)]).toEqual([message, id2])
      }
    }
  })

  test('maxMove', () => {
    for (const dirType of gomokuDirectionTypes) {
      const [dr, dc] = gomokuDirections[dirType]
      for (let id = 0; id < context.TOTAL_POS; ++id) {
        const [r, c] = context.revIdx(id)
        let step = 0

        for (let r2 = r, c2 = c; ; ++step, r2 += dr, c2 += dc) {
          if (context.isInvalidPos(r2 + dr, c2 + dc)) break
        }

        const message = `[r, c, dirType, step]: ${[r, c, dirType, step].join(', ')}`
        {
          let r2: number = r + dr * step
          let c2: number = c + dc * step
          expect([message, context.isValidPos(r2, c2)]).toEqual([message, true])

          r2 += dr
          c2 += dc
          expect([message, context.isInvalidPos(r2, c2)]).toEqual([message, true])
        }

        expect([message, context.maxMovableSteps(id, dirType)]).toEqual([message, step])
      }
    }
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
      const id: number = context.idx(r, c)
      for (const [id2, dirType] of context.validNeighbors(id)) {
        const [r2, c2] = context.revIdx(id2)
        result.push([r2, c2, dirType])
      }
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
    for (const [id, dirType] of data) {
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
    for (const [id, dirType] of data) {
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
    for (const [id, dirType] of data) {
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
