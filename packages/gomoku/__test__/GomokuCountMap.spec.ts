import type { IGomokuPiece } from '../src'
import { GomokuContext, GomokuCountMap, GomokuDirectionType, gomokuDirectionTypes } from '../src'

class TesterHelper {
  public readonly context: GomokuContext
  public readonly board: Int32Array
  public readonly countMap: GomokuCountMap
  protected readonly pieces: IGomokuPiece[]

  constructor(MAX_ROW: number, MAX_COL: number, MAX_INLINE: number) {
    const context = new GomokuContext(MAX_ROW, MAX_COL, MAX_INLINE)
    const board = new Int32Array(context.TOTAL_POS).fill(-1)
    const countMap = new GomokuCountMap(context, board)

    this.context = context
    this.board = board
    this.countMap = countMap
    this.pieces = []
  }

  public init(): void {
    this.board.fill(-1)
    this.countMap.init()
  }

  public forward(r: number, c: number, p: number): void {
    const { context, board, countMap } = this
    const id: number = context.idx(r, c)
    if (board[id] >= 0) return

    countMap.beforeForward(r, c, p)
    board[id] = p
    countMap.afterForward(r, c, p)
  }

  public rollback(r: number, c: number): void {
    const { context, board, countMap } = this
    const id: number = context.idx(r, c)
    if (board[id] < 0) return

    const p: number = board[id]
    countMap.beforeRollback(r, c, p)
    board[id] = -1
    countMap.afterRollback(r, c, p)
  }

  public snapshot(): ReturnType<GomokuCountMap['toJSON']> {
    const board = new Int32Array(this.board)
    for (const { r, c, p } of this.pieces) {
      const id: number = this.context.idx(r, c)
      board[id] = p
    }

    const countMap = new GomokuCountMap(this.context, board)
    countMap.init()
    return countMap.toJSON()
  }
}

describe('7x7', () => {
  const helper = new TesterHelper(7, 7, 5)

  test('basic', function () {
    helper.init()
    const { context, countMap } = helper
    const id1: number = context.idx(1, 1)
    const id2: number = context.idx(2, 2)

    const testState1 = (): void => {
      const { continuouslyShapeCountMap, dirCountMap } = countMap.toJSON()
      expect(continuouslyShapeCountMap[1][1][2]).toEqual(4)
      expect(gomokuDirectionTypes.every(dirType => dirCountMap[dirType][id1] === 1)).toEqual(true)
    }

    const testState2 = (): void => {
      const { continuouslyShapeCountMap, dirCountMap } = countMap.toJSON()
      expect(continuouslyShapeCountMap[1][1][2]).toEqual(6)
      expect(continuouslyShapeCountMap[1][2][2]).toEqual(1)
      expect(
        gomokuDirectionTypes.every(
          dirType =>
            dirCountMap[dirType][id1] === (dirType === GomokuDirectionType.BOTTOM_RIGHT ? 2 : 1),
        ),
      ).toEqual(true)
      expect(
        gomokuDirectionTypes.every(
          dirType =>
            dirCountMap[dirType][id2] ===
            ((dirType ^ 1) === GomokuDirectionType.BOTTOM_RIGHT ? 2 : 1),
        ),
      ).toEqual(true)
    }

    helper.forward(1, 1, 1)
    testState1()

    helper.forward(2, 2, 1)
    testState2()

    helper.forward(3, 3, 1)
    helper.forward(4, 4, 1)
    helper.forward(5, 5, 1)
    helper.forward(5, 2, 1)
    helper.forward(4, 2, 0)
    helper.forward(4, 0, 0)
    expect(countMap.toJSON()).toMatchSnapshot()

    helper.rollback(4, 0)
    helper.rollback(4, 2)
    helper.rollback(5, 2)
    helper.rollback(5, 5)
    helper.rollback(4, 4)
    helper.rollback(3, 3)
    testState2()
    helper.rollback(2, 2)
    testState1()
  })

  test('complicate', function () {
    helper.init()
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
    helper.forward(1, 1, 1)
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
    helper.forward(2, 3, 1)
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
    helper.forward(1, 3, 0)
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
    helper.forward(3, 1, 1)
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
    helper.forward(4, 1, 0)
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
    helper.forward(5, 3, 1)
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
    helper.forward(6, 4, 1)
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
    helper.rollback(5, 3)
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
    helper.forward(1, 1, 1)
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
    helper.rollback(4, 1)
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
    helper.forward(3, 6, 1)
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
    helper.rollback(1, 1)
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
    helper.forward(0, 0, 1)
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
    helper.forward(0, 1, 1)
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
    helper.forward(0, 3, 1)
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
    helper.forward(0, 4, 1)
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
    helper.forward(0, 5, 0)
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
  })
})
