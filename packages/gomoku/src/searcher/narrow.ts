import type { IGomokuCandidateState } from '../types/misc'
import type { IGomokuSearcher } from '../types/searcher'
import type { IGomokuSearcherContext } from '../types/searcher-context'

export interface INarrowSearcherProps {
  MAX_SEARCH_DEPTH: number
  MAX_CANDIDATE_COUNT: number
  MIN_PROMOTION_SCORE: number
  MIN_MULTIPLE_OF_TOP_SCORE: number
  searcherContext: IGomokuSearcherContext
  deeperSearcher: IGomokuSearcher
}

export class NarrowSearcher implements IGomokuSearcher {
  public readonly MAX_SEARCH_DEPTH: number
  public readonly MAX_CANDIDATE_COUNT: number
  public readonly MIN_PROMOTION_SCORE: number
  public readonly MIN_MULTIPLE_OF_TOP_SCORE: number
  public readonly searcherContext: Readonly<IGomokuSearcherContext>
  public readonly deeperSearcher: IGomokuSearcher
  protected readonly _candidatesListCache: Record<number, IGomokuCandidateState[]>

  constructor(props: INarrowSearcherProps) {
    this.MAX_SEARCH_DEPTH = props.MAX_SEARCH_DEPTH
    this.MAX_CANDIDATE_COUNT = props.MAX_CANDIDATE_COUNT
    this.MIN_PROMOTION_SCORE = props.MIN_PROMOTION_SCORE
    this.MIN_MULTIPLE_OF_TOP_SCORE = props.MIN_MULTIPLE_OF_TOP_SCORE
    this.searcherContext = props.searcherContext
    this.deeperSearcher = props.deeperSearcher
    this._candidatesListCache = {}
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

    if (cur > MAX_SEARCH_DEPTH) return searcherContext.score(curPlayerId)

    const candidates: IGomokuCandidateState[] = this._getCandidates(cur)
    const _size: number = searcherContext.expand(
      curPlayerId,
      candidates,
      this.MIN_MULTIPLE_OF_TOP_SCORE,
      this.MAX_CANDIDATE_COUNT,
    )
    if (_size <= 0) return Number.MAX_VALUE // No candidate

    const { MIN_PROMOTION_SCORE, deeperSearcher } = this
    for (let i = 0; i < _size; ++i) {
      const candidate = candidates[i]
      const posId = candidate.posId

      searcherContext.forward(posId, curPlayerId)
      const gamma: number =
        cur === MAX_SEARCH_DEPTH && candidate.score >= MIN_PROMOTION_SCORE
          ? deeperSearcher.search(curPlayerId ^ 1, alpha, beta, cur + 1)
          : this.search(curPlayerId ^ 1, alpha, beta, cur + 1)
      searcherContext.revert(posId)

      if (curPlayerId === rootPlayerId) {
        // eslint-disable-next-line no-param-reassign
        if (alpha < gamma) alpha = gamma
      } else {
        // eslint-disable-next-line no-param-reassign
        if (beta > gamma) beta = gamma
      }
      if (beta <= alpha) break
    }
    return curPlayerId === rootPlayerId ? alpha : beta
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
