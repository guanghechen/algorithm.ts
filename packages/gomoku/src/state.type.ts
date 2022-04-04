import type { IGomokuCandidateState, IGomokuPiece } from './types'

export interface IGomokuState {
  /**
   * Initialize state with given pieces.
   */
  init(pieces: ReadonlyArray<IGomokuPiece>): void

  /**
   * Place a piece on the given position.
   * @param posId
   */
  forward(posId: number): void

  /**
   * Remove the piece from the given position.
   * @param posId
   */
  revert(posId: number): void

  /**
   *
   * @param nextPlayer
   * @param candidates
   */
  expand(nextPlayer: number, candidates: IGomokuCandidateState[]): number

  /**
   * Get top candidate
   * @param nextPlayerId
   */
  topCandidate(nextPlayerId: number): IGomokuCandidateState | undefined

  /**
   *
   * @param currentPlayer
   * @param scoreForPlayer
   */
  score(currentPlayer: number, scoreForPlayer: number): number

  /**
   *
   * @param currentPlayer
   */
  isWin(currentPlayer: number): boolean

  /**
   *
   */
  isDraw(): boolean

  /**
   *
   */
  isFinal(): boolean
}
