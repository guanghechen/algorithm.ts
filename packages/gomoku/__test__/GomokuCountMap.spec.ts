import fs from 'fs-extra'
import { locateFixtures } from 'jest.setup'
import type { IGomokuBoard, IGomokuPiece, IScoreMap } from '../src'
import { GomokuContext, GomokuCountMap, GomokuDirectionType, gomokuDirectionTypes } from '../src'
import { createScoreMap } from '../src/util'

class TesterHelper {
  public readonly context: GomokuContext
  public readonly countMap: GomokuCountMap
  protected readonly scoreMap: IScoreMap

  constructor(MAX_ROW: number, MAX_COL: number, MAX_INLINE: number) {
    const context: GomokuContext = new GomokuContext(MAX_ROW, MAX_COL, MAX_INLINE)
    const scoreMap: IScoreMap = createScoreMap(context.MAX_INLINE)
    const countMap: GomokuCountMap = new GomokuCountMap(context, scoreMap)

    this.context = context
    this.countMap = countMap
    this.scoreMap = scoreMap
  }

  public init(pieces?: IGomokuPiece[]): void {
    this.context.init(pieces ?? [])
    this.countMap.init()
  }

  public forward(r: number, c: number, p: number): void {
    const { context, countMap } = this
    const id: number = context.idx(r, c)
    if (context.board[id] >= 0) return

    countMap.beforeForward(id)
    context.forward(id, p)
    countMap.afterForward(id)
  }

  public rollback(r: number, c: number): void {
    const { context, countMap } = this
    const id: number = context.idx(r, c)
    if (context.board[id] < 0) return

    countMap.beforeRollback(id)
    context.rollback(id)
    countMap.afterRollback(id)
  }

  public snapshot(): ReturnType<GomokuCountMap['toJSON']> {
    const countMap = new GomokuCountMap(this.context, this.scoreMap)
    countMap.init()
    return countMap.toJSON()
  }
}

describe('7x7', () => {
  const helper = new TesterHelper(7, 7, 5)

  test('basic', function () {
    helper.init()
    const id1: number = helper.context.idx(1, 1)
    const id2: number = helper.context.idx(2, 2)

    const testState1 = (): void => {
      const { conShapeCountMap, dirCountMap } = helper.countMap.toJSON()
      expect(conShapeCountMap[1][1][0]).toEqual(1)
      expect(conShapeCountMap[1][1][2]).toEqual(3)
      expect(gomokuDirectionTypes.every(dirType => dirCountMap[dirType][id1] === 1)).toEqual(true)
    }

    const testState2 = (): void => {
      const { conShapeCountMap, dirCountMap } = helper.countMap.toJSON()
      expect(conShapeCountMap[1][1][0]).toEqual(1)
      expect(conShapeCountMap[1][1][2]).toEqual(5)
      expect(conShapeCountMap[1][2][2]).toEqual(1)
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
    expect(helper.countMap.hasReachedTheLimit(1)).toEqual(true)
    expect(helper.countMap.toJSON()).toMatchSnapshot()

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
})

describe('15x15', () => {
  const helper = new TesterHelper(15, 15, 5)

  test('overview', async function () {
    const filepaths = fs
      .readdirSync(locateFixtures('15x15'))
      .filter(filename => /pieces\.\d+?\.json$/.test(filename))
      .map(filename => locateFixtures('15x15', filename))
      .filter(filepath => fs.statSync(filepath).isFile())
    expect(filepaths.length).toBeGreaterThan(0)
    for (const filepath of filepaths) {
      const pieces = await fs.readJSON(filepath)
      helper.init()
      for (let i = 0; i < pieces.length; ++i) {
        const { r, c, p } = pieces[i]
        if (i > 0 && Math.random() > 0.8) {
          helper.rollback(r, c)
          i -= 2
        } else {
          helper.forward(r, c, p)
        }
        expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
      }
      expect(helper.countMap.toJSON()).toEqual(helper.snapshot())

      let pieceCnt = 0
      for (let r = 0; r < helper.context.MAX_ROW; ++r) {
        for (let c = 0; c < helper.context.MAX_COL; ++c) {
          const id: number = helper.context.idx(r, c)
          if (helper.context.board[id] >= 0) pieceCnt += 1
        }
      }
      expect(pieceCnt).toEqual(pieces.length)
    }
  })

  test('pieces.1', async function () {
    const pieces = await import('./fixtures/15x15/pieces.1.json')
    helper.init(pieces.default)

    const { conShapeCountMap, gapShapeCountMap } = helper.countMap.toJSON()
    expect(gapShapeCountMap[0][4][2]).toEqual(1)
    expect(gapShapeCountMap[1][4][1]).toEqual(1)
    expect(gapShapeCountMap).toMatchSnapshot('gapShapeCountMap')
    expect(conShapeCountMap).toMatchSnapshot('conShapeCountMap')
  })

  test('pieces.2', async function () {
    const pieces = await import('./fixtures/15x15/pieces.2.json')
    helper.init(pieces.default)

    const { conShapeCountMap, gapShapeCountMap } = helper.countMap.toJSON()
    expect(gapShapeCountMap[0][4][2]).toEqual(1)
    expect(gapShapeCountMap[1][4][2]).toEqual(1)
    expect(conShapeCountMap[0][4][2]).toEqual(1)
    expect(conShapeCountMap[0][3][2]).toEqual(1)
    expect(conShapeCountMap[1][4][2]).toEqual(1)
    expect(gapShapeCountMap).toMatchSnapshot('gapShapeCountMap')
    expect(conShapeCountMap).toMatchSnapshot('conShapeCountMap')
  })

  test('edge case - 1', function () {
    helper.init()
    helper.forward(7, 7, 0)
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
    helper.forward(6, 8, 1)
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
    helper.forward(5, 7, 0)
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
    helper.forward(4, 8, 1)
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
    helper.forward(3, 8, 0)
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
    helper.forward(2, 8, 1)
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
    helper.forward(7, 8, 0)
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
  })

  test('edge case - 2', function () {
    helper.init()
    helper.forward(7, 7, 0)
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
    helper.forward(7, 6, 1)
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
    helper.forward(6, 6, 0)
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
    helper.forward(8, 5, 1)
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
    helper.forward(6, 7, 0)
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
    helper.forward(8, 7, 1)
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
    helper.forward(9, 4, 0)
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
    helper.forward(8, 6, 1)
    expect(helper.countMap.toJSON()).toEqual(helper.snapshot())
  })
})
