import type { IGomokuCandidateState } from '../types/misc'
import type { IGomokuMover } from '../types/mover'
import type { IGomokuSearcher } from '../types/searcher'

export interface IDeepSearcherProps {
  MAX_SEARCH_DEPTH: number
  MIN_PROMOTION_SCORE: number
  mover: IGomokuMover
}

export class DeepSearcher implements IGomokuSearcher {
  public readonly MAX_SEARCH_DEPTH: number
  public readonly MIN_PROMOTION_SCORE: number
  public readonly mover: Readonly<IGomokuMover>

  constructor(props: IDeepSearcherProps) {
    this.MAX_SEARCH_DEPTH = props.MAX_SEARCH_DEPTH
    this.MIN_PROMOTION_SCORE = props.MIN_PROMOTION_SCORE
    this.mover = props.mover
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

    const candidate: IGomokuCandidateState | undefined = mover.topCandidate(curPlayerId)
    if (candidate === undefined) return Number.MAX_VALUE

    mover.forward(candidate.posId, curPlayerId)
    const gamma: number =
      cur >= MAX_SEARCH_DEPTH && candidate.score < this.MIN_PROMOTION_SCORE
        ? mover.score(curPlayerId ^ 1)
        : this.search(curPlayerId ^ 1, alpha, beta, cur + 1)
    mover.revert(candidate.posId)
    return gamma
  }
}
