import type { IGomokuMoverStep } from './mover'

export interface IGomokuMoverCounter extends IGomokuMoverStep {
  /**
   * Win position set.
   * @param playerId
   */
  mustWinPosSet(playerId: number): Iterable<number> & { size: number }

  /**
   *
   * @param playerId
   * @param posId
   */
  candidateCouldReachFinal(playerId: number, posId: number): boolean
}
