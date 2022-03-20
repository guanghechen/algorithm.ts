import type { GomokuContext } from './GomokuContext'
import { GomokuCountMap } from './GomokuCountMap'
import type { IGomokuCandidateState, IGomokuPiece, IScoreMap } from './types'

export class GomokuState {
  protected readonly context: GomokuContext
  protected readonly board: Int32Array
  protected readonly countMap: GomokuCountMap
  protected readonly candidateSet: Set<number>
  protected placedCount: number

  constructor(context: GomokuContext, scoreMap: IScoreMap, NEXT_MOVER_FAC?: number) {
    this.context = context
    this.board = new Int32Array(context.TOTAL_POS)
    this.countMap = new GomokuCountMap(context, this.board, scoreMap, NEXT_MOVER_FAC)
    this.candidateSet = new Set<number>()
    this.placedCount = 0
  }

  public init(pieces: ReadonlyArray<IGomokuPiece> = []): void {
    const { context, board, candidateSet } = this

    this.placedCount = pieces.length
    board.fill(-1)
    candidateSet.clear()
    for (const { r, c, p } of pieces) {
      const id: number = context.idx(r, c)
      board[id] = p
      candidateSet.delete(id)
      context.visitValidNeighbors(r, c, (r2, c2) => {
        const id2: number = context.idx(r2, c2)
        if (board[id2] < 0) candidateSet.add(id2)
      })
    }

    // Initializing countMap should be performed after the board initialized.
    this.countMap.init()
  }

  // Place a piece in r-th row and c-th column.
  public forward(r: number, c: number, player: number): void {
    const { context, board, candidateSet } = this
    const id: number = context.idx(r, c)
    if (board[id] >= 0) return

    this.beforeForward(r, c)
    {
      this.placedCount += 1
      board[id] = player
      candidateSet.delete(id)
      context.visitValidNeighbors(r, c, (r2, c2) => {
        const id2: number = context.idx(r2, c2)
        if (board[id2] < 0) candidateSet.add(id2)
      })
    }
    this.afterForward(r, c)
  }

  // Remove the piece in r-th row and c-th column.
  public rollback(r: number, c: number): void {
    const { context, board, candidateSet } = this
    const id: number = context.idx(r, c)
    const player: number = board[id]
    if (player < 0) return

    this.beforeRollback(r, c)
    {
      this.placedCount -= 1
      board[id] = -1
      if (this.hasPlacedNeighbors(r, c)) candidateSet.add(id)
      context.visitValidNeighbors(r, c, (r2, c2) => {
        const id2: number = context.idx(r2, c2)
        if (board[id2] >= 0 || !this.hasPlacedNeighbors(r2, c2)) {
          candidateSet.delete(id2)
        }
      })
    }
    this.afterRollback(r, c, player)
  }

  public expand(currentPlayer: number, scoreForPlayer: number): IGomokuCandidateState[] {
    const { context, board, candidateSet } = this
    const candidates: IGomokuCandidateState[] = []
    for (const id of candidateSet) {
      if (board[id] >= 0) continue
      const [r, c] = context.reIdx(id)
      candidates.push({ r, c, score: 0 })
    }

    for (const candidate of candidates) {
      const { r, c } = candidate
      this.forward(r, c, currentPlayer)
      candidate.score = this.score(currentPlayer, scoreForPlayer)
      this.rollback(r, c)
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

  public randomMove(): { r: number; c: number } {
    const { context, board, candidateSet } = this
    let result: { r: number; c: number } | null = null
    for (const id of candidateSet) {
      const [r, c] = context.reIdx(id)
      context.visitValidNeighbors(r, c, (r2, c2) => {
        if (result) return

        const id2: number = context.idx(r2, c2)
        if (board[id2] < 0) {
          result = { r: r2, c: c2 }
        }
      })
    }
    return result ?? { r: -1, c: -1 }
  }

  protected hasPlacedNeighbors(r: number, c: number): boolean {
    const { context, board } = this
    return context.hasGoodNeighbor(r, c, (r2, c2): boolean => {
      const id2: number = context.idx(r2, c2)
      return board[id2] >= 0
    })
  }

  protected beforeForward(r: number, c: number): void {
    this.countMap.beforeForward(r, c)
  }

  protected afterForward(r: number, c: number): void {
    this.countMap.afterForward(r, c)
  }

  protected beforeRollback(r: number, c: number): void {
    this.countMap.beforeRollback(r, c)
  }

  protected afterRollback(r: number, c: number, player: number): void {
    this.countMap.afterRollback(r, c, player)
  }
}
