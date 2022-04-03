import fs from 'fs-extra'
import type { IGomokuCandidateState, IGomokuPiece } from '../src'
import { GomokuContext, GomokuDirectionTypes, GomokuState, createScoreMap } from '../src'
import { PieceDataDirName, locatePieceDataFilepaths } from './util'

const { full: fullDirectionTypes, rightHalf: halfDirectionTypes } = GomokuDirectionTypes

const compareCandidate = (x: IGomokuCandidateState, y: IGomokuCandidateState): number => x.id - y.id
class TestHelper extends GomokuState {
  constructor(MAX_ROW: number, MAX_COL: number) {
    const context = new GomokuContext({
      MAX_ROW,
      MAX_COL,
      MAX_ADJACENT: 5,
      MAX_DISTANCE_OF_NEIGHBOR: 2,
    })
    super({ context, MAX_NEXT_MOVER_BUFFER: 0, scoreMap: createScoreMap(context.MAX_ADJACENT) })
  }

  public override init(pieces: ReadonlyArray<IGomokuPiece>): void {
    this.context.init(pieces)
    super.init(pieces)
  }

  // @ts-ignore
  public override forward(posId: number, playerId: number): void {
    if (this.context.forward(posId, playerId)) {
      super.forward(posId)
    }
  }

  public override revert(posId: number): void {
    if (this.context.revert(posId)) {
      super.revert(posId)
    }
  }

  // @ts-ignore
  public override expand(nextPlayer: number): IGomokuCandidateState[] {
    const candidates: IGomokuCandidateState[] = []
    super.expand(nextPlayer, candidates)
    return candidates
  }

  public $getCandidateIds(): number[] {
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

  public $getCandidates(nextPlayerId: number): IGomokuCandidateState[] {
    const { context } = this
    const candidates: IGomokuCandidateState[] = this.expand(nextPlayerId)
    for (const candidate of candidates) {
      const posId: number = candidate.id
      let prevScore0 = 0
      let prevScore1 = 0
      for (const dirType of halfDirectionTypes) {
        const startPosId: number = context.getStartPosId(candidate.id, dirType)
        const { scores } = this._evaluateScoreInDirection(startPosId, dirType)
        prevScore0 += scores[0]
        prevScore1 += scores[1]
      }

      let score0 = 0
      context.forward(posId, 0)
      for (const dirType of halfDirectionTypes) {
        const startPosId: number = context.getStartPosId(posId, dirType)
        const { scores } = this._evaluateScoreInDirection(startPosId, dirType)
        score0 += scores[0]
      }
      context.revert(posId)

      let score1 = 0
      context.forward(posId, 1)
      for (const dirType of halfDirectionTypes) {
        const startPosId: number = context.getStartPosId(posId, dirType)
        const { scores } = this._evaluateScoreInDirection(startPosId, dirType)
        score1 += scores[1]
      }
      context.revert(posId)

      const deltaScore0: number = score0 - prevScore0
      const deltaScore1: number = score1 - prevScore1
      const score: number =
        nextPlayerId === 0 ? deltaScore0 * 2 + deltaScore1 : deltaScore0 + deltaScore1 * 2
      candidate.score = score
    }
    return candidates
  }
}

describe('15x15', function () {
  const tester = new TestHelper(15, 15)
  const filepaths = locatePieceDataFilepaths(PieceDataDirName.d15x15)
  const checkCandidates = (nextPlayerId: number): void => {
    expect(tester.expand(nextPlayerId).sort(compareCandidate)).toEqual(
      tester.$getCandidates(nextPlayerId).sort(compareCandidate),
    )
  }

  beforeEach(() => {
    tester.init([])
  })

  test('overview', async function () {
    for (const { filepath, title } of filepaths) {
      const pieces = await fs.readJSON(filepath)
      const result: Array<{ currentPlayer: number; scoreForPlayer: number; score: number }> = []
      tester.init([])

      for (const { r, c, p } of pieces) {
        const posId: number = tester.context.idx(r, c)
        result.push({ currentPlayer: 0, scoreForPlayer: 0, score: tester.score(0, 0) })
        result.push({ currentPlayer: 0, scoreForPlayer: 1, score: tester.score(0, 1) })
        result.push({ currentPlayer: 1, scoreForPlayer: 0, score: tester.score(1, 0) })
        result.push({ currentPlayer: 1, scoreForPlayer: 1, score: tester.score(1, 1) })
        tester.forward(posId, p)
      }
      result.push({ currentPlayer: 0, scoreForPlayer: 0, score: tester.score(0, 0) })
      result.push({ currentPlayer: 0, scoreForPlayer: 1, score: tester.score(0, 1) })
      result.push({ currentPlayer: 1, scoreForPlayer: 0, score: tester.score(1, 0) })
      result.push({ currentPlayer: 1, scoreForPlayer: 1, score: tester.score(1, 1) })

      expect(result).toMatchSnapshot(title)
    }
  })

  test('isFinal', () => {
    const posId0 = tester.context.idx(6, 6)
    for (const dirType of fullDirectionTypes) {
      const posId1: number = tester.context.fastMove(posId0, dirType, 1)
      const posId2: number = tester.context.fastMove(posId0, dirType, 2)
      const posId3: number = tester.context.fastMove(posId0, dirType, 3)
      const posId4: number = tester.context.fastMove(posId0, dirType, 4)
      const posId5: number = tester.context.fastMove(posId0, dirType, 5)
      for (let playerId = 0; playerId < 2; ++playerId) {
        const message = `[dirType, playerId]: ${[dirType, playerId].join(', ')}`
        tester.init([])
        expect([message, tester.isFinal()]).toEqual([message, false])
        tester.forward(posId0, playerId)
        expect([message, tester.isFinal()]).toEqual([message, false])
        tester.forward(posId1, playerId)
        expect([message, tester.isFinal()]).toEqual([message, false])
        tester.forward(posId2, playerId)
        expect([message, tester.isFinal()]).toEqual([message, false])
        tester.forward(posId3, playerId)
        expect([message, tester.isFinal()]).toEqual([message, false])
        tester.forward(posId4, playerId)
        expect([message, tester.isFinal()]).toEqual([message, true])
        tester.forward(posId5, playerId)
        expect([message, tester.isFinal()]).toEqual([message, true])
        tester.revert(posId3)
        expect([message, tester.isFinal()]).toEqual([message, false])
        tester.forward(posId3, playerId ^ 1)
        expect([message, tester.isFinal()]).toEqual([message, false])
        tester.revert(posId3)
        expect([message, tester.isFinal()]).toEqual([message, false])
        tester.forward(posId3, playerId)
        expect([message, tester.isFinal()]).toEqual([message, true])
        expect([message, tester.isWin(playerId)]).toEqual([message, true])
        expect([message, tester.isWin(playerId ^ 1)]).toEqual([message, false])
        expect([message, tester.isDraw()]).toEqual([message, false])
      }
    }
  })

  test('candidate ids', async function () {
    const getCandidateIds = (nextPlayer: number): number[] => {
      return tester
        .expand(nextPlayer)
        .sort(compareCandidate)
        .map(candidate => candidate.id)
    }

    for (const { filepath, title } of filepaths) {
      tester.init([])
      expect([title, getCandidateIds(0)]).toEqual([title, [112]])
      expect([title, getCandidateIds(1)]).toEqual([title, [112]])
      const pieces = await fs.readJSON(filepath)
      for (const { r, c, p } of pieces) {
        const id: number = tester.context.idx(r, c)
        tester.forward(id, p)
        const candidateIds: number[] = tester.$getCandidateIds()
        const message = `${title} id=${id}`
        expect([message, getCandidateIds(0)]).toEqual([message, candidateIds])
        expect([message, getCandidateIds(1)]).toEqual([message, candidateIds])
        tester.revert(id)
        expect([message, getCandidateIds(0)]).toEqual([message, tester.$getCandidateIds()])
        expect([message, getCandidateIds(1)]).toEqual([message, tester.$getCandidateIds()])
        tester.forward(id, p)
      }

      for (let id = 0; id < tester.context.TOTAL_POS; ++id) {
        const message = `${title} id=${id}`
        tester.revert(id)
        const candidateIds: number[] = tester.$getCandidateIds()
        expect([message, getCandidateIds(0)]).toEqual([message, candidateIds])
        expect([message, getCandidateIds(1)]).toEqual([message, candidateIds])
      }
    }
  })

  test('candidates -- init all', async function () {
    tester.init([])
    expect(tester.expand(0)).toEqual([{ id: tester.context.MIDDLE_POS, score: 96 }])
    expect(tester.expand(1)).toEqual([{ id: tester.context.MIDDLE_POS, score: 96 }])

    for (const { filepath } of filepaths) {
      const pieces = await fs.readJSON(filepath)
      tester.init(pieces)
      checkCandidates(0)
      checkCandidates(1)
    }
  })

  test('candidates -- step by step', async function () {
    for (const { filepath } of filepaths) {
      tester.init([])
      const pieces = await fs.readJSON(filepath)
      for (const { r, c, p } of pieces) {
        const id: number = tester.context.idx(r, c)
        tester.forward(id, p)
        checkCandidates(0)
        checkCandidates(1)
      }
    }
  })

  test('pieces.1', async function () {
    const pieces = await import('./fixtures/15x15/pieces.1.json')
    tester.init(pieces.default)
    const candidates = tester.expand(0)
    expect(candidates.length).toEqual(53)
  })

  test('edge case', function () {
    tester.init([])
    {
      const board = Array.from(tester.context.board)
      tester.revert(0)
      tester.revert(-1)
      expect(tester.context.board).toEqual(board)
    }

    let player = 0
    for (let id = 0; id < tester.context.TOTAL_POS; ++id) {
      tester.forward(id, player)
      player ^= 1
    }

    expect(tester.expand(0)).toEqual([])
    expect(tester.isFinal()).toEqual(true)

    {
      const board = Array.from(tester.context.board)
      tester.forward(0, 0)
      tester.forward(-1, 0)
      expect(tester.context.board).toEqual(board)
    }
  })
})
