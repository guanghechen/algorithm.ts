import type { IGomokuCandidateState } from './misc'

export interface IGomokuSearcherContext {
  /**
   * The own player.
   */
  readonly rootPlayerId: number

  /**
   * Initialize context.
   * @param rootPlayerId
   */
  init(rootPlayerId: number): void

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

  /**
   * Get candidates.
   * @param nextPlayerId
   * @param candidates
   * @param minMultipleOfTopScore
   * @param MAX_SIZE
   */
  expand(
    nextPlayerId: number,
    candidates: IGomokuCandidateState[],
    minMultipleOfTopScore: number,
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
   * Check if next move could reach the final state.
   * @param nextPlayerId
   */
  couldReachFinal(nextPlayerId: number): boolean
}
