import type { GomokuDirectionType } from '../src'
import { GomokuContext, GomokuDirectionTypes, GomokuDirections } from '../src'

const { full: fullDirectionTypes } = GomokuDirectionTypes

class TesterHelper extends GomokuContext {
  public idxIfValid(r: number, c: number): number {
    return this.isValidPos(r, c) ? r * this.MAX_ROW + c : -1
  }

  public isInvalidPos(r: number, c: number): boolean {
    return r < 0 || r >= this.MAX_ROW || c < 0 || c >= this.MAX_COL
  }
}

describe('15x15', () => {
  const tester = new TesterHelper({
    MAX_ROW: 15,
    MAX_COL: 15,
    MAX_ADJACENT: 5,
    MAX_DISTANCE_OF_NEIGHBOR: 2,
  })
  beforeEach(() => {
    tester.init([])
  })

  test('init', () => {
    tester.init([])
    expect(tester.MAX_ROW).toEqual(15)
    expect(tester.MAX_COL).toEqual(15)
    expect(tester.MAX_ADJACENT).toEqual(5)
    expect(tester.MAX_DISTANCE_OF_NEIGHBOR).toEqual(2)
    expect(tester.TOTAL_POS).toEqual(15 * 15)
    expect(tester.MIDDLE_POS).toEqual((15 * 15) >> 1)
    expect(tester.board).toEqual(new Array(tester.TOTAL_POS).fill(-1))

    tester.init([
      { r: 2, c: 3, p: 0 },
      { r: 3, c: 2, p: 1 },
      { r: 2, c: 3, p: 0 },
      { r: 3, c: 2, p: 1 },
      { r: 1, c: 4, p: 1 },
    ])
    expect(tester.placedCount).toEqual(3)
    expect(tester.board[tester.idx(2, 3)]).toEqual(0)
    expect(tester.board[tester.idx(3, 2)]).toEqual(1)
    expect(tester.board[tester.idx(1, 4)]).toEqual(1)
  })

  test('forward', () => {
    for (let id = 0; id < tester.TOTAL_POS; ++id) {
      const player: 0 | 1 = Math.random() < 0.5 ? 0 : 1
      tester.forward(id, player)
      expect(tester.placedCount).toEqual(id + 1)
      expect(tester.board[id]).toEqual(player)
    }
    expect(tester.placedCount).toEqual(tester.TOTAL_POS)

    tester.forward(10, 0)
    expect(tester.board[10]).toBeGreaterThanOrEqual(0)
    expect(tester.placedCount).toEqual(tester.TOTAL_POS)
  })

  test('revert', () => {
    for (let id = 0; id < tester.TOTAL_POS; ++id) {
      const player: 0 | 1 = Math.random() < 0.5 ? 0 : 1
      tester.forward(id, player)
    }
    expect(tester.placedCount).toEqual(tester.TOTAL_POS)

    for (let id = 0; id < tester.TOTAL_POS; ++id) {
      tester.revert(id)
      expect(tester.board[id]).toBeLessThan(0)
      expect(tester.placedCount).toEqual(tester.TOTAL_POS - id - 1)
    }
    expect(tester.placedCount).toEqual(0)

    tester.revert(10)
    expect(tester.board[10]).toBeLessThan(0)
    expect(tester.placedCount).toEqual(0)
  })

  test('idx', () => {
    for (let r = 0; r < tester.MAX_ROW; ++r) {
      for (let c = 0; c < tester.MAX_COL; ++c) {
        const id: number = r * tester.MAX_ROW + c
        const message = `[r, c]: ${[r, c].join(', ')}`
        expect([message, tester.idx(r, c)]).toEqual([message, id])
      }
    }
  })

  test('revIdx', () => {
    for (let r = 0; r < tester.MAX_ROW; ++r) {
      for (let c = 0; c < tester.MAX_COL; ++c) {
        const id: number = r * tester.MAX_ROW + c
        const message = `[id]: ${[id].join(', ')}`
        expect([message, tester.revIdx(id)]).toEqual([message, [r, c]])
      }
    }
  })

  test('isValidPos', () => {
    for (let id = 0; id < tester.TOTAL_POS; ++id) {
      const [r, c] = tester.revIdx(id)
      expect(tester.isValidPos(r, c)).toEqual(true)
      expect(tester.isValidPos(-r, c)).toEqual(r === 0)
      expect(tester.isValidPos(r, -c)).toEqual(c === 0)
      expect(tester.isValidPos(-r, -c)).toEqual(r === 0 && c === 0)
      expect(tester.isValidPos(-1, c)).toEqual(false)
      expect(tester.isValidPos(r, -1)).toEqual(false)
    }

    expect(tester.isValidPos(0, 0)).toEqual(true)
    expect(tester.isValidPos(14, 14)).toEqual(true)
    expect(tester.isValidPos(11, 3)).toEqual(true)
    expect(tester.isValidPos(-1, 0)).toEqual(false)
    expect(tester.isValidPos(0, -1)).toEqual(false)
    expect(tester.isValidPos(0, 15)).toEqual(false)
    expect(tester.isValidPos(15, 3)).toEqual(false)
  })

  test('safeMove', () => {
    const MAX_STEPS: number = Math.max(tester.MAX_ROW, tester.MAX_COL)
    for (const dirType of fullDirectionTypes) {
      const [dr, dc] = GomokuDirections[dirType]
      for (let id = 0; id < tester.TOTAL_POS; ++id) {
        const [r, c] = tester.revIdx(id)
        for (let step = 0; step <= MAX_STEPS; ++step) {
          const r2: number = r + dr * step
          const c2: number = c + dc * step
          const id2: number = tester.idxIfValid(r2, c2)
          const message = `[r, c, dirType, step, r2, c2]: ${[r, c, dirType, step, r2, c2].join(
            ', ',
          )}`
          expect([message, tester.safeMove(id, dirType, step)]).toEqual([message, id2])
        }
      }
    }
  })

  test('safeMoveOnStep', () => {
    for (const dirType of fullDirectionTypes) {
      const [dr, dc] = GomokuDirections[dirType]
      for (let id = 0; id < tester.TOTAL_POS; ++id) {
        const [r, c] = tester.revIdx(id)
        const r2: number = r + dr
        const c2: number = c + dc
        const id2: number = tester.idxIfValid(r2, c2)
        const message = `[r, c, dirType, r2, c2]: ${[r, c, dirType, r2, c2].join(', ')}`
        expect([message, tester.safeMoveOneStep(id, dirType)]).toEqual([message, id2])
      }
    }
  })

  test('fastMove', () => {
    const MAX_STEPS: number = Math.max(tester.MAX_ROW, tester.MAX_COL)
    for (const dirType of fullDirectionTypes) {
      const [dr, dc] = GomokuDirections[dirType]
      for (let id = 0; id < tester.TOTAL_POS; ++id) {
        const [r, c] = tester.revIdx(id)
        for (let step = 0; step <= MAX_STEPS; ++step) {
          const r2: number = r + dr * step
          const c2: number = c + dc * step
          const id2: number = tester.idxIfValid(r2, c2)
          if (id2 < 0) continue

          const message = `[r, c, dirType, step, r2, c2]: ${[r, c, dirType, step, r2, c2].join(
            ', ',
          )}`
          expect([message, tester.fastMove(id, dirType, step)]).toEqual([message, id2])
        }
      }
    }
  })

  test('fastMoveOnStep', () => {
    for (const dirType of fullDirectionTypes) {
      const [dr, dc] = GomokuDirections[dirType]
      for (let id = 0; id < tester.TOTAL_POS; ++id) {
        const [r, c] = tester.revIdx(id)
        const r2: number = r + dr
        const c2: number = c + dc
        const id2: number = tester.idxIfValid(r2, c2)
        if (id2 < 0) continue

        const message = `[r, c, dirType, r2, c2]: ${[r, c, dirType, r2, c2].join(', ')}`
        expect([message, tester.fastMoveOneStep(id, dirType)]).toEqual([message, id2])
      }
    }
  })

  test('maxMovableSteps', () => {
    for (const dirType of fullDirectionTypes) {
      const [dr, dc] = GomokuDirections[dirType]
      for (let id = 0; id < tester.TOTAL_POS; ++id) {
        const [r, c] = tester.revIdx(id)
        let step = 0

        for (let r2 = r, c2 = c; ; ++step, r2 += dr, c2 += dc) {
          if (tester.isInvalidPos(r2 + dr, c2 + dc)) break
        }

        const message = `[r, c, dirType, step]: ${[r, c, dirType, step].join(', ')}`
        {
          let r2: number = r + dr * step
          let c2: number = c + dc * step
          expect([message, tester.isValidPos(r2, c2)]).toEqual([message, true])

          r2 += dr
          c2 += dc
          expect([message, tester.isInvalidPos(r2, c2)]).toEqual([message, true])
        }

        expect([message, tester.maxMovableSteps(id, dirType)]).toEqual([message, step])
      }
    }
  })

  test('accessibleNeighbors', () => {
    const { MAX_DISTANCE_OF_NEIGHBOR } = tester
    type INeighbor = number
    const cmp = (x: INeighbor, y: INeighbor): number => x - y
    const getValidNeighbors = (posId: number): INeighbor[] => {
      const result: INeighbor[] = []
      for (const dirType of fullDirectionTypes) {
        let posId2: number = posId
        for (let step = 0; step < MAX_DISTANCE_OF_NEIGHBOR; ++step) {
          posId2 = tester.safeMoveOneStep(posId2, dirType)
          if (posId2 < 0) break
          result.push(posId2)
        }
      }
      return result
    }

    for (let posId = 0; posId < tester.TOTAL_POS; ++posId) {
      const neighbors: INeighbor[] = []
      for (const neighbor of tester.accessibleNeighbors(posId)) neighbors.push(neighbor)
      expect(neighbors.slice().sort(cmp)).toEqual(getValidNeighbors(posId).slice().sort(cmp))
    }
  })

  test('hasPlacedNeighbors', () => {
    const hasPlacedNeighbors = (posId: number): boolean => {
      for (const id2 of tester.accessibleNeighbors(posId)) {
        if (id2 >= 0 && tester.board[id2] >= 0) return true
      }
      return false
    }

    const MAX_TEST_TIMES = 1000
    for (let t = 0; t < MAX_TEST_TIMES; ++t) {
      let posId: number = Math.round(Math.random() * tester.TOTAL_POS)
      if (posId >= tester.TOTAL_POS) posId = tester.TOTAL_POS - 1
      if (Math.random() < 0.5) tester.forward(posId, Math.random() < 0.5 ? 0 : 1)
      else tester.revert(posId)
      for (let id = 0; id < tester.TOTAL_POS; ++id) {
        expect(tester.hasPlacedNeighbors(id)).toEqual(hasPlacedNeighbors(id))
      }
    }
  })

  test('getFirstPosId', () => {
    for (const dirType of fullDirectionTypes) {
      const revDirType: GomokuDirectionType = dirType ^ 1
      for (let id = 0; id < tester.TOTAL_POS; ++id) {
        let id2: number = id
        for (;;) {
          if (tester.safeMoveOneStep(id2, revDirType) < 0) break
          id2 = tester.safeMoveOneStep(id2, revDirType)
        }
        const message = `[id, dirType]: ${[id, dirType]}`
        expect([message, tester.getStartPosId(id, dirType)]).toEqual([message, id2])
      }
    }
  })

  test('getStartPosSet', () => {
    const cmp = (x: number, y: number): number => x - y
    for (const dirType of fullDirectionTypes) {
      const revDirType: GomokuDirectionType = dirType ^ 1
      const startPosSet: Set<number> = new Set()
      for (let id = 0; id < tester.TOTAL_POS; ++id) {
        let id2: number = id
        for (;;) {
          if (tester.safeMoveOneStep(id2, revDirType) < 0) break
          id2 = tester.safeMoveOneStep(id2, revDirType)
        }
        startPosSet.add(id2)
      }

      expect(Array.from(tester.getStartPosSet(dirType)).sort(cmp)).toEqual(
        Array.from(startPosSet).sort(cmp),
      )
    }
  })

  test('traverseAllDirections', () => {
    const collect = (): unknown[] => {
      const result: unknown[] = []
      tester.traverseAllDirections(dirType => posId => void result.push([posId, dirType]))
      return result
    }

    const data = collect() as any[]
    expect(data.length).toEqual(tester.TOTAL_POS * fullDirectionTypes.length)

    const countMap1: Record<number, number> = {}
    const countMap2: Record<GomokuDirectionType, number> = {} as any
    for (const [id, dirType] of data) {
      countMap1[id] = (countMap1[id] ?? 0) + 1
      countMap2[dirType] = (countMap2[dirType] ?? 0) + 1
    }

    expect(fullDirectionTypes.every(dirType => countMap2[dirType] === tester.TOTAL_POS)).toEqual(
      true,
    )
    expect(
      new Array(tester.TOTAL_POS)
        .fill(0)
        .every((_v, idx) => countMap1[idx] === fullDirectionTypes.length),
    ).toEqual(true)
  })
})
