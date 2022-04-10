export interface IGomokuPiece {
  r: number // row number
  c: number // column number
  p: number // player: should be positive integer.
}

export interface IGomokuCandidateState {
  posId: number // The value after encoding the coordinates of the piece.
  score: number // Diff score for first player
}

export type IShapeCount = [
  noSideAvailable: number,
  oneSideAvailable: number,
  twoSideAvailable: number,
]

export type IShapeCountScore = IShapeCount[]

export interface IShapeScoreMap {
  con: IShapeCountScore
  gap: IShapeCountScore
}

export type IGomokuBoard = number[]

export interface IDirCounter {
  playerId: number
  count: number
}

export interface IMinimaxSearcherContext {
  /**
   * The own player.
   */
  readonly ownPlayerId: number

  /**
   * Initialize context.
   * @param ownPlayerId
   */
  init(ownPlayerId: number): void

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

export interface IMinimaxSearcher {
  /**
   *
   * @param playerId  Identifier of next mover.
   * @param alpha     Minimum expected score
   * @param beta      Maximum expected score
   * @param cur       Current search depth
   */
  search(playerId: number, alpha: number, beta: number, cur: number): number
}
