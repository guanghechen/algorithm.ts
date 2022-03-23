import type { IGomokuPiece, IScoreMap } from '../src'
import { GomokuContext, GomokuState, createScoreMap } from '../src'

class TesterHelper {
  public readonly context: GomokuContext
  public readonly state: GomokuState
  public readonly board: Int32Array
  protected readonly scoreMap: IScoreMap

  constructor(MAX_ROW: number, MAX_COL: number, MAX_INLINE: number) {
    const context = new GomokuContext(MAX_ROW, MAX_COL, MAX_INLINE)
    const board = new Int32Array(context.TOTAL_POS).fill(-1)
    const scoreMap: IScoreMap = createScoreMap(context.MAX_INLINE)
    const state = new GomokuState(context, scoreMap)

    this.context = context
    this.board = board
    this.state = state
    this.scoreMap = scoreMap
  }

  public init(pieces?: IGomokuPiece[]): void {
    this.state.init(pieces)
  }
}

describe('15x15', function () {
  const helper = new TesterHelper(15, 15, 5)

  test('pieces.1', async function () {
    const pieces = await import('./fixtures/15x15/pieces.1.json')
    helper.init(pieces.default)
    const candidates = helper.state.expand(0, 0)
    expect(candidates.length).toEqual(26)
    expect(candidates.map(({ r, c }) => [r, c])).toContainEqual(helper.state.randomMove())
  })

  test('edge case', function () {
    helper.init()
    {
      const board = new Int32Array(helper.board)
      helper.state.rollback(0, 0)
      helper.state.rollback(-1, 0)
      expect(helper.board).toEqual(board)
    }

    let player = 0
    for (let r = 0; r < helper.context.MAX_ROW; ++r) {
      for (let c = 0; c < helper.context.MAX_COL; ++c) {
        helper.state.forward(r, c, player)
        player ^= 1
      }
    }

    expect(helper.state.randomMove()).toEqual([-1, -1])
    expect(helper.state.expand(0, 0)).toEqual([])
    expect(helper.state.isFinal()).toEqual(true)

    {
      const board = new Int32Array(helper.board)
      helper.state.forward(0, 0, 0)
      helper.state.forward(-1, 0, 0)
      expect(helper.board).toEqual(board)
    }
  })
})
