import type { GomokuDirectionType } from './constant'
import type { IDirCounter } from './types'

export interface IGomokuCountMap {
  /**
   * Initialize context with given pieces.
   */
  init(): void

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
   * @param playerId
   */
  mustDropPos(playerId: number): Iterable<number> & { size: number }

  /**
   *
   * @param playerId
   * @param posId
   */
  candidateCouldReachFinal(playerId: number, posId: number): boolean
}
