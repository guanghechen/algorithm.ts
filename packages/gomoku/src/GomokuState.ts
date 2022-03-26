import type { GomokuContext } from './GomokuContext'
import { GomokuCountMap } from './GomokuCountMap'
import type { IGomokuBoard, IGomokuCandidateState, IGomokuPiece, IScoreMap } from './types'

export class GomokuState {
  protected readonly context: GomokuContext
  protected readonly countMap: GomokuCountMap
  protected readonly candidateSet: Set<number>
  protected readonly board: IGomokuBoard
  protected placedCount: number

  constructor(context: GomokuContext, scoreMap: IScoreMap) {
    this.context = context
    this.board = new Int32Array(context.TOTAL_POS)
    this.countMap = new GomokuCountMap(context, this.board, scoreMap)
    this.candidateSet = new Set<number>()
    this.placedCount = 0
  }

  public init(pieces: ReadonlyArray<IGomokuPiece> = []): void {
    const { context, board, candidateSet } = this

    this.placedCount = pieces.length
    board.fill(-1)
    candidateSet.clear()
    candidateSet.add(context.TOTAL_POS >> 1)

    for (const { r, c, p } of pieces) {
      const id: number = context.idx(r, c)
      board[id] = p
      candidateSet.delete(id)
      for (const [id2] of context.validNeighbors(id)) {
        if (board[id2] < 0) candidateSet.add(id2)
      }
    }

    // Initializing countMap should be performed after the board initialized.
    this.countMap.init()
  }

  public forward(id: number, player: number): void {
    const { context, board, candidateSet } = this
    if (id < 0 || board[id] >= 0) return

    this.beforeForward(id)
    {
      this.placedCount += 1
      board[id] = player
      candidateSet.delete(id)
      for (const [id2] of context.validNeighbors(id)) {
        if (board[id2] < 0) candidateSet.add(id2)
      }
    }
    this.afterForward(id)
  }

  public rollback(id: number): void {
    const { context, board, candidateSet } = this
    if (id < 0 || board[id] < 0) return

    const player: number = board[id]
    this.beforeRollback(id)
    {
      this.placedCount -= 1
      board[id] = -1
      if (this.hasPlacedNeighbors(id)) candidateSet.add(id)
      for (const [id2] of context.validNeighbors(id)) {
        if (board[id2] >= 0 || !this.hasPlacedNeighbors(id2)) {
          candidateSet.delete(id2)
        }
      }
    }
    this.afterRollback(id, player)
  }

  public expand(currentPlayer: number, scoreForPlayer: number): IGomokuCandidateState[] {
    const { board, candidateSet } = this
    const candidates: IGomokuCandidateState[] = []
    for (const id of candidateSet) {
      /* istanbul ignore next */
      if (board[id] >= 0) continue
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
    const { context, countMap, placedCount } = this
    if (placedCount === context.TOTAL_POS) return true
    for (let player = 0; player < context.TOTAL_PLAYERS; ++player) {
      if (countMap.hasReachedTheLimit(player)) return true
    }
    return false
  }

  public randomMove(): number | -1 {
    const { context, board, candidateSet } = this
    for (const id of candidateSet) {
      for (const [id2] of context.validNeighbors(id)) {
        if (board[id2] < 0) return id2
      }
    }
    return -1
  }

  protected hasPlacedNeighbors(id: number): boolean {
    const { context, board } = this
    for (const [id2] of context.validNeighbors(id)) {
      if (board[id2] >= 0) return true
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

  protected afterRollback(id: number, player: number): void {
    this.countMap.afterRollback(id, player)
  }
}
