export interface IGomokuSearcher {
  /**
   *
   * @param curPlayerId Identifier of next mover.
   * @param alpha       Minimum expected score
   * @param beta        Maximum expected score
   * @param cur         Current search depth
   */
  search(curPlayerId: number, alpha: number, beta: number, cur: number): number | -1
}
