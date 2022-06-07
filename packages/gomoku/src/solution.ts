import { GomokuContext } from './context'
import { GomokuCountMap } from './count-map'
import { GomokuSearcherContext } from './searcher-context'
import { AlphaBetaSearcher } from './searcher/alpha-beta'
import { GomokuState } from './state'
import type { IGomokuContext } from './types/context'
import type { IGomokuCountMap } from './types/count-map'
import type { IGomokuCandidateState, IGomokuPiece, IShapeScoreMap } from './types/misc'
import type { IGomokuSearcher } from './types/searcher'
import type { IGomokuSearcherContext } from './types/searcher-context'
import type { IGomokuState } from './types/state'
import { createDefaultMinimaxSearcher } from './util/createMinimaxSearcher'
import { createScoreMap } from './util/createScoreMap'

export interface IGomokuSolutionProps {
  MAX_ROW: number
  MAX_COL: number
  MAX_ADJACENT?: number
  MAX_DISTANCE_OF_NEIGHBOR?: number
  MIN_MULTIPLE_OF_TOP_SCORE?: number
  scoreMap?: IShapeScoreMap
  deeperSearcher?(searcherContext: IGomokuSearcherContext): IGomokuSearcher
}

export class GomokuSolution {
  public readonly MIN_MULTIPLE_OF_TOP_SCORE: number
  public readonly context: Readonly<IGomokuContext>
  public readonly countMap: Readonly<IGomokuCountMap>
  public readonly state: Readonly<IGomokuState>
  protected readonly _searcherContext: IGomokuSearcherContext
  protected readonly _searcher: IGomokuSearcher

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
    const _searcherContext = new GomokuSearcherContext({
      rootPlayerId: -1,
      context,
      countMap,
      state,
    })
    const _searcher = new AlphaBetaSearcher({
      MAX_CANDIDATE_COUNT: 16,
      MIN_PROMOTION_SCORE: scoreMap.con[MAX_ADJACENT - 3][1],
      MIN_MULTIPLE_OF_TOP_SCORE,
      searchContext: _searcherContext,
      deeperSearcher:
        props.deeperSearcher?.(_searcherContext) ??
        createDefaultMinimaxSearcher(scoreMap, _searcherContext, {
          MAX_ADJACENT: context.MAX_ADJACENT,
          MIN_MULTIPLE_OF_TOP_SCORE,
        }),
    })

    this.MIN_MULTIPLE_OF_TOP_SCORE = MIN_MULTIPLE_OF_TOP_SCORE
    this.context = context
    this.countMap = countMap
    this.state = state
    this._searcherContext = _searcherContext
    this._searcher = _searcher
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

    if (this.context.placedCount * 2 < this.context.MAX_ADJACENT) {
      const _candidates: IGomokuCandidateState[] = []
      const _size = Math.min(8, this.state.expand(nextPlayerId, _candidates, 1.5))
      const index: number = Math.min(_size - 1, Math.round(Math.random() * _size))
      const bestMoveId = _candidates[index].posId
      const [r, c] = this.context.revIdx(bestMoveId)
      return [r, c]
    }

    this._searcherContext.init(nextPlayerId)
    const bestMoveId = this._searcher.search(
      nextPlayerId,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      1,
    )

    /* istanbul ignore next */
    if (bestMoveId < 0) {
      throw new Error('Oops! Something must be wrong, cannot find a valid moving strategy')
    }

    const [r, c] = this.context.revIdx(bestMoveId)
    return [r, c]
  }
}
