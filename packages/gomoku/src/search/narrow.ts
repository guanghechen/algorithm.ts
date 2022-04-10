import type { IGomokuCandidateState, IMinimaxSearcher, IMinimaxSearcherContext } from '../types'

export interface INarrowSearcherProps {
  MAX_SEARCH_DEPTH: number
  MAX_CANDIDATE_COUNT: number
  MIN_PROMOTION_SCORE: number
  MIN_MULTIPLE_OF_TOP_SCORE: number
  searchContext: IMinimaxSearcherContext
  deeperSearcher: IMinimaxSearcher
}

export class NarrowSearcher implements IMinimaxSearcher {
  public readonly MAX_SEARCH_DEPTH: number
  public readonly MAX_CANDIDATE_COUNT: number
  public readonly MIN_PROMOTION_SCORE: number
  public readonly MIN_MULTIPLE_OF_TOP_SCORE: number
  public readonly searchContext: Readonly<IMinimaxSearcherContext>
  public readonly deeperSearcher: IMinimaxSearcher
  protected readonly _candidatesListCache: Record<number, IGomokuCandidateState[]>

  constructor(props: INarrowSearcherProps) {
    this.MAX_SEARCH_DEPTH = props.MAX_SEARCH_DEPTH
    this.MAX_CANDIDATE_COUNT = props.MAX_CANDIDATE_COUNT
    this.MIN_PROMOTION_SCORE = props.MIN_PROMOTION_SCORE
    this.MIN_MULTIPLE_OF_TOP_SCORE = props.MIN_MULTIPLE_OF_TOP_SCORE
    this.searchContext = props.searchContext
    this.deeperSearcher = props.deeperSearcher
    this._candidatesListCache = {}
  }

  public search(nextPlayerId: number, alpha: number, beta: number, cur: number): number {
    const { searchContext, MAX_SEARCH_DEPTH } = this
    const { ownPlayerId } = searchContext
    if (searchContext.couldReachFinal(nextPlayerId)) {
      return nextPlayerId === ownPlayerId ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY
    }
    if (cur > MAX_SEARCH_DEPTH) return searchContext.score(nextPlayerId)

    const candidates: IGomokuCandidateState[] = this._getCandidates(cur)
    const _size: number = searchContext.expand(
      nextPlayerId,
      candidates,
      this.MIN_MULTIPLE_OF_TOP_SCORE,
      this.MAX_CANDIDATE_COUNT,
    )
    if (_size <= 0) return Number.MAX_VALUE // No candidate

    const { MIN_PROMOTION_SCORE, deeperSearcher } = this
    for (let i = 0; i < _size; ++i) {
      const candidate = candidates[i]
      const posId = candidate.posId

      searchContext.forward(posId, nextPlayerId)
      const gamma: number =
        cur === MAX_SEARCH_DEPTH && candidate.score >= MIN_PROMOTION_SCORE
          ? deeperSearcher.search(nextPlayerId ^ 1, alpha, beta, cur + 1)
          : this.search(nextPlayerId ^ 1, alpha, beta, cur + 1)
      searchContext.revert(posId)

      if (nextPlayerId === ownPlayerId) {
        // eslint-disable-next-line no-param-reassign
        if (alpha < gamma) alpha = gamma
      } else {
        // eslint-disable-next-line no-param-reassign
        if (beta > gamma) beta = gamma
      }
      if (beta <= alpha) break
    }
    return nextPlayerId === ownPlayerId ? alpha : beta
  }

  protected _getCandidates(cur: number): IGomokuCandidateState[] {
    let candidates = this._candidatesListCache[cur]
    if (candidates === undefined) {
      candidates = []
      this._candidatesListCache[cur] = candidates
    }
    return candidates
  }
}
