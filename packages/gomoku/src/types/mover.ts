import type { IGomokuCandidateState, IGomokuPiece } from './misc'

export interface IGomokuMoverStep {
  /**
   * Initialize context with given pieces.
   * @param pieces
   */
  init(pieces: Iterable<IGomokuPiece>): void

  /**
   * Place a piece on the given position.
   * @param posId
   * @param playerId
   */
  forward(posId: number, playerId: number): void

  /**
   * Remove the piece from the given position.
   * @param posId
   */
  revert(posId: number): void
}

export interface IGomokuMover extends IGomokuMoverStep {
  /**
   * The own player.
   */
  readonly rootPlayerId: number

  /**
   * Update rootPlayerId
   * @param rootPlayerId
   */
  resetRootPlayerId(rootPlayerId: number): void

  /**
   * Get candidates.
   * @param nextPlayerId
   * @param candidates
   * @param candidateGrowthFactor
   * @param MAX_SIZE
   */
  expand(
    nextPlayerId: number,
    candidates: IGomokuCandidateState[],
    candidateGrowthFactor: number,
    MAX_SIZE?: number,
  ): number

  /**
   * Get top candidate
   * @param nextPlayerId
   */
  topCandidate(nextPlayerId: number): IGomokuCandidateState | undefined

  /**
   * Evaluate a score for current state.
   * @param nextPlayerId
   */
  score(nextPlayerId: number): number

  /**
   * Check if the game is already end.
   */
  isFinal(): boolean

  /**
   * Check if next move could reach the final state.
   * @param nextPlayerId
   */
  couldReachFinal(nextPlayerId: number): boolean
}
