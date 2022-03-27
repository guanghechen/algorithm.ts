import type { IGomokuPiece, IScoreMap } from '../src'
import { GomokuContext, GomokuState, createScoreMap } from '../src'

class TesterHelper {
  public readonly context: GomokuContext
  public readonly state: GomokuState
  protected readonly scoreMap: IScoreMap

  constructor(MAX_ROW: number, MAX_COL: number, MAX_INLINE: number) {
    const context = new GomokuContext(MAX_ROW, MAX_COL, MAX_INLINE, 0)
    const scoreMap: IScoreMap = createScoreMap(context.TOTAL_POS, context.MAX_INLINE)
    const state = new GomokuState(context, scoreMap)

    this.context = context
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
  })

  test('edge case', function () {
    helper.init()
    {
      const board = new Int32Array(helper.context.board)
      helper.state.rollback(0)
      helper.state.rollback(-1)
      expect(helper.context.board).toEqual(board)
    }

    let player = 0
    for (let id = 0; id < helper.context.TOTAL_POS; ++id) {
      helper.state.forward(id, player)
      player ^= 1
    }

    expect(helper.state.expand(0, 0)).toEqual([])
    expect(helper.state.isFinal()).toEqual(true)

    {
      const board = new Int32Array(helper.context.board)
      helper.state.forward(0, 0)
      helper.state.forward(-1, 0)
      expect(helper.context.board).toEqual(board)
    }
  })
})
