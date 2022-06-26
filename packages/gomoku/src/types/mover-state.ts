import type { IGomokuCandidateState } from './misc'
import type { IGomokuMoverStep } from './mover'

export interface IGomokuMoverState extends IGomokuMoverStep {
  /**
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
