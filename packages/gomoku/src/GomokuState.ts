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
    const { context, candidateSet } = this

    context.init(pieces)
    candidateSet.clear()
    candidateSet.add(context.TOTAL_POS >> 1)
    for (const { r, c } of pieces) {
      const id: number = context.idx(r, c)
      candidateSet.delete(id)
      for (const [id2] of context.validNeighbors(id)) {
        if (context.board[id2] < 0) candidateSet.add(id2)
      }
    }

    // Initializing countMap should be performed after the board initialized.
    this.countMap.init()
  }

  public forward(id: number, player: number): void {
    const { context, candidateSet } = this
    if (id < 0 || context.board[id] >= 0) return

    this.beforeForward(id)
    {
      context.forward(id, player)
      candidateSet.delete(id)
      for (const [id2] of context.validNeighbors(id)) {
        if (context.board[id2] < 0) candidateSet.add(id2)
      }
    }
    this.afterForward(id)
  }

  public rollback(id: number): void {
    const { context, candidateSet } = this
    if (id < 0 || context.board[id] < 0) return

    this.beforeRollback(id)
    {
      context.rollback(id)
      if (context.hasPlacedNeighbors(id)) candidateSet.add(id)
      for (const [id2] of context.validNeighbors(id)) {
        if (context.board[id2] >= 0 || !context.hasPlacedNeighbors(id2)) {
          candidateSet.delete(id2)
        }
      }
    }
    this.afterRollback(id)
  }

  public expand(currentPlayer: number, scoreForPlayer: number): IGomokuCandidateState[] {
    const { context, candidateSet } = this
    const candidates: IGomokuCandidateState[] = []
    for (const id of candidateSet) {
      /* istanbul ignore next */
      if (context.board[id] >= 0) continue
      candidates.push({ id, score: 0 })
    }

    for (const candidate of candidates) {
      this.forward(candidate.id, currentPlayer)
      candidate.score = this.score(currentPlayer, scoreForPlayer)
      this.rollback(candidate.id)
    }
    return candidates
  }

  // Get score of current state.
  public score(currentPlayer: number, scoreForPlayer: number): number {
    return (
      this.countMap.score(currentPlayer, scoreForPlayer) -
      this.countMap.score(currentPlayer, scoreForPlayer ^ 1)
    )
  }

  // Check if it's endgame.
  public isFinal(): boolean {
    const { context, countMap } = this
    if (context.placedCount === context.TOTAL_POS) return true
    for (let player = 0; player < context.TOTAL_PLAYERS; ++player) {
      if (countMap.hasReachedTheLimit(player)) return true
    }
    return false
  }

  protected beforeForward(id: number): void {
    this.countMap.beforeForward(id)
  }

  protected afterForward(id: number): void {
    this.countMap.afterForward(id)
  }

  protected beforeRollback(id: number): void {
    this.countMap.beforeRollback(id)
  }

  protected afterRollback(id: number): void {
    this.countMap.afterRollback(id)
  }
}
