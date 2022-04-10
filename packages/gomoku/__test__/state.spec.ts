import fs from 'fs-extra'
import type { GomokuDirectionType, IGomokuCandidateState, IGomokuPiece } from '../src'
import {
  GomokuContext,
  GomokuCountMap,
  GomokuDirectionTypes,
  GomokuState,
  createScoreMap,
} from '../src'
import { PieceDataDirName, locatePieceDataFilepaths } from './util'

const { full: fullDirectionTypes, rightHalf: halfDirectionTypes } = GomokuDirectionTypes

type IGomokuCandidate = IGomokuCandidateState
const compareCandidate = (x: IGomokuCandidate, y: IGomokuCandidate): number => x.posId - y.posId
class TestHelper extends GomokuState {
  constructor(MAX_ROW: number, MAX_COL: number) {
    const context = new GomokuContext({
      MAX_ROW,
      MAX_COL,
      MAX_ADJACENT: 5,
      MAX_DISTANCE_OF_NEIGHBOR: 2,
    })
    super({
      context,
      countMap: new GomokuCountMap(context),
      scoreMap: createScoreMap(context.MAX_ADJACENT),
    })
  }

  public override init(pieces: ReadonlyArray<IGomokuPiece>): void {
    this.context.init(pieces)
    this.countMap.init()
    super.init(pieces)
  }

  // @ts-ignore
  public override forward(posId: number, playerId: number): void {
    if (this.context.forward(posId, playerId)) {
      this.countMap.forward(posId)
      super.forward(posId)
    }
  }

  public override revert(posId: number): void {
    if (this.context.revert(posId)) {
      this.countMap.revert(posId)
      super.revert(posId)
    }
  }

  // @ts-ignore
  public override expand(nextPlayer: number, minMultipleOfTopScore: number): IGomokuCandidate[] {
    const candidates: IGomokuCandidateState[] = []
    super.expand(nextPlayer, candidates, minMultipleOfTopScore)
    return candidates.map(({ posId, score }) => ({ posId, score }))
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

  public $getCandidateIds(nextPlayerId: number, minMultipleOfTopScore: number): number[] {
    const { context, countMap, _candidateSet } = this
    const candidateSet: Set<number> = new Set()
    for (let id = 0; id < context.TOTAL_POS; ++id) {
      if (context.board[id] < 0) {
        if (context.hasPlacedNeighbors(id)) candidateSet.add(id)
      }
    }
    if (countMap.mustDropPos(nextPlayerId)) {
      for (const posId of _candidateSet) {
        if (countMap.candidateCouldReachFinal(nextPlayerId, posId)) {
          return [posId]
        }
      }
    }
    if (countMap.mustDropPos(nextPlayerId ^ 1)) {
      const playerId: number = nextPlayerId ^ 1
      for (const posId of _candidateSet) {
        if (countMap.candidateCouldReachFinal(playerId, posId)) {
          return [posId]
        }
      }
    }
    if (context.board[context.MIDDLE_POS] < 0) candidateSet.add(context.MIDDLE_POS)

    const candidates = Array.from(candidateSet)
      .map(posId => ({
        posId,
        score: this.$evaluateCandidate(nextPlayerId, posId),
      }))
      .sort((x, y) => y.score - x.score)
    if (candidates.length <= 0) return []

    const topCandidate = candidates[0]
    return candidates
      .filter(candidate => candidate.score * minMultipleOfTopScore >= topCandidate.score)
      .map(candidate => candidate.posId)
  }

  public $getCandidates(nextPlayerId: number, minMultipleOfTopScore: number): IGomokuCandidate[] {
    const { countMap, _candidateSet } = this

    if (countMap.mustDropPos(nextPlayerId)) {
      for (const posId of _candidateSet) {
        if (countMap.candidateCouldReachFinal(nextPlayerId, posId)) {
          return [{ posId, score: Number.MAX_VALUE }]
        }
      }
    }
    if (countMap.mustDropPos(nextPlayerId ^ 1)) {
      const playerId: number = nextPlayerId ^ 1
      for (const posId of _candidateSet) {
        if (countMap.candidateCouldReachFinal(playerId, posId)) {
          return [{ posId, score: Number.MAX_VALUE }]
        }
      }
    }

    const candidates: IGomokuCandidate[] = []
    const candidateIds: number[] = this.$getCandidateIds(nextPlayerId, minMultipleOfTopScore)
    for (const posId of candidateIds) {
      const score = this.$evaluateCandidate(nextPlayerId, posId)
      candidates.push({ posId, score })
    }
    return candidates
  }

  public $evaluateCandidate(nextPlayerId: number, posId: number): number {
    const { NEXT_MOVER_BUFFER, context } = this
    let prevScore0 = 0
    let prevScore1 = 0
    for (const dirType of halfDirectionTypes) {
      const startPosId: number = context.getStartPosId(posId, dirType)
      const { score: score0 } = this._evaluateScoreInDirection(0, startPosId, dirType)
      const { score: score1 } = this._evaluateScoreInDirection(1, startPosId, dirType)
      prevScore0 += score0
      prevScore1 += score1
    }

    let score0 = 0
    this._temporaryForward(posId, 0)
    for (const dirType of halfDirectionTypes) {
      const startPosId: number = context.getStartPosId(posId, dirType)
      const { score } = this._evaluateScoreInDirection(0, startPosId, dirType)
      score0 += score
    }
    this._temporaryRevert(posId)

    let score1 = 0
    this._temporaryForward(posId, 1)
    for (const dirType of halfDirectionTypes) {
      const startPosId: number = context.getStartPosId(posId, dirType)
      const { score } = this._evaluateScoreInDirection(1, startPosId, dirType)
      score1 += score
    }
    this._temporaryRevert(posId)

    const deltaScore0: number = score0 - prevScore0
    const deltaScore1: number = score1 - prevScore1
    const score: number =
      nextPlayerId === 0
        ? deltaScore0 * NEXT_MOVER_BUFFER + deltaScore1
        : deltaScore0 + deltaScore1 * NEXT_MOVER_BUFFER
    return score
  }
}

describe('15x15', function () {
  const tester = new TestHelper(15, 15)
  const filepaths = locatePieceDataFilepaths(PieceDataDirName.d15x15)

  const checkCandidateIds = (message: string, nextPlayerId: number): void => {
    const candidates = tester.expand(nextPlayerId, 16)
    const candidateIds = candidates.map(candidate => candidate.posId).sort((x, y) => x - y)
    const $candidateIds = tester.$getCandidateIds(nextPlayerId, 16).sort((x, y) => x - y)

    if (candidateIds.length === 1 && candidateIds[0] !== $candidateIds[0]) {
      const posId = candidateIds[0]
      expect([
        message,
        tester.$candidateCouldReachFinal(0, posId) || tester.$candidateCouldReachFinal(1, posId),
      ]).toEqual([message, true])
      return
    }

    expect([message, candidateIds]).toEqual([message, $candidateIds])
  }

  const checkCandidates = (nextPlayerId: number): void => {
    const candidates = tester.expand(nextPlayerId, 16)
    const $candidates = tester.$getCandidates(nextPlayerId, 16)

    if (candidates.length === 1 && candidates[0].posId !== $candidates[0].posId) {
      const posId = candidates[0].posId
      expect(
        tester.$candidateCouldReachFinal(0, posId) || tester.$candidateCouldReachFinal(1, posId),
      ).toEqual(true)
      return
    }

    for (let i = 1; i < candidates.length; ++i) {
      expect(candidates[i].score).toBeLessThanOrEqual(candidates[i - 1].score)
    }
    expect(candidates.sort(compareCandidate)).toEqual($candidates.sort(compareCandidate))
  }
  const checkTopCandidate = (nextPlayerId: number): void => {
    const $candidates = tester.$getCandidates(nextPlayerId, Number.MAX_SAFE_INTEGER)
    const candidate = tester.topCandidate(nextPlayerId)!
    expect($candidates.every($candidate => $candidate.score <= candidate.score)).toEqual(true)
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
        tester.init([
          { r: tester.context.revIdx(posId0)[0], c: tester.context.revIdx(posId0)[1], p: playerId },
          { r: tester.context.revIdx(posId1)[0], c: tester.context.revIdx(posId1)[1], p: playerId },
          { r: tester.context.revIdx(posId2)[0], c: tester.context.revIdx(posId2)[1], p: playerId },
          { r: tester.context.revIdx(posId3)[0], c: tester.context.revIdx(posId3)[1], p: playerId },
          { r: tester.context.revIdx(posId4)[0], c: tester.context.revIdx(posId4)[1], p: playerId },
        ])
        expect(tester.isFinal()).toEqual(true)

        tester.init([
          { r: tester.context.revIdx(posId0)[0], c: tester.context.revIdx(posId0)[1], p: playerId },
          { r: tester.context.revIdx(posId1)[0], c: tester.context.revIdx(posId1)[1], p: playerId },
          { r: tester.context.revIdx(posId2)[0], c: tester.context.revIdx(posId2)[1], p: playerId },
          { r: tester.context.revIdx(posId3)[0], c: tester.context.revIdx(posId3)[1], p: playerId },
        ])
        tester.forward(posId4, playerId)
        expect([message, tester.isFinal()]).toEqual([message, true])
      }

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
        .expand(nextPlayer, Number.MAX_SAFE_INTEGER)
        .sort(compareCandidate)
        .map(candidate => candidate.posId)
    }

    for (const { filepath, title } of filepaths) {
      tester.init([])
      expect([title, getCandidateIds(0)]).toEqual([title, [112]])
      expect([title, getCandidateIds(1)]).toEqual([title, [112]])
      const pieces = await fs.readJSON(filepath)
      for (const { r, c, p } of pieces) {
        const id: number = tester.context.idx(r, c)
        tester.forward(id, p)
        const message = `${title} id=${id}`
        checkCandidateIds(message, 0)
        checkCandidateIds(message, 1)
        tester.revert(id)
        checkCandidateIds(message, 0)
        checkCandidateIds(message, 1)
        tester.forward(id, p)
      }

      for (let id = 0; id < tester.context.TOTAL_POS; ++id) {
        const message = `${title} id=${id}`
        tester.revert(id)
        checkCandidateIds(message, 0)
        checkCandidateIds(message, 1)
      }
    }
  })

  test('candidates -- init all', async function () {
    tester.init([])
    expect(tester.expand(0, Number.MAX_SAFE_INTEGER)).toEqual([
      { posId: tester.context.MIDDLE_POS, score: 828 },
    ])
    expect(tester.expand(1, Number.MAX_SAFE_INTEGER)).toEqual([
      { posId: tester.context.MIDDLE_POS, score: 828 },
    ])

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

  test('topCandidate', async function () {
    for (const { filepath } of filepaths) {
      tester.init([])
      const pieces = await fs.readJSON(filepath)
      for (const { r, c, p } of pieces) {
        const id: number = tester.context.idx(r, c)
        tester.forward(id, p)
        checkTopCandidate(0)
        checkTopCandidate(1)
      }
    }
  })

  test('pieces.1', async function () {
    const pieces = await import('./fixtures/15x15/pieces.1.json')
    tester.init(pieces.default)
    const candidates = tester.expand(0, Number.MAX_SAFE_INTEGER)
    expect(candidates.length).toEqual(1)
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

    expect(tester.expand(0, Number.MAX_SAFE_INTEGER)).toEqual([])
    expect(tester.isFinal()).toEqual(true)

    {
      const board = Array.from(tester.context.board)
      tester.forward(0, 0)
      tester.forward(-1, 0)
      expect(tester.context.board).toEqual(board)
    }
  })
})
