import { GomokuMoverContext } from './mover/context'
import { GomokuMoverCounter } from './mover/counter'
import { GomokuMover } from './mover/mover'
import { GomokuMoverState } from './mover/state'
import { AlphaBetaSearcher } from './searcher/alpha-beta'
import type { IGomokuCandidateState, IGomokuPiece, IShapeScoreMap } from './types/misc'
import type { IGomokuMover } from './types/mover'
import type { IGomokuMoverContext } from './types/mover-context'
import type { IGomokuSearcher } from './types/searcher'
import { createDefaultGomokuSearcher } from './util/createGomokuSearcher'
import { createScoreMap } from './util/createScoreMap'

export interface IGomokuSolutionProps {
  MAX_ROW: number
  MAX_COL: number
  MAX_ADJACENT?: number
  MAX_DISTANCE_OF_NEIGHBOR?: number
  CANDIDATE_GROWTH_FACTOR?: number
  scoreMap?: IShapeScoreMap
  deeperSearcher?(mover: IGomokuMover): IGomokuSearcher
}

export class GomokuSolution {
  public readonly CANDIDATE_GROWTH_FACTOR: number
  public readonly scoreMap: Readonly<IShapeScoreMap>
  public readonly mover: Readonly<IGomokuMover>
  protected readonly _moverContext: Readonly<IGomokuMoverContext>
  protected readonly _searcher: IGomokuSearcher

  constructor(props: IGomokuSolutionProps) {
    const {
      MAX_ROW,
      MAX_COL,
      MAX_ADJACENT = 5,
      MAX_DISTANCE_OF_NEIGHBOR = 2,
      CANDIDATE_GROWTH_FACTOR = 8,
    } = props

    const _moverContext = new GomokuMoverContext({
      MAX_ROW,
      MAX_COL,
      MAX_ADJACENT,
      MAX_DISTANCE_OF_NEIGHBOR,
    })
    const scoreMap = props.scoreMap ?? createScoreMap(_moverContext.MAX_ADJACENT)
    const counter = new GomokuMoverCounter(_moverContext)
    const state = new GomokuMoverState({ context: _moverContext, counter, scoreMap })
    const mover = new GomokuMover({ context: _moverContext, counter, state })

    const _searcher = new AlphaBetaSearcher({
      MAX_CANDIDATE_COUNT: 16,
      MIN_PROMOTION_SCORE: scoreMap.con[MAX_ADJACENT - 3][1],
      CANDIDATE_GROWTH_FACTOR,
      mover,
      deeperSearcher:
        props.deeperSearcher?.(mover) ??
        createDefaultGomokuSearcher(scoreMap, mover, {
          MAX_ADJACENT: _moverContext.MAX_ADJACENT,
          CANDIDATE_GROWTH_FACTOR,
        }),
    })

    this.CANDIDATE_GROWTH_FACTOR = CANDIDATE_GROWTH_FACTOR
    this.mover = mover
    this.scoreMap = scoreMap
    this._moverContext = _moverContext
    this._searcher = _searcher
  }

  public init(pieces: Iterable<IGomokuPiece>, searcher?: IGomokuSearcher): void {
    this.mover.init(pieces)

    if (searcher != null) {
      ;(this._searcher as IGomokuSearcher) = searcher
    }
  }

  public forward(r: number, c: number, playerId: number): void {
    const { mover, _moverContext } = this
    if (_moverContext.isValidPos(r, c)) {
      const posId: number = _moverContext.idx(r, c)
      mover.forward(posId, playerId)
    }
  }

  public revert(r: number, c: number): void {
    const { mover, _moverContext: moverContext } = this
    if (moverContext.isValidPos(r, c)) {
      const posId: number = moverContext.idx(r, c)
      mover.revert(posId)
    }
  }

  public minimaxSearch(nextPlayerId: number): [r: number, c: number] {
    if (this.mover.isFinal()) return [-1, -1]

    const { mover, _moverContext } = this
    if (_moverContext.placedCount * 2 < _moverContext.MAX_ADJACENT) {
      const _candidates: IGomokuCandidateState[] = []
      const _size = Math.min(8, mover.expand(nextPlayerId, _candidates, 1.5))
      const index: number = Math.min(_size - 1, Math.round(Math.random() * _size))
      const bestMoveId = _candidates[index].posId
      const [r, c] = _moverContext.revIdx(bestMoveId)
      return [r, c]
    }

    mover.resetRootPlayerId(nextPlayerId)
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

    const [r, c] = _moverContext.revIdx(bestMoveId)
    return [r, c]
  }
}
