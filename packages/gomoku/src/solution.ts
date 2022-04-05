import { GomokuContext } from './context'
import type { IGomokuContext } from './context.type'
import { GomokuState } from './state'
import { GomokuStateCache } from './state-cache'
import type { IGomokuState } from './state.type'
import type { IGomokuCandidateState, IGomokuPiece, IShapeScoreMap } from './types'
import { createScoreMap } from './util'

export interface IGomokuSolutionProps {
  MAX_ROW: number
  MAX_COL: number
  MAX_ADJACENT?: number
  MAX_DEPTH_WIDE?: number
  MAX_DEPTH_NARROW?: number
  MAX_DEPTH_TIGHT?: number
  MAX_DEPTH_DEEP?: number
  MAX_DISTANCE_OF_NEIGHBOR?: number
  POSSIBILITY_SEARCH_EQUIV_CANDIDATE?: number
  scoreMap?: IShapeScoreMap
}

export class GomokuSolution {
  public readonly MAX_DEPTH_WIDE: number
  public readonly MAX_DEPTH_NARROW: number
  public readonly MAX_DEPTH_TIGHT: number
  public readonly MAX_DEPTH_DEEP: number
  public readonly POSSIBILITY_SEARCH_EQUIV_CANDIDATE: number
  public readonly context: IGomokuContext
  public readonly state: IGomokuState
  public readonly scoreMap: Readonly<IShapeScoreMap>
  protected readonly _CANDIDATE_SCORE_WIDE_MIN: number
  protected readonly _CANDIDATE_SCORE_NARROW_MIN: number
  protected readonly _CANDIDATE_SCORE_TIGHT_MIN: number
  protected readonly _CANDIDATE_SCORE_DEEP_MIN: number
  protected readonly _CANDIDATE_SCORE_DEEP_MAX: number
  protected readonly _cache: GomokuStateCache
  protected readonly _candidatesList: IGomokuCandidateState[][] = []
  protected _bestMoveId: number
  protected _mainPlayerId: number

  constructor(props: IGomokuSolutionProps) {
    const {
      MAX_ROW,
      MAX_COL,
      MAX_ADJACENT = 5,
      MAX_DEPTH_WIDE = 5,
      MAX_DEPTH_NARROW = 7,
      MAX_DEPTH_TIGHT = 9,
      MAX_DEPTH_DEEP = 24,
      MAX_DISTANCE_OF_NEIGHBOR = 2,
      POSSIBILITY_SEARCH_EQUIV_CANDIDATE = 0.98,
    } = props
    const context = new GomokuContext({ MAX_ROW, MAX_COL, MAX_ADJACENT, MAX_DISTANCE_OF_NEIGHBOR })
    const scoreMap = props.scoreMap ?? createScoreMap(context.MAX_ADJACENT)
    const state = new GomokuState({ context, scoreMap })

    const _MAX_DEPTH_WIDE: number = Math.max(1, Math.round(MAX_DEPTH_WIDE))
    const _MAX_DEPTH_NARROW: number = Math.max(_MAX_DEPTH_WIDE, Math.round(MAX_DEPTH_NARROW))
    const _MAX_DEPTH_TIGHT: number = Math.max(_MAX_DEPTH_NARROW, Math.round(MAX_DEPTH_TIGHT))
    const _MAX_DEPTH_DEEP: number = Math.max(_MAX_DEPTH_TIGHT, Math.round(MAX_DEPTH_DEEP))
    const _POSSIBILITY_SEARCH_EQUIV_CANDIDATE: number = Math.min(
      1,
      Math.max(0, POSSIBILITY_SEARCH_EQUIV_CANDIDATE),
    )
    const _candidatesList: IGomokuCandidateState[][] = new Array(context.TOTAL_POS + 1)
      .fill([])
      .map(() => [])

    this.MAX_DEPTH_WIDE = _MAX_DEPTH_WIDE
    this.MAX_DEPTH_NARROW = _MAX_DEPTH_NARROW
    this.MAX_DEPTH_TIGHT = _MAX_DEPTH_TIGHT
    this.MAX_DEPTH_DEEP = _MAX_DEPTH_DEEP
    this.POSSIBILITY_SEARCH_EQUIV_CANDIDATE = _POSSIBILITY_SEARCH_EQUIV_CANDIDATE
    this.context = context
    this.state = state
    this.scoreMap = scoreMap
    this._CANDIDATE_SCORE_WIDE_MIN = scoreMap.con[2][2] * 2
    this._CANDIDATE_SCORE_NARROW_MIN = scoreMap.con[MAX_ADJACENT - 2][1]
    this._CANDIDATE_SCORE_TIGHT_MIN = scoreMap.con[MAX_ADJACENT - 2][2] * 2
    this._CANDIDATE_SCORE_DEEP_MIN = scoreMap.con[MAX_ADJACENT - 1][1]
    this._CANDIDATE_SCORE_DEEP_MAX = scoreMap.con[MAX_ADJACENT][2] * 16
    this._cache = new GomokuStateCache(BigInt(context.TOTAL_POS))
    this._candidatesList = _candidatesList
    this._mainPlayerId = -1
    this._bestMoveId = -1
  }

  public init(pieces: ReadonlyArray<IGomokuPiece>): void {
    this.context.init(pieces)
    this.state.init(pieces)
    this._cache.clear()
  }

  public forward(r: number, c: number, playerId: number): void {
    if (this.context.isValidPos(r, c)) {
      const posId: number = this.context.idx(r, c)
      this._forward(posId, playerId)
    }
  }

  public revert(r: number, c: number): void {
    if (this.context.isValidPos(r, c)) {
      const posId: number = this.context.idx(r, c)
      this._revert(posId)
    }
  }

  public minimaxSearch(nextPlayer: number): [r: number, c: number] {
    if (this.state.isFinal()) return [-1, -1]

    this._cache.clear()
    this._bestMoveId = -1
    this._mainPlayerId = nextPlayer
    this._alphaBeta(
      nextPlayer,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      0,
      this._cache.INITIAL_STATE,
    )

    /* istanbul ignore next */
    if (this._bestMoveId < 0) {
      throw new Error('Oops! Something must be wrong, cannot find a valid moving strategy')
    }

    const [r, c] = this.context.revIdx(this._bestMoveId)
    return [r, c]
  }

  protected _alphaBeta(
    playerId: number,
    alpha: number,
    beta: number,
    cur: number,
    prevState: bigint,
  ): number {
    return this._searchWideSpace(playerId, alpha, beta, cur, prevState)
  }

  protected _searchWideSpace(
    playerId: number,
    alpha: number,
    beta: number,
    cur: number,
    prevState: bigint,
  ): number {
    const { _CANDIDATE_SCORE_WIDE_MIN, state, _cache, _mainPlayerId } = this
    if (cur >= this.MAX_DEPTH_WIDE)
      return this._searchNarrowSpace(playerId, alpha, beta, cur, prevState)
    if (state.isWin(_mainPlayerId)) return Number.POSITIVE_INFINITY
    if (state.isWin(_mainPlayerId ^ 1)) return Number.NEGATIVE_INFINITY
    if (state.isDraw()) return Number.MAX_VALUE

    const candidates = this._candidatesList[cur]
    const _size: number = state.expand(playerId, candidates, 16)

    if (cur === 0) this._bestMoveId = candidates[0].posId

    const shouldCache: boolean = cur > 1
    for (const candidate of this._selectOneCandidate(candidates, _size)) {
      const shouldSearchDeeper: boolean = candidate.score >= _CANDIDATE_SCORE_WIDE_MIN
      const posId = candidate.posId
      const nextState: bigint = _cache.calcNextState(cur, prevState, posId)

      let gamma: number | undefined = _cache.get(nextState)
      if (gamma === undefined) {
        this._forward(posId, playerId)
        gamma = shouldSearchDeeper
          ? this._alphaBeta(playerId ^ 1, alpha, beta, cur + 1, nextState)
          : this._score(playerId ^ 1)
        this._revert(posId)
        if (shouldCache) _cache.set(nextState, gamma)
      }

      if (playerId === _mainPlayerId) {
        if (alpha < gamma) {
          // eslint-disable-next-line no-param-reassign
          alpha = gamma
          // Update answer.
          if (cur === 0) this._bestMoveId = posId
        }
      } else {
        if (beta > gamma) {
          // eslint-disable-next-line no-param-reassign
          beta = gamma
        }
      }
      if (beta <= alpha) break
    }
    return playerId === _mainPlayerId ? alpha : beta
  }

  protected _searchNarrowSpace(
    playerId: number,
    alpha: number,
    beta: number,
    cur: number,
    prevState: bigint,
  ): number {
    const { _CANDIDATE_SCORE_WIDE_MIN, state, _mainPlayerId, _cache } = this
    if (cur >= this.MAX_DEPTH_NARROW) return this._searchTightSpace(playerId, alpha, beta, cur)
    if (state.isWin(_mainPlayerId)) return Number.POSITIVE_INFINITY
    if (state.isWin(_mainPlayerId ^ 1)) return Number.NEGATIVE_INFINITY
    if (state.isDraw()) return Number.MAX_VALUE

    const candidates = this._candidatesList[cur]
    const _size: number = state.expand(playerId, candidates, 8)

    for (let i = 0; i < _size; ++i) {
      const candidate = candidates[i]
      const shouldSearchDeeper: boolean = candidate.score >= _CANDIDATE_SCORE_WIDE_MIN
      const posId = candidate.posId
      const nextState: bigint = _cache.calcNextState(cur, prevState, posId)

      let gamma: number | undefined = _cache.get(nextState)
      if (gamma === undefined) {
        this._forward(posId, playerId)
        gamma = shouldSearchDeeper
          ? this._alphaBeta(playerId ^ 1, alpha, beta, cur + 1, nextState)
          : this._score(playerId ^ 1)
        this._revert(posId)
        _cache.set(nextState, gamma)
      }

      if (playerId === _mainPlayerId) {
        // eslint-disable-next-line no-param-reassign
        if (alpha < gamma) alpha = gamma
      } else {
        // eslint-disable-next-line no-param-reassign
        if (beta > gamma) beta = gamma
      }
      if (beta <= alpha) break
    }
    return playerId === _mainPlayerId ? alpha : beta
  }

  protected _searchTightSpace(playerId: number, alpha: number, beta: number, cur: number): number {
    const { _CANDIDATE_SCORE_TIGHT_MIN, state, _mainPlayerId } = this
    if (cur >= this.MAX_DEPTH_TIGHT) return this._searchDeepSpace(playerId, cur)
    if (state.isWin(_mainPlayerId)) return Number.POSITIVE_INFINITY
    if (state.isWin(_mainPlayerId ^ 1)) return Number.NEGATIVE_INFINITY
    if (state.isDraw()) return Number.MAX_VALUE

    const candidates = this._candidatesList[cur]
    const _size: number = state.expand(playerId, candidates, 2)

    for (let i = 0; i < _size; ++i) {
      const candidate = candidates[i]
      const shouldSearchDeeper: boolean = candidate.score >= _CANDIDATE_SCORE_TIGHT_MIN

      const posId = candidate.posId
      this._forward(posId, playerId)
      const gamma = shouldSearchDeeper
        ? this._searchTightSpace(playerId ^ 1, alpha, beta, cur + 1)
        : this._score(playerId ^ 1)
      this._revert(posId)

      if (playerId === _mainPlayerId) {
        // eslint-disable-next-line no-param-reassign
        if (alpha < gamma) alpha = gamma
      } else {
        // eslint-disable-next-line no-param-reassign
        if (beta > gamma) beta = gamma
      }
      if (beta <= alpha) break
    }
    return playerId === _mainPlayerId ? alpha : beta
  }

  protected _searchDeepSpace(playerId: number, cur: number): number {
    const { state, _mainPlayerId } = this
    if (cur >= this.MAX_DEPTH_DEEP) return this._score(playerId)
    if (state.isWin(_mainPlayerId)) return Number.POSITIVE_INFINITY
    if (state.isWin(_mainPlayerId ^ 1)) return Number.NEGATIVE_INFINITY
    if (state.isDraw()) return Number.MAX_VALUE

    const candidate: IGomokuCandidateState = state.topCandidate(playerId)!
    if (candidate.score < this._CANDIDATE_SCORE_DEEP_MIN) {
      return state.score(playerId ^ 1, _mainPlayerId)
    }

    this._forward(candidate.posId, playerId)
    const result: number = this._searchDeepSpace(playerId ^ 1, cur + 1)
    this._revert(candidate.posId)
    return result
  }

  protected _score(nextPlayerId: number): number {
    const { state, _mainPlayerId } = this
    if (state.isWin(_mainPlayerId)) return Number.POSITIVE_INFINITY
    if (state.isWin(_mainPlayerId ^ 1)) return Number.NEGATIVE_INFINITY
    if (state.isDraw()) return Number.MAX_VALUE
    return state.score(nextPlayerId ^ 1, _mainPlayerId)
  }

  /**
   * Simulated Annealing
   * @param candidates
   * @param size
   * @returns
   */
  protected *_selectOneCandidate(
    candidates: IGomokuCandidateState[] = [],
    size: number,
  ): Iterable<IGomokuCandidateState> {
    const firstCandidate = candidates[0]
    yield firstCandidate

    const MAX_CANDIDATE_SCORE: number = firstCandidate.score
    let temperature: number = this._CANDIDATE_SCORE_DEEP_MAX
    const TEMPERATURE_DROP_RATE = 0.98
    for (let i = 1; i < size; ++i) {
      const candidate = candidates[i]
      const delta: number = candidate.score - MAX_CANDIDATE_SCORE
      const possibility: number = Math.exp(delta / temperature)
      if (Math.random() < possibility) {
        yield candidate
      }
      temperature *= TEMPERATURE_DROP_RATE
    }
  }

  protected _forward(posId: number, playerId: number): void {
    this.context.forward(posId, playerId)
    this.state.forward(posId)
  }

  protected _revert(posId: number): void {
    this.context.revert(posId)
    this.state.revert(posId)
  }
}
