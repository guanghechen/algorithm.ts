import { GomokuContext, GomokuCountMap, GomokuDirectionType, gomokuDirectionTypes } from '../src'

describe('7x7', () => {
  const context = new GomokuContext(7, 7, 5)
  const board = new Int32Array(context.TOTAL_POS).fill(-1)
  const countMap = new GomokuCountMap(context, board)

  const init = (): void => {
    board.fill(-1)
    countMap.init()
  }

  const forward = (r: number, c: number, p: number): void => {
    const id: number = context.idx(r, c)
    if (board[id] >= 0) return

    countMap.beforeForward(r, c, p)
    board[id] = p
    countMap.afterForward(r, c, p)
  }

  const rollback = (r: number, c: number): void => {
    const id: number = context.idx(r, c)
    if (board[id] < 0) return

    const p: number = board[id]
    countMap.beforeRollback(r, c, p)
    board[id] = -1
    countMap.afterRollback(r, c, p)
  }

  test('basic', function () {
    init()
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

    forward(1, 1, 1)
    testState1()

    forward(2, 2, 1)
    testState2()

    forward(3, 3, 1)
    forward(4, 4, 1)
    forward(5, 5, 1)
    expect(countMap.toJSON()).toMatchSnapshot()

    rollback(5, 5)
    rollback(4, 4)
    rollback(3, 3)
    testState2()
    rollback(2, 2)
    testState1()
  })
})
