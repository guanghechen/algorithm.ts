import { jest } from '@jest/globals'
import type { GomokuDirectionType, IDirCounter } from '../src'
import { GomokuDirectionTypes, GomokuDirections, GomokuMoverContext } from '../src'
import { PieceDataDirName, locatePieceDataFilepaths, stringify } from './util'

const { full: fullDirectionTypes, rightHalf: halfDirectionTypes } = GomokuDirectionTypes

class TesterHelper extends GomokuMoverContext {
  public idxIfValid(r: number, c: number): number {
    return super.isValidPos(r, c) ? r * this.MAX_ROW + c : -1
  }

  public override forward(posId: number, playerId: number): void {
    if (super.isValidIdx(posId) && this.board[posId] < 0) {
      super.forward(posId, playerId)
    }
  }

  public override revert(posId: number): void {
    if (super.isValidIdx(posId) && this.board[posId] >= 0) {
      super.revert(posId)
    }
  }

  public $getDirCounters(
    startPosId: number,
    dirType: GomokuDirectionType,
  ): ReadonlyArray<IDirCounter> {
    const { board } = this
    const maxSteps: number = this.maxMovableSteps(startPosId, dirType) + 1
    const counters: IDirCounter[] = []
    for (
      let i = 0, posId = startPosId, i2: number, posId2: number;
      i < maxSteps;
      i = i2, posId = posId2
    ) {
      const playerId: number = board[posId]
      for (i2 = i + 1, posId2 = posId; i2 < maxSteps; ++i2) {
        posId2 = this.fastMoveOneStep(posId2, dirType)
        if (board[posId2] !== playerId) break
      }
      counters.push({ playerId, count: i2 - i })
    }
    return counters
  }
}

describe('15x15', () => {
  const filepaths = locatePieceDataFilepaths(PieceDataDirName.d15x15)
  const tester = new TesterHelper({
    MAX_ROW: 15,
    MAX_COL: 15,
    MAX_ADJACENT: 5,
    MAX_DISTANCE_OF_NEIGHBOR: 2,
  })
  beforeEach(() => {
    tester.init([])
  })

  it('init', function () {
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

  it('forward', function () {
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

  it('revert', function () {
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

  it('idx', function () {
    for (let r = 0; r < tester.MAX_ROW; ++r) {
      for (let c = 0; c < tester.MAX_COL; ++c) {
        const id: number = r * tester.MAX_ROW + c
        const message = `[r, c]: ${[r, c].join(', ')}`
        expect([message, tester.idx(r, c)]).toEqual([message, id])
      }
    }
  })

  it('revIdx', function () {
    for (let r = 0; r < tester.MAX_ROW; ++r) {
      for (let c = 0; c < tester.MAX_COL; ++c) {
        const id: number = r * tester.MAX_ROW + c
        const message = `[id]: ${[id].join(', ')}`
        expect([message, tester.revIdx(id)]).toEqual([message, [r, c]])
      }
    }
  })

  it('isValidPos', function () {
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

  it('isValidIdx', function () {
    for (let id = 0; id < tester.TOTAL_POS; ++id) {
      expect(tester.isValidIdx(id)).toEqual(true)
    }

    expect(tester.isValidIdx(-1)).toEqual(false)
    expect(tester.isValidIdx(tester.TOTAL_POS)).toEqual(false)
  })

  it('safeMove', function () {
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

  it('safeMoveOnStep', function () {
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

  it('fastMove', function () {
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

  it('fastMoveOnStep', function () {
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

  it('maxMovableSteps', function () {
    for (const dirType of fullDirectionTypes) {
      const [dr, dc] = GomokuDirections[dirType]
      for (let id = 0; id < tester.TOTAL_POS; ++id) {
        const [r, c] = tester.revIdx(id)
        let step = 0

        for (let r2 = r, c2 = c; ; ++step, r2 += dr, c2 += dc) {
          if (!tester.isValidPos(r2 + dr, c2 + dc)) break
        }

        const message = `[r, c, dirType, step]: ${[r, c, dirType, step].join(', ')}`
        {
          let r2: number = r + dr * step
          let c2: number = c + dc * step
          expect([message, tester.isValidPos(r2, c2)]).toEqual([message, true])

          r2 += dr
          c2 += dc
          expect([message, !tester.isValidPos(r2, c2)]).toEqual([message, true])
        }

        expect([message, tester.maxMovableSteps(id, dirType)]).toEqual([message, step])
      }
    }
  })

  it('accessibleNeighbors', function () {
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

  it('hasPlacedNeighbors', function () {
    jest.setTimeout(15 * 1000)
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

  it('getFirstPosId', function () {
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

  it('getStartPosSet', function () {
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

  it('getDirCounters -- init', async () => {
    for (const { filepath, title } of filepaths) {
      const { default: pieces } = await import(filepath, { with: { type: 'json' } })
      tester.init(pieces)
      for (const dirType of halfDirectionTypes) {
        for (const startPosId of tester.getStartPosSet(dirType)) {
          const message = `${title} [dirType, startPosId]: ${[dirType, startPosId].join(', ')}`
          expect([message, tester.getDirCounters(startPosId, dirType)]).toEqual([
            message,
            tester.$getDirCounters(startPosId, dirType),
          ])
        }
      }
    }
  })

  it('getDirCounters -- step by step', async () => {
    for (const { filepath, title } of filepaths) {
      const { default: pieces } = await import(filepath, { with: { type: 'json' } })
      tester.init([])
      for (const { r, c, p } of pieces) {
        const posId = tester.idx(r, c)
        tester.forward(posId, p)
        for (const dirType of halfDirectionTypes) {
          for (const startPosId of tester.getStartPosSet(dirType)) {
            const message = `${title} [dirType, r, c, startPosId]: ${[
              dirType,
              r,
              c,
              startPosId,
            ].join(', ')}`
            expect([message, stringify(tester.getDirCounters(startPosId, dirType))]).toEqual([
              message,
              stringify(tester.$getDirCounters(startPosId, dirType)),
            ])
          }
        }
      }

      for (let id = 0; id < tester.TOTAL_POS; ++id) {
        tester.revIdx(id)
        const [r, c] = tester.revIdx(id)
        for (const dirType of halfDirectionTypes) {
          const startPosId = tester.getStartPosId(id, dirType)
          const message = `${title} [dirType, r, c, startPosId]: ${[dirType, r, c, startPosId].join(
            ', ',
          )}`
          expect([message, stringify(tester.getDirCounters(startPosId, dirType))]).toEqual([
            message,
            stringify(tester.$getDirCounters(startPosId, dirType)),
          ])
        }
      }
    }
  })

  it('traverseAllDirections', function () {
    const collect = (): unknown[] => {
      const result: unknown[] = []
      tester.traverseAllDirections(dirType => posId => void result.push([posId, dirType]))
      return result
    }

    const data = collect() as Array<[id: number, dirType: GomokuDirectionType]>
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
