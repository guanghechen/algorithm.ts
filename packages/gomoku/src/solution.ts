import { GomokuContext } from './context'
import type { IGomokuContext } from './context.type'
import { GomokuCountMap } from './count-map'
import type { IGomokuCountMap } from './count-map.type'
import { AlphaBetaSearcher } from './search/alpha-beta'
import { GomokuState } from './state'
import type { IGomokuState } from './state.type'
import type {
  IGomokuCandidateState,
  IGomokuPiece,
  IMinimaxSearcher,
  IMinimaxSearcherContext,
  IShapeScoreMap,
} from './types'
import { createDefaultMinimaxSearcher } from './util/createMinimaxSearcher'
import { createSearchContext } from './util/createMinimaxSearcherContext'
import { createScoreMap } from './util/createScoreMap'

export interface IGomokuSolutionProps {
  MAX_ROW: number
  MAX_COL: number
  MAX_ADJACENT?: number
  MAX_DISTANCE_OF_NEIGHBOR?: number
  MIN_MULTIPLE_OF_TOP_SCORE?: number
  scoreMap?: IShapeScoreMap
  deeperSearcher?(searcherContext: IMinimaxSearcherContext): IMinimaxSearcher
}

export class GomokuSolution {
  public readonly MIN_MULTIPLE_OF_TOP_SCORE: number
  public readonly context: Readonly<IGomokuContext>
  public readonly countMap: Readonly<IGomokuCountMap>
  public readonly state: Readonly<IGomokuState>
  protected readonly _alphaBeta: AlphaBetaSearcher

  constructor(props: IGomokuSolutionProps) {
    const {
      MAX_ROW,
      MAX_COL,
      MAX_ADJACENT = 5,
      MAX_DISTANCE_OF_NEIGHBOR = 2,
      MIN_MULTIPLE_OF_TOP_SCORE = 8,
    } = props

    const context = new GomokuContext({ MAX_ROW, MAX_COL, MAX_ADJACENT, MAX_DISTANCE_OF_NEIGHBOR })
    const countMap = new GomokuCountMap(context)
    const scoreMap = props.scoreMap ?? createScoreMap(context.MAX_ADJACENT)
    const state = new GomokuState({ context, countMap, scoreMap })
    const _searchContext = createSearchContext(context, countMap, state)
    const _alphaBeta = new AlphaBetaSearcher({
      MAX_CANDIDATE_COUNT: 16,
      MIN_PROMOTION_SCORE: scoreMap.con[MAX_ADJACENT - 3][1],
      MIN_MULTIPLE_OF_TOP_SCORE,
      searchContext: _searchContext,
      deeperSearcher:
        props.deeperSearcher?.(_searchContext) ??
        createDefaultMinimaxSearcher(scoreMap, _searchContext, {
          MAX_ADJACENT: context.MAX_ADJACENT,
          MIN_MULTIPLE_OF_TOP_SCORE,
        }),
    })

    this.MIN_MULTIPLE_OF_TOP_SCORE = MIN_MULTIPLE_OF_TOP_SCORE
    this.context = context
    this.countMap = countMap
    this.state = state
    this._alphaBeta = _alphaBeta
  }

  public init(pieces: ReadonlyArray<IGomokuPiece>): void {
    this.context.init(pieces)
    this.countMap.init()
    this.state.init(pieces)
  }

  public forward(r: number, c: number, playerId: number): void {
    if (this.context.isValidPos(r, c)) {
      const posId: number = this.context.idx(r, c)
      if (this.context.forward(posId, playerId)) {
        this.countMap.forward(posId)
        this.state.forward(posId)
      }
    }
  }

  public revert(r: number, c: number): void {
    if (this.context.isValidPos(r, c)) {
      const posId: number = this.context.idx(r, c)
      if (this.context.revert(posId)) {
        this.countMap.revert(posId)
        this.state.revert(posId)
      }
    }
  }

  public minimaxSearch(nextPlayerId: number): [r: number, c: number] {
    if (this.state.isFinal()) return [-1, -1]

    if (this.context.placedCount < 3) {
      const _candidates: IGomokuCandidateState[] = []
      const _size = this.state.expand(nextPlayerId, _candidates, 1.2)
      const index: number = Math.min(_size - 1, Math.round(Math.random() * _size))
      const bestMoveId = _candidates[index].posId
      const [r, c] = this.context.revIdx(bestMoveId)
      return [r, c]
    }

    const { bestMoveId } = this._alphaBeta.search(
      nextPlayerId,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
    )

    /* istanbul ignore next */
    if (bestMoveId < 0) {
      throw new Error('Oops! Something must be wrong, cannot find a valid moving strategy')
    }

    const [r, c] = this.context.revIdx(bestMoveId)
    return [r, c]
  }
}
