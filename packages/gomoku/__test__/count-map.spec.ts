import fs from 'fs-extra'
import { locateFixtures } from 'jest.setup'
import type { GomokuDirectionType, IGomokuContextProps, IGomokuPiece } from '../src'
import { GomokuContext, GomokuCountMap, GomokuDirectionTypes } from '../src'
import { PieceDataDirName, locatePieceDataFilepaths } from './util'

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

  public $stateCouldReachFinal(playerId: number): number {
    const { context } = this
    let count = 0
    for (let posId = 0; posId < context.TOTAL_POS; ++posId) {
      if (this.$candidateCouldReachFinal(playerId, posId)) count += 1
    }
    return count
  }

  public $candidateCouldReachFinal(playerId: number, posId: number): boolean {
    const { context } = this
    const { MAX_ADJACENT, board } = context
    if (board[posId] >= 0) return false

    for (const dirType of halfDirectionTypes) {
      const revDirType: GomokuDirectionType = dirType ^ 1
      if (board[posId] < 0) {
        let count = 1
        const maxMovableSteps0: number = context.maxMovableSteps(posId, revDirType)
        for (let id = posId, step = 0; step < maxMovableSteps0; ++step) {
          id = context.fastMoveOneStep(id, revDirType)
          if (board[id] !== playerId) break
          count += 1
        }

        const maxMovableSteps2: number = context.maxMovableSteps(posId, dirType)
        for (let id = posId, step = 0; step < maxMovableSteps2; ++step) {
          id = context.fastMoveOneStep(id, dirType)
          if (board[id] !== playerId) break
          count += 1
        }

        if (count >= MAX_ADJACENT) return true
      }
    }
    return false
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

  test('overview', async function () {
    const filepaths = fs
      .readdirSync(locateFixtures('15x15'))
      .filter(filename => /pieces\.\d+?\.json$/.test(filename))
      .map(filename => locateFixtures('15x15', filename))
      .filter(filepath => fs.statSync(filepath).isFile())
    expect(filepaths.length).toBeGreaterThan(0)
    for (const filepath of filepaths) {
      const pieces = await fs.readJSON(filepath)
      tester.init([])
      for (let i = 0; i < pieces.length; ++i) {
        const { r, c, p } = pieces[i]
        const posId = tester.context.idx(r, c)
        if (i > 0 && Math.random() > 0.8) {
          tester.revert(posId)
          i -= 2
        } else {
          tester.forward(posId, p)
        }
        expect(tester.candidateCouldReachFinal(0, posId)).toEqual(
          tester.$candidateCouldReachFinal(0, posId),
        )
        expect(tester.candidateCouldReachFinal(1, posId)).toEqual(
          tester.$candidateCouldReachFinal(1, posId),
        )
        expect(Array.from(tester.mustDropPos(0)).length).toEqual(tester.$stateCouldReachFinal(0))
        expect(Array.from(tester.mustDropPos(1)).length).toEqual(tester.$stateCouldReachFinal(1))
      }
      for (let posId = 0; posId < tester.context.TOTAL_POS; ++posId) {
        expect(tester.candidateCouldReachFinal(0, posId)).toEqual(
          tester.$candidateCouldReachFinal(0, posId),
        )
        expect(tester.candidateCouldReachFinal(1, posId)).toEqual(
          tester.$candidateCouldReachFinal(1, posId),
        )
        expect(Array.from(tester.mustDropPos(0)).length).toEqual(tester.$stateCouldReachFinal(0))
        expect(Array.from(tester.mustDropPos(1)).length).toEqual(tester.$stateCouldReachFinal(1))
      }
    }
  })
})
