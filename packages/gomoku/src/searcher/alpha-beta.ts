import type { IGomokuCandidateState } from '../types/misc'
import type { IGomokuMover } from '../types/mover'
import type { IGomokuSearcher } from '../types/searcher'

export interface IAlphaBetaSearcherProps {
  MAX_CANDIDATE_COUNT: number
  MIN_PROMOTION_SCORE: number
  CANDIDATE_GROWTH_FACTOR: number
  mover: IGomokuMover
  deeperSearcher: IGomokuSearcher
}

export class AlphaBetaSearcher implements IGomokuSearcher {
  public readonly MAX_CANDIDATE_COUNT: number
  public readonly MIN_PROMOTION_SCORE: number
  public readonly CANDIDATE_GROWTH_FACTOR: number
  public readonly searchContext: Readonly<IGomokuMover>
  public readonly deeperSearcher: IGomokuSearcher
  protected readonly _candidateCache: IGomokuCandidateState[]

  constructor(props: IAlphaBetaSearcherProps) {
    this.MAX_CANDIDATE_COUNT = props.MAX_CANDIDATE_COUNT
    this.MIN_PROMOTION_SCORE = props.MIN_PROMOTION_SCORE
    this.CANDIDATE_GROWTH_FACTOR = props.CANDIDATE_GROWTH_FACTOR
    this.searchContext = props.mover
    this.deeperSearcher = props.deeperSearcher
    this._candidateCache = []
  }

  public search(rootPlayerId: number, alpha: number, beta: number): number | -1 {
    const { searchContext, _candidateCache: candidates } = this
    const _size: number = searchContext.expand(
      rootPlayerId,
      candidates,
      this.CANDIDATE_GROWTH_FACTOR,
      this.MAX_CANDIDATE_COUNT,
    )

    let bestMoveId = candidates[0].posId ?? -1
    if (_size < 2) return bestMoveId

    const nextPlayerId = rootPlayerId ^ 1
    const { MIN_PROMOTION_SCORE, deeperSearcher } = this
    for (let i = 0; i < _size; ++i) {
      const candidate = candidates[i]
      const posId: number = candidate.posId

      searchContext.forward(posId, rootPlayerId)
      const gamma: number =
        candidate.score < MIN_PROMOTION_SCORE
          ? searchContext.score(nextPlayerId)
          : deeperSearcher.search(nextPlayerId, alpha, beta, 1)
      searchContext.revert(posId)

      if (alpha < gamma) {
        // eslint-disable-next-line no-param-reassign
        alpha = gamma
        // Update answer.
        bestMoveId = posId
      }
      if (beta <= alpha) break
    }
    return bestMoveId
  }
}
