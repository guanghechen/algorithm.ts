import type { IGomokuContext } from '../context.type'
import type { IGomokuCountMap } from '../count-map.type'
import type { IGomokuState } from '../state.type'
import type { IGomokuCandidateState, IMinimaxSearcherContext } from '../types'

export const createSearchContext = (
  context: Readonly<IGomokuContext>,
  countMap: Readonly<IGomokuCountMap>,
  state: Readonly<IGomokuState>,
): IMinimaxSearcherContext => {
  const searchContext: IMinimaxSearcherContext = {
    ownPlayerId: -1,
    init(ownPlayerId: number): void {
      ;(this.ownPlayerId as number) = ownPlayerId
    },
    forward(posId: number, playerId: number): void {
      if (context.forward(posId, playerId)) {
        countMap.forward(posId)
        state.forward(posId)
      }
    },
    revert(posId: number): void {
      if (context.revert(posId)) {
        countMap.revert(posId)
        state.revert(posId)
      }
    },
    expand(
      nextPlayerId: number,
      candidates: IGomokuCandidateState[],
      minMultipleOfTopScore: number,
      MAX_SIZE?: number,
    ): number {
      return state.expand(nextPlayerId, candidates, minMultipleOfTopScore, MAX_SIZE)
    },
    topCandidate(nextPlayerId: number): IGomokuCandidateState | undefined {
      return state.topCandidate(nextPlayerId)
    },
    score(nextPlayerId: number): number {
      return state.score(nextPlayerId ^ 1, this.ownPlayerId)
    },
    couldReachFinal(nextPlayerId: number): boolean {
      return countMap.mustDropPos(nextPlayerId).size > 0
    },
  }
  return searchContext
}
