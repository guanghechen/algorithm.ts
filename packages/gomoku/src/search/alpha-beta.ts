import type { IGomokuCandidateState, IMinimaxSearcher, IMinimaxSearcherContext } from '../types'

export interface IAlphaBetaSearcherProps {
  MAX_CANDIDATE_COUNT: number
  MIN_PROMOTION_SCORE: number
  MIN_MULTIPLE_OF_TOP_SCORE: number
  searchContext: IMinimaxSearcherContext
  deeperSearcher: IMinimaxSearcher
}

export class AlphaBetaSearcher {
  public readonly MAX_CANDIDATE_COUNT: number
  public readonly MIN_PROMOTION_SCORE: number
  public readonly MIN_MULTIPLE_OF_TOP_SCORE: number
  public readonly searchContext: Readonly<IMinimaxSearcherContext>
  public readonly deeperSearcher: IMinimaxSearcher
  protected readonly _candidateCache: IGomokuCandidateState[]

  constructor(props: IAlphaBetaSearcherProps) {
    this.MAX_CANDIDATE_COUNT = props.MAX_CANDIDATE_COUNT
    this.MIN_PROMOTION_SCORE = props.MIN_PROMOTION_SCORE
    this.MIN_MULTIPLE_OF_TOP_SCORE = props.MIN_MULTIPLE_OF_TOP_SCORE
    this.searchContext = props.searchContext
    this.deeperSearcher = props.deeperSearcher
    this._candidateCache = []
  }

  public search(ownPlayerId: number, alpha: number, beta: number): { bestMoveId: number | -1 } {
    const { searchContext } = this
    searchContext.init(ownPlayerId)

    let bestMoveId = -1
    if (searchContext.isFinal()) return { bestMoveId }

    const candidates: IGomokuCandidateState[] = this._candidateCache
    const _size: number = searchContext.expand(
      ownPlayerId,
      candidates,
      this.MIN_MULTIPLE_OF_TOP_SCORE,
      this.MAX_CANDIDATE_COUNT,
    )

    bestMoveId = candidates[0].posId
    if (_size < 2) return { bestMoveId }

    const { MIN_PROMOTION_SCORE, deeperSearcher } = this
    for (let i = 0; i < _size; ++i) {
      const candidate = candidates[i]
      const posId: number = candidate.posId

      searchContext.forward(posId, ownPlayerId)
      const gamma: number =
        candidate.score < MIN_PROMOTION_SCORE
          ? searchContext.score(ownPlayerId ^ 1)
          : deeperSearcher.search(ownPlayerId ^ 1, alpha, beta, 2)
      searchContext.revert(posId)

      if (alpha < gamma) {
        // eslint-disable-next-line no-param-reassign
        alpha = gamma
        // Update answer.
        bestMoveId = posId
      }
      if (beta <= alpha) break
    }
    return { bestMoveId }
  }
}
