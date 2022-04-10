import type { IGomokuCandidateState, IMinimaxSearcher, IMinimaxSearcherContext } from '../types'

export interface IDeepSearcherProps {
  MAX_SEARCH_DEPTH: number
  MIN_PROMOTION_SCORE: number
  searchContext: IMinimaxSearcherContext
}

export class DeepSearcher implements IMinimaxSearcher {
  public readonly MAX_SEARCH_DEPTH: number
  public readonly MIN_PROMOTION_SCORE: number
  public readonly searchContext: Readonly<IMinimaxSearcherContext>

  constructor(props: IDeepSearcherProps) {
    this.MAX_SEARCH_DEPTH = props.MAX_SEARCH_DEPTH
    this.MIN_PROMOTION_SCORE = props.MIN_PROMOTION_SCORE
    this.searchContext = props.searchContext
  }

  public search(nextPlayerId: number, alpha: number, beta: number, cur: number): number {
    const { searchContext, MAX_SEARCH_DEPTH } = this
    const { ownPlayerId } = searchContext
    if (searchContext.couldReachFinal(nextPlayerId)) {
      return nextPlayerId === ownPlayerId ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY
    }

    const candidate: IGomokuCandidateState | undefined = searchContext.topCandidate(nextPlayerId)
    if (candidate === undefined) return Number.MAX_VALUE

    searchContext.forward(candidate.posId, nextPlayerId)
    const gamma: number =
      cur === MAX_SEARCH_DEPTH && candidate.score < this.MIN_PROMOTION_SCORE
        ? searchContext.score(nextPlayerId ^ 1)
        : this.search(nextPlayerId ^ 1, alpha, beta, cur + 1)
    searchContext.revert(candidate.posId)
    return gamma
  }
}
