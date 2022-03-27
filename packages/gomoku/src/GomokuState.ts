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
        if (context.board[id2] < 0 && !candidateMap.has(id2)) {
          const score = this._scoreForCandidate(stateScore0, stateScore1, id2)
          candidateMap.set(id2, score)
        }
      }
    }
  }

  public forward(id: number, player: number): void {
    const { context, candidateMap } = this
    if (id < 0 || context.board[id] >= 0) return

    // forward
    this._forward(id, player)

    candidateMap.delete(id)
    for (const [id2] of context.validNeighbors(id)) {
      if (context.board[id2] < 0 && !candidateMap.has(id2)) candidateMap.set(id2, [0, 0, 0, 0])
    }
    this._reAppriseCandidates(id)
  }

  public rollback(id: number): void {
    const { context, candidateMap } = this
    if (id < 0 || context.board[id] < 0) return

    // rollback
    this._rollback(id)

    if (context.hasPlacedNeighbors(id)) candidateMap.set(id, [0, 0, 0, 0])
    for (const [id2] of context.validNeighbors(id)) {
      if (context.board[id2] >= 0 || !context.hasPlacedNeighbors(id2)) {
        candidateMap.delete(id2)
      }
    }
    this._reAppriseCandidates(id)
  }

  public expand(nextPlayer: number, scoreForPlayer: number): IGomokuCandidateState[] {
    const { context, countMap, candidateMap } = this
    const stateScore0: number = countMap.score(0)
    const stateScore1: number = countMap.score(1)

    // Always regard the middle position of the board as a candidate.
    if (context.board[context.MIDDLE_POS] < 0 && !candidateMap.has(context.MIDDLE_POS)) {
      candidateMap.set(
        context.MIDDLE_POS,
        this._scoreForCandidate(stateScore0, stateScore1, context.MIDDLE_POS),
      )
    }

    const player0: number = nextPlayer << 1
    const player1: number = player0 ^ 1
    const nextMoverFac: number = 1 + context.nextMoverBuffer
    const candidates: IGomokuCandidateState[] = []
    for (const [id, candidateScore] of candidateMap.entries()) {
      /* istanbul ignore next */
      if (context.board[id] >= 0) continue

      const scores: [number, number] = [
        stateScore0 + candidateScore[player0],
        stateScore1 + candidateScore[player1],
      ]
      const score0: number = scores[scoreForPlayer]
      const score1: number = scores[scoreForPlayer ^ 1]
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

  // Check if is win.
  public isWin(currentPlayer: number): boolean {
    return this.countMap.hasReachedTheLimit(currentPlayer)
  }

  // Check if the game is draw.
  public isDraw(): boolean {
    return this.context.placedCount === this.context.TOTAL_POS
  }

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

  protected _reAppriseCandidates(centerId: number): void {
    const { context, countMap, candidateMap } = this
    const stateScore0: number = countMap.score(0)
    const stateScore1: number = countMap.score(1)
    if (this.candidateMap.has(centerId)) {
      const score = this._scoreForCandidate(stateScore0, stateScore1, centerId)
      candidateMap.set(centerId, score)
    }

    const THRESHOLD: number = context.MAX_INLINE * 2 - 3
    for (const dirType of gomokuDirectionTypes) {
      let id: number = centerId
      const maxStep: number = Math.min(THRESHOLD, context.maxMovableSteps(id, dirType))
      for (let step = 0; step < maxStep; ++step) {
        id = context.fastMoveOneStep(id, dirType)
        if (candidateMap.has(id)) {
          const score = this._scoreForCandidate(stateScore0, stateScore1, id)
          candidateMap.set(id, score)
        }
      }
    }
  }

  protected _forward(id: number, player: number): void {
    this._beforeForward(id)
    this.context.forward(id, player)
    this._afterForward(id)
  }

  protected _rollback(id: number): void {
    this._beforeRollback(id)
    this.context.rollback(id)
    this._afterRollback(id)
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
