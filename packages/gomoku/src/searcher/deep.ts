import type { IGomokuCandidateState } from '../types/misc'
import type { IGomokuSearcher } from '../types/searcher'
import type { IGomokuSearcherContext } from '../types/searcher-context'

export interface IDeepSearcherProps {
  MAX_SEARCH_DEPTH: number
  MIN_PROMOTION_SCORE: number
  searcherContext: IGomokuSearcherContext
}

export class DeepSearcher implements IGomokuSearcher {
  public readonly MAX_SEARCH_DEPTH: number
  public readonly MIN_PROMOTION_SCORE: number
  public readonly searcherContext: Readonly<IGomokuSearcherContext>

  constructor(props: IDeepSearcherProps) {
    this.MAX_SEARCH_DEPTH = props.MAX_SEARCH_DEPTH
    this.MIN_PROMOTION_SCORE = props.MIN_PROMOTION_SCORE
    this.searcherContext = props.searcherContext
  }

  public search(curPlayerId: number, alpha: number, beta: number, cur: number): number {
    const { searcherContext, MAX_SEARCH_DEPTH } = this
    const { rootPlayerId } = searcherContext
    if (searcherContext.couldReachFinal(curPlayerId)) {
      return curPlayerId === rootPlayerId ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY
    }
    if (searcherContext.couldReachFinal(curPlayerId ^ 1)) {
      return curPlayerId === rootPlayerId ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY
    }

    const candidate: IGomokuCandidateState | undefined = searcherContext.topCandidate(curPlayerId)
    if (candidate === undefined) return Number.MAX_VALUE

    searcherContext.forward(candidate.posId, curPlayerId)
    const gamma: number =
      cur === MAX_SEARCH_DEPTH && candidate.score < this.MIN_PROMOTION_SCORE
        ? searcherContext.score(curPlayerId ^ 1)
        : this.search(curPlayerId ^ 1, alpha, beta, cur + 1)
    searcherContext.revert(candidate.posId)
    return gamma
  }
}
