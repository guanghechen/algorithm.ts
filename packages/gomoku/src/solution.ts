import type { IPriorityQueue } from '@algorithm.ts/priority-queue'
import { createPriorityQueue } from '@algorithm.ts/priority-queue'
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
  MAX_DISTANCE_OF_NEIGHBOR?: number
  POSSIBILITY_SEARCH_EQUIV_CANDIDATE?: number
  scoreMap?: IShapeScoreMap
}

export class GomokuSolution {
  public readonly MAX_DEPTH_WIDE: number
  public readonly MAX_DEPTH_NARROW: number
  public readonly MAX_DEPTH_TIGHT: number
  public readonly POSSIBILITY_SEARCH_EQUIV_CANDIDATE: number
  public readonly context: IGomokuContext
  public readonly state: IGomokuState
  public readonly scoreMap: Readonly<IShapeScoreMap>
  protected readonly _CANDIDATE_SCORE_DEEP_MAX: number
  protected readonly _CANDIDATE_SCORE_WIDE_MIN: number
  protected readonly _CANDIDATE_SCORE_DEEP_MIN: number
  protected readonly _cache: GomokuStateCache
  protected readonly _queues: Array<IPriorityQueue<IGomokuCandidateState>>
  protected readonly _candidatesList: IGomokuCandidateState[][] = []
  protected _bestMoveId: number
  protected _mainPlayerId: number

  constructor(props: IGomokuSolutionProps) {
    const {
      MAX_ROW,
      MAX_COL,
      MAX_ADJACENT = 5,
      MAX_DEPTH_WIDE = 3,
      MAX_DEPTH_NARROW = 7,
      MAX_DEPTH_TIGHT = 11,
      MAX_DISTANCE_OF_NEIGHBOR = 2,
      POSSIBILITY_SEARCH_EQUIV_CANDIDATE = 0.98,
    } = props
    const context = new GomokuContext({ MAX_ROW, MAX_COL, MAX_ADJACENT, MAX_DISTANCE_OF_NEIGHBOR })
    const scoreMap = props.scoreMap ?? createScoreMap(context.MAX_ADJACENT)
    const state = new GomokuState({ context, scoreMap })

    const _MAX_DEPTH_WIDE: number = Math.max(1, Math.round(MAX_DEPTH_WIDE))
    const _MAX_DEPTH_NARROW: number = Math.max(_MAX_DEPTH_WIDE, Math.round(MAX_DEPTH_NARROW))
    const _MAX_DEPTH_TIGHT: number = Math.max(_MAX_DEPTH_NARROW, Math.round(MAX_DEPTH_TIGHT))
    const _POSSIBILITY_SEARCH_EQUIV_CANDIDATE: number = Math.min(
      1,
      Math.max(0, POSSIBILITY_SEARCH_EQUIV_CANDIDATE),
    )
    const _queues = new Array(context.TOTAL_POS + 1)
      .fill([])
      .map(() => createPriorityQueue<IGomokuCandidateState>((x, y) => x.score - y.score))
    const _candidatesList: IGomokuCandidateState[][] = new Array(context.TOTAL_POS + 1)
      .fill([])
      .map(() => [])

    this.MAX_DEPTH_WIDE = _MAX_DEPTH_WIDE
    this.MAX_DEPTH_NARROW = _MAX_DEPTH_NARROW
    this.MAX_DEPTH_TIGHT = _MAX_DEPTH_TIGHT
    this.POSSIBILITY_SEARCH_EQUIV_CANDIDATE = _POSSIBILITY_SEARCH_EQUIV_CANDIDATE
    this.context = context
    this.state = state
    this.scoreMap = scoreMap
    this._CANDIDATE_SCORE_WIDE_MIN = scoreMap.con[2][2] * 2
    this._CANDIDATE_SCORE_DEEP_MIN = scoreMap.con[MAX_ADJACENT - 1][1]
    this._CANDIDATE_SCORE_DEEP_MAX = scoreMap.con[MAX_ADJACENT][2]
    this._cache = new GomokuStateCache(BigInt(context.TOTAL_POS))
    this._queues = _queues
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
    const { MAX_DEPTH_WIDE, state, _cache, _mainPlayerId } = this
    if (cur >= MAX_DEPTH_WIDE) return this._searchNarrowSpace(playerId, alpha, beta, cur, prevState)
    if (state.isWin(_mainPlayerId)) return Number.POSITIVE_INFINITY
    if (state.isWin(_mainPlayerId ^ 1)) return Number.NEGATIVE_INFINITY
    if (state.isDraw()) return Number.MAX_VALUE

    const tmpCandidates = this._candidatesList[cur]
    const Q = this._queues[cur]
    let _size: number = state.expand(playerId, tmpCandidates)
    Q.init(tmpCandidates, 0, _size)

    const firstCandidate: IGomokuCandidateState = Q.top()!
    const MAX_CANDIDATE_SCORE: number = firstCandidate.score

    if (cur === 0) this._bestMoveId = firstCandidate.posId
    if (MAX_CANDIDATE_SCORE < this._CANDIDATE_SCORE_WIDE_MIN) {
      const candidate = this._selectOneCandidate(tmpCandidates, _size)
      tmpCandidates[0] = candidate
      Q.init(tmpCandidates, 0, 1)
      _size = 1
    }

    const shouldCache: boolean = cur > 1
    const POSS_SEARCH_EQUIV: number = this.POSSIBILITY_SEARCH_EQUIV_CANDIDATE
    for (let i = 0, prevCandidateScore = -1, possibility = POSS_SEARCH_EQUIV; i < _size; ++i) {
      let candidate = Q.dequeue()!
      if (candidate.score === prevCandidateScore) {
        for (; Math.random() >= possibility; possibility *= POSS_SEARCH_EQUIV) {
          i += 1
          if (i === _size) break
          candidate = Q.dequeue()!
        }
        if (i === _size) break
      }

      if (prevCandidateScore !== candidate.score) {
        prevCandidateScore = candidate.score
        possibility = POSS_SEARCH_EQUIV
      }

      const posId = candidate.posId
      const nextState: bigint = _cache.calcNextState(cur, prevState, posId)

      let gamma: number | undefined = _cache.get(nextState)
      if (gamma === undefined) {
        if (candidate.score * 16 < MAX_CANDIDATE_SCORE) continue
        this._forward(posId, playerId)
        gamma = this._alphaBeta(playerId ^ 1, alpha, beta, cur + 1, nextState)
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
    const { MAX_DEPTH_NARROW, state, _mainPlayerId, _cache } = this
    if (cur >= MAX_DEPTH_NARROW) return this._searchTightSpace(playerId, alpha, beta, cur)
    if (state.isWin(_mainPlayerId)) return Number.POSITIVE_INFINITY
    if (state.isWin(_mainPlayerId ^ 1)) return Number.NEGATIVE_INFINITY
    if (state.isDraw()) return Number.MAX_VALUE

    const candidates = this._candidatesList[cur]
    const countOfCandidates: number = state.expand(playerId, candidates)
    const Q = this._queues[cur]
    Q.init(candidates, 0, countOfCandidates)

    const firstCandidate: IGomokuCandidateState = Q.top()!
    const MAX_CANDIDATE_SCORE: number = firstCandidate.score
    const _size: number = Math.min(8, countOfCandidates)
    for (let i = 0; i < _size; ++i) {
      const candidate = Q.dequeue()!
      const posId = candidate.posId
      const nextState: bigint = _cache.calcNextState(cur, prevState, posId)

      let gamma: number | undefined = _cache.get(nextState)
      if (gamma === undefined) {
        if (candidate.score * 16 < MAX_CANDIDATE_SCORE) continue
        this._forward(posId, playerId)
        gamma = this._alphaBeta(playerId ^ 1, alpha, beta, cur + 1, nextState)
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
    const { MAX_DEPTH_TIGHT, state, _mainPlayerId } = this
    if (cur >= MAX_DEPTH_TIGHT) return this._searchDeepSpace(playerId, cur)
    if (state.isWin(_mainPlayerId)) return Number.POSITIVE_INFINITY
    if (state.isWin(_mainPlayerId ^ 1)) return Number.NEGATIVE_INFINITY
    if (state.isDraw()) return Number.MAX_VALUE

    const candidates = this._candidatesList[cur]
    const countOfCandidates: number = state.expand(playerId, candidates)
    const Q = this._queues[cur]
    Q.init(candidates, 0, countOfCandidates)

    let _size = 0
    for (_size = 0; _size < 2; ++_size) {
      const candidate = Q.dequeue()
      if (candidate === undefined) break
      candidates[_size] = candidate
    }

    for (let i = 0; i < _size; ++i) {
      const candidate = candidates[i]
      const posId = candidate.posId
      this._forward(posId, playerId)
      const gamma = this._searchTightSpace(playerId ^ 1, alpha, beta, cur + 1)
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
    if (state.isWin(_mainPlayerId)) return Number.POSITIVE_INFINITY
    if (state.isWin(_mainPlayerId ^ 1)) return Number.NEGATIVE_INFINITY
    if (state.isDraw()) return Number.MAX_VALUE

    const candidates = this._candidatesList[cur]
    const countOfCandidates: number = state.expand(playerId, candidates)

    let candidate: IGomokuCandidateState = candidates[0]
    for (let i = 1; i < countOfCandidates; ++i) {
      const c = candidates[i]
      if (c.score < candidate.score) candidate = c
      if (c.score === candidate.score && Math.random() > 0.5) candidate = c
    }

    if (candidate.score < this._CANDIDATE_SCORE_DEEP_MIN) {
      return state.score(playerId ^ 1, _mainPlayerId)
    }

    this._forward(candidate.posId, playerId)
    const result: number = this._searchDeepSpace(playerId ^ 1, cur + 1)
    this._revert(candidate.posId)
    return result
  }

  /**
   * Simulated Annealing
   * @param candidates
   * @param size
   * @returns
   */
  protected _selectOneCandidate(
    candidates: IGomokuCandidateState[] = [],
    size: number,
  ): IGomokuCandidateState {
    const result = candidates[0]
    // let temperature: number = this._CANDIDATE_SCORE_DEEP_MAX
    // const TEMPERATURE_DROP_RATE = 0.98
    // for (let i = 1; i < size; ++i) {
    //   const candidate = candidates[i]
    //   if (result.score < candidate.score) result = candidate
    //   else if (result.score < candidate.score * 16) {
    //     const delta: number = candidate.score - result.score
    //     if (Math.random() < Math.exp(delta / temperature)) {
    //       result = candidate
    //     }
    //   }
    //   temperature *= TEMPERATURE_DROP_RATE
    // }
    return result
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
