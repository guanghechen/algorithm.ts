import type { IGomokuCandidateState } from '../types/misc'
import type { IGomokuMover } from '../types/mover'
import type { IGomokuSearcher } from '../types/searcher'

export interface INarrowSearcherProps {
  MAX_SEARCH_DEPTH: number
  MAX_CANDIDATE_COUNT: number
  MIN_PROMOTION_SCORE: number
  CANDIDATE_GROWTH_FACTOR: number
  mover: IGomokuMover
  deeperSearcher: IGomokuSearcher
}

export class NarrowSearcher implements IGomokuSearcher {
  public readonly MAX_SEARCH_DEPTH: number
  public readonly MAX_CANDIDATE_COUNT: number
  public readonly MIN_PROMOTION_SCORE: number
  public readonly CANDIDATE_GROWTH_FACTOR: number
  public readonly mover: Readonly<IGomokuMover>
  public readonly deeperSearcher: IGomokuSearcher
  protected readonly _candidatesListCache: Record<number, IGomokuCandidateState[]>

  constructor(props: INarrowSearcherProps) {
    this.MAX_SEARCH_DEPTH = props.MAX_SEARCH_DEPTH
    this.MAX_CANDIDATE_COUNT = props.MAX_CANDIDATE_COUNT
    this.MIN_PROMOTION_SCORE = props.MIN_PROMOTION_SCORE
    this.CANDIDATE_GROWTH_FACTOR = props.CANDIDATE_GROWTH_FACTOR
    this.mover = props.mover
    this.deeperSearcher = props.deeperSearcher
    this._candidatesListCache = {}
  }

  public search(curPlayerId: number, alpha: number, beta: number, cur: number): number {
    const { mover, MAX_SEARCH_DEPTH } = this
    const { rootPlayerId } = mover
    if (mover.couldReachFinal(curPlayerId)) {
      return curPlayerId === rootPlayerId ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY
    }
    if (mover.couldReachFinal(curPlayerId ^ 1)) {
      return curPlayerId === rootPlayerId ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY
    }

    if (cur > MAX_SEARCH_DEPTH) return mover.score(curPlayerId)

    const candidates: IGomokuCandidateState[] = this._getCandidates(cur)
    const _size: number = mover.expand(
      curPlayerId,
      candidates,
      this.CANDIDATE_GROWTH_FACTOR,
      this.MAX_CANDIDATE_COUNT,
    )
    if (_size <= 0) return Number.MAX_VALUE // No candidate

    const { MIN_PROMOTION_SCORE, deeperSearcher } = this
    for (let i = 0; i < _size; ++i) {
      const candidate = candidates[i]
      const posId = candidate.posId

      mover.forward(posId, curPlayerId)
      const gamma: number =
        cur >= MAX_SEARCH_DEPTH && candidate.score >= MIN_PROMOTION_SCORE
          ? deeperSearcher.search(curPlayerId ^ 1, alpha, beta, 1)
          : this.search(curPlayerId ^ 1, alpha, beta, cur + 1)
      mover.revert(posId)

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
