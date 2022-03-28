import type { GomokuContext } from './GomokuContext'
import { GomokuCountMap } from './GomokuCountMap'
import type { IGomokuCandidateState, IGomokuPiece, IScoreMap } from './types'

export class GomokuState {
  protected readonly context: GomokuContext
  protected readonly countMap: GomokuCountMap
  protected readonly candidateSet: Set<number>

  constructor(context: GomokuContext, scoreMap: IScoreMap) {
    this.context = context
    this.countMap = new GomokuCountMap(context, scoreMap)
    this.candidateSet = new Set<number>()
  }

  public init(pieces: ReadonlyArray<IGomokuPiece> = []): void {
    const { context, countMap, candidateSet } = this

    context.init(pieces)
    countMap.init()
    candidateSet.clear()
  }

  public forward(id: number, player: number): void {
    if (id < 0 || this.context.board[id] >= 0) return
    this._forward(id, player)

    const { context, candidateSet } = this
    candidateSet.delete(id)
    for (const [id2] of context.validNeighbors(id)) candidateSet.delete(id2)
  }

  public rollback(id: number): void {
    if (id < 0 || this.context.board[id] < 0) return
    this._rollback(id)

    const { context, candidateSet } = this
    candidateSet.add(id)
    for (const [id2] of context.validNeighbors(id)) {
      if (context.hasPlacedNeighbors(id2)) continue
      candidateSet.delete(id2)
    }
  }

  public expand(nextPlayer: number, candidates: IGomokuCandidateState[]): number {
    const { countMap, candidateSet } = this
    candidateSet.add(this.context.MIDDLE_POS)

    let i = 0
    for (const id of candidateSet) {
      const score = countMap.scoreForCandidate(nextPlayer, id)
      // eslint-disable-next-line no-param-reassign
      candidates[i] = { id, score }
      i += 1
    }
    return i
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
