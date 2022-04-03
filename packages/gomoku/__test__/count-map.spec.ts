import fs from 'fs-extra'
import type { GomokuDirectionType, IDirCounter, IGomokuContextProps, IGomokuPiece } from '../src'
import { GomokuContext, GomokuCountMap, GomokuDirectionTypes } from '../src'
import { PieceDataDirName, locatePieceDataFilepaths, stringify } from './util'

const { rightHalf: halfDirectionTypes } = GomokuDirectionTypes

class TesterHelper extends GomokuCountMap {
  constructor(props: IGomokuContextProps) {
    const context = new GomokuContext(props)
    super(context)
  }

  // @ts-ignore
  public override init(pieces: ReadonlyArray<IGomokuPiece>): void {
    this.context.init(pieces)
    super.init()
  }

  // @ts-ignore
  public override forward(posId: number, playerId: number): void {
    if (this.context.forward(posId, playerId)) super.forward(posId)
  }

  // @ts-ignore
  public override revert(posId: number): void {
    if (this.context.revert(posId)) super.revert(posId)
  }

  public $getDirCounters(
    startPosId: number,
    dirType: GomokuDirectionType,
  ): ReadonlyArray<IDirCounter> {
    const { context } = this
    const { board } = context
    const maxSteps: number = context.maxMovableSteps(startPosId, dirType) + 1
    const counters: IDirCounter[] = []
    for (
      let i = 0, posId = startPosId, i2: number, posId2: number;
      i < maxSteps;
      i = i2, posId = posId2
    ) {
      const playerId: number = board[posId]
      for (i2 = i + 1, posId2 = posId; i2 < maxSteps; ++i2) {
        posId2 = context.fastMoveOneStep(posId2, dirType)
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

  test('getDirCounters -- init', async () => {
    for (const { filepath, title } of filepaths) {
      const pieces = await fs.readJSON(filepath)
      tester.init(pieces)
      for (const dirType of halfDirectionTypes) {
        for (const startPosId of tester.context.getStartPosSet(dirType)) {
          const message = `${title} [dirType, startPosId]: ${[dirType, startPosId].join(', ')}`
          expect([message, tester.getDirCounters(startPosId, dirType)]).toEqual([
            message,
            tester.$getDirCounters(startPosId, dirType),
          ])
        }
      }
    }
  })

  test('getDirCounters -- step by step', async () => {
    for (const { filepath, title } of filepaths) {
      const pieces = await fs.readJSON(filepath)
      tester.init([])
      for (const { r, c, p } of pieces) {
        const posId = tester.context.idx(r, c)
        tester.forward(posId, p)
        for (const dirType of halfDirectionTypes) {
          for (const startPosId of tester.context.getStartPosSet(dirType)) {
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

      for (let id = 0; id < tester.context.TOTAL_POS; ++id) {
        tester.context.revIdx(id)
        const [r, c] = tester.context.revIdx(id)
        for (const dirType of halfDirectionTypes) {
          const startPosId = tester.context.getStartPosId(id, dirType)
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
})