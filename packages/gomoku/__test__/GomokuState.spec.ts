import fs from 'fs-extra'
import { locateFixtures } from 'jest.setup'
import path from 'path'
import type { IGomokuPiece, IScoreMap } from '../src'
import { GomokuContext, GomokuState, createScoreMap } from '../src'

const idCompare = (x: number, y: number): number => x - y
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

  public candidateIds(): number[] {
    const { context } = this
    const candidateSet: Set<number> = new Set()
    for (let id = 0; id < context.TOTAL_POS; ++id) {
      if (context.board[id] < 0) {
        if (context.hasPlacedNeighbors(id)) candidateSet.add(id)
      }
    }
    if (context.board[context.MIDDLE_POS] < 0) candidateSet.add(context.MIDDLE_POS)
    return Array.from(candidateSet).sort((x, y) => x - y)
  }
}

describe('15x15', function () {
  const helper = new TesterHelper(15, 15, 5)
  test('candidates', async function () {
    const filepaths = fs
      .readdirSync(locateFixtures('15x15'))
      .filter(filename => /pieces\.\d+?\.json$/.test(filename))
      .map(filename => locateFixtures('15x15', filename))
      .filter(filepath => fs.statSync(filepath).isFile())

    const getCandidateIds = (nextPlayer: number, scoreForPlayer: number): number[] =>
      helper.state
        .expand(nextPlayer, scoreForPlayer)
        .map(candidate => candidate.id)
        .sort(idCompare)

    for (const filepath of filepaths) {
      const filename = path.parse(filepath).name
      helper.init([])
      expect([filename, getCandidateIds(0, 0)]).toEqual([filename, [112]])
      expect([filename, getCandidateIds(0, 1)]).toEqual([filename, [112]])
      expect([filename, getCandidateIds(1, 0)]).toEqual([filename, [112]])
      expect([filename, getCandidateIds(1, 1)]).toEqual([filename, [112]])
      const pieces = await fs.readJSON(filepath)
      for (const { r, c, p } of pieces) {
        const id: number = helper.context.idx(r, c)
        helper.state.forward(id, p)
        const candidateIds: number[] = helper.candidateIds()
        expect([filename, getCandidateIds(0, 0)]).toEqual([filename, candidateIds])
        expect([filename, getCandidateIds(0, 1)]).toEqual([filename, candidateIds])
        expect([filename, getCandidateIds(1, 0)]).toEqual([filename, candidateIds])
        expect([filename, getCandidateIds(1, 1)]).toEqual([filename, candidateIds])
      }
    }

    for (const filepath of filepaths) {
      helper.init([])
      expect(helper.state.expand(0, 0)).toEqual([{ id: helper.context.MIDDLE_POS, score: 16 }])
      expect(helper.state.expand(0, 1)).toEqual([{ id: helper.context.MIDDLE_POS, score: -16 }])
      expect(helper.state.expand(1, 0)).toEqual([{ id: helper.context.MIDDLE_POS, score: -16 }])
      expect(helper.state.expand(1, 1)).toEqual([{ id: helper.context.MIDDLE_POS, score: 16 }])

      const pieces = await fs.readJSON(filepath)
      for (const { r, c, p } of pieces) {
        const id: number = helper.context.idx(r, c)
        helper.state.forward(id, p)
      }
    }
  })

  test('pieces.1', async function () {
    const pieces = await import('./fixtures/15x15/pieces.1.json')
    helper.init(pieces.default)
    const candidates = helper.state.expand(0, 0)
    expect(candidates.length).toEqual(53)
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
