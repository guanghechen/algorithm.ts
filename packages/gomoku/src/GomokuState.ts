import { gomokuDirectionTypes } from './constant'
import type { GomokuContext } from './GomokuContext'
import { GomokuCountMap } from './GomokuCountMap'
import type { IGomokuCandidateState, IGomokuPiece, IScoreMap } from './types'

type ICandidateScore = [s00: number, s01: number, s10: number, s11: number]

export class GomokuState {
  protected readonly context: GomokuContext
  protected readonly countMap: GomokuCountMap
  protected readonly candidateMap: Map<number, ICandidateScore>

  constructor(context: GomokuContext, scoreMap: IScoreMap) {
    this.context = context
    this.countMap = new GomokuCountMap(context, scoreMap)
    this.candidateMap = new Map<number, ICandidateScore>()
  }

  public init(pieces: ReadonlyArray<IGomokuPiece> = []): void {
    const { context, countMap, candidateMap } = this

    context.init(pieces)
    countMap.init()

    candidateMap.clear()
    const stateScore0: number = this.countMap.score(0)
    const stateScore1: number = this.countMap.score(1)
    for (const { r, c } of pieces) {
      const id: number = context.idx(r, c)
      for (const [id2] of context.validNeighbors(id)) {
        if (context.board[id2] < 0) {
          candidateMap.set(id2, this._scoreForCandidate(stateScore0, stateScore1, id2))
        }
      }
    }

    // Always regard the middle position of the board as a candidate.
    const midId: number = context.TOTAL_POS >> 1
    if (context.board[midId] < 0 && !candidateMap.has(midId)) {
      candidateMap.set(midId, this._scoreForCandidate(stateScore0, stateScore1, midId))
    }
  }

  public forward(id: number, player: number): void {
    const { context, candidateMap } = this
    if (id < 0 || context.board[id] >= 0) return

    this._beforeForward(id)
    context.forward(id, player)
    this._afterForward(id)

    candidateMap.delete(id)
    for (const [id2] of context.validNeighbors(id)) {
      if (context.board[id2] < 0) candidateMap.set(id2, [0, 0, 0, 0])
    }
    const stateScore0: number = this.countMap.score(0)
    const stateScore1: number = this.countMap.score(1)
    this._reAppriseCandidates(stateScore0, stateScore1, id)
  }

  public rollback(id: number): void {
    const { context, candidateMap } = this
    if (id < 0 || context.board[id] < 0) return

    this._beforeRollback(id)
    context.rollback(id)
    this._afterRollback(id)

    if (context.hasPlacedNeighbors(id)) candidateMap.set(id, [0, 0, 0, 0])
    for (const [id2] of context.validNeighbors(id)) {
      if (context.board[id2] >= 0 || !context.hasPlacedNeighbors(id2)) candidateMap.delete(id2)
    }
    const stateScore0: number = this.countMap.score(0)
    const stateScore1: number = this.countMap.score(1)
    this._reAppriseCandidates(stateScore0, stateScore1, id)
  }

  public expand(nextPlayer: number, scoreForPlayer: number): IGomokuCandidateState[] {
    const { context, candidateMap } = this
    const nextMoverFac: number = 1 + context.nextMoverBuffer
    const player0: number = (1 << nextPlayer) | scoreForPlayer
    const player1: number = player0 ^ 1
    const candidates: IGomokuCandidateState[] = []
    for (const [id, candidateScore] of candidateMap.entries()) {
      /* istanbul ignore next */
      if (context.board[id] >= 0) continue

      const score0: number = candidateScore[player0]
      const score1: number = candidateScore[player1]
      const score: number =
        nextPlayer === scoreForPlayer
          ? score0 - score1 * nextMoverFac
          : score0 * nextMoverFac - score1
      candidates.push({ id, score })
    }
    return candidates
  }

  // Get score of current state.
  public score(currentPlayer: number, scoreForPlayer: number): number {
    const score0: number = this.countMap.score(scoreForPlayer)
    const score1: number = this.countMap.score(scoreForPlayer ^ 1)
    const nextMoverFac: number = 1 + this.context.nextMoverBuffer
    return currentPlayer === scoreForPlayer
      ? score0 - score1 * nextMoverFac
      : score0 * nextMoverFac - score1
  }

  // Check if it's endgame.
  public isFinal(): boolean {
    const { context, countMap } = this
    if (context.placedCount === context.TOTAL_POS) return true
    if (countMap.hasReachedTheLimit(0) || countMap.hasReachedTheLimit(1)) return true
    return false
  }

  protected _scoreForCandidate(
    stateScore0: number,
    stateScore1: number,
    id: number,
  ): ICandidateScore {
    const result: ICandidateScore = [0, 0, 0, 0]
    const { context, countMap } = this
    for (let p = 0; p < 2; ++p) {
      this._beforeForward(id)
      context.forward(id, p)
      this._afterForward(id)

      result[p << 1] = countMap.score(0) - stateScore0
      result[(p << 1) | 1] = countMap.score(1) - stateScore1

      this._beforeRollback(id)
      context.rollback(id)
      this._afterRollback(id)
    }
    return result
  }

  protected _reAppriseCandidates(stateScore0: number, stateScore1: number, centerId: number): void {
    const { context } = this
    if (this.candidateMap.has(centerId)) {
      const score = this._scoreForCandidate(stateScore0, stateScore1, centerId)
      this.candidateMap.set(centerId, score)
    }

    const THRESHOLD: number = context.MAX_INLINE - 1
    for (const dirType of gomokuDirectionTypes) {
      let id: number = centerId
      const maxStep: number = Math.min(THRESHOLD, context.maxMovableSteps(id, dirType))
      for (let step = 0; step < maxStep; ++step) {
        id = context.fastMoveOneStep(id, dirType)
        if (this.candidateMap.has(id)) {
          const score = this._scoreForCandidate(stateScore0, stateScore1, id)
          this.candidateMap.set(id, score)
        }
      }
    }
  }

  protected _beforeForward(id: number): void {
    this.countMap.beforeForward(id)
  }

  protected _afterForward(id: number): void {
    this.countMap.afterForward(id)
  }

  protected _beforeRollback(id: number): void {
    this.countMap.beforeRollback(id)
  }

  protected _afterRollback(id: number): void {
    this.countMap.afterRollback(id)
  }
}
