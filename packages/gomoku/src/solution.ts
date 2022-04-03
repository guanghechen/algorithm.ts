import type { IPriorityQueue } from '@algorithm.ts/priority-queue'
import { createPriorityQueue } from '@algorithm.ts/priority-queue'
import { GomokuContext } from './context'
import type { IGomokuContext } from './context.type'
import { GomokuState } from './state'
import { GomokuStateCache } from './state-cache'
import type { IGomokuState } from './state.type'
import type { IGomokuCandidateState, IGomokuPiece, IShapeScoreMap } from './types'
import { createScoreMap } from './util'

const tmpCandidates: IGomokuCandidateState[] = []

export interface IGomokuSolutionProps {
  MAX_ROW: number
  MAX_COL: number
  MAX_ADJACENT?: number
  MIN_DEPTH?: number
  MAX_DEPTH?: number
  MAX_DISTANCE_OF_NEIGHBOR?: number
  POSSIBILITY_SEARCH_EQUIV_CANDIDATE?: number
  scoreMap?: IShapeScoreMap
}

export class GomokuSolution {
  public readonly MIN_DEPTH: number
  public readonly MAX_DEPTH: number
  public readonly POSSIBILITY_SEARCH_EQUIV_CANDIDATE: number
  public readonly context: IGomokuContext
  public readonly state: IGomokuState
  protected readonly _cache: GomokuStateCache
  protected readonly _queues: Array<IPriorityQueue<IGomokuCandidateState>>
  protected _bestMoveId: number
  protected _mainPlayerId: number

  constructor(props: IGomokuSolutionProps) {
    const {
      MAX_ROW,
      MAX_COL,
      MAX_ADJACENT = 5,
      MIN_DEPTH = 3,
      MAX_DEPTH = 7,
      MAX_DISTANCE_OF_NEIGHBOR = 2,
      POSSIBILITY_SEARCH_EQUIV_CANDIDATE = 0.98,
    } = props
    const _context = new GomokuContext({ MAX_ROW, MAX_COL, MAX_ADJACENT, MAX_DISTANCE_OF_NEIGHBOR })
    const _state = new GomokuState({
      context: _context,
      scoreMap: props.scoreMap ?? createScoreMap(_context.MAX_ADJACENT),
    })

    const _MIN_DEPTH: number = Math.max(1, Math.round(MIN_DEPTH))
    const _MAX_DEPTH: number = Math.max(_MIN_DEPTH, Math.round(MAX_DEPTH))
    const _POSSIBILITY_SEARCH_EQUIV_CANDIDATE: number = Math.min(
      1,
      Math.max(0, POSSIBILITY_SEARCH_EQUIV_CANDIDATE),
    )
    const _queues = new Array(_MAX_DEPTH)
      .fill([])
      .map(() => createPriorityQueue<IGomokuCandidateState>((x, y) => x.score - y.score))

    this.MIN_DEPTH = _MIN_DEPTH
    this.MAX_DEPTH = _MAX_DEPTH
    this.POSSIBILITY_SEARCH_EQUIV_CANDIDATE = _POSSIBILITY_SEARCH_EQUIV_CANDIDATE
    this.context = _context
    this.state = _state
    this._cache = new GomokuStateCache(BigInt(_context.TOTAL_POS))
    this._queues = _queues
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
    player: number,
    alpha: number,
    beta: number,
    cur: number,
    prevState: bigint,
  ): number {
    const { MIN_DEPTH, MAX_DEPTH, state, _cache, _mainPlayerId } = this
    if (state.isWin(_mainPlayerId)) return Number.POSITIVE_INFINITY
    if (state.isWin(_mainPlayerId ^ 1)) return Number.NEGATIVE_INFINITY
    if (cur === MAX_DEPTH || state.isDraw()) return state.score(player ^ 1, _mainPlayerId)

    const Q = this._queues[cur]
    let _size: number = state.expand(player, tmpCandidates)
    Q.init(tmpCandidates, 0, _size)

    const firstCandidate: IGomokuCandidateState = Q.top()!
    const MAX_CANDIDATE_SCORE: number = firstCandidate.score
    const POSS_SEARCH_EQUIV: number = this.POSSIBILITY_SEARCH_EQUIV_CANDIDATE
    const shouldCache: boolean = cur > 1 && cur + 1 < MAX_DEPTH

    if (cur === 0) this._bestMoveId = firstCandidate.id
    if (cur >= MIN_DEPTH && _size > 8) _size = 8

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

      const posId = candidate.id
      const nextState: bigint = _cache.calcNextState(cur, prevState, posId)

      let gamma: number | undefined = _cache.get(nextState)
      if (gamma === undefined) {
        if (candidate.score * 16 < MAX_CANDIDATE_SCORE) continue
        this._forward(posId, player)
        gamma = this._alphaBeta(player ^ 1, alpha, beta, cur + 1, nextState)
        this._revert(posId)
        if (shouldCache) _cache.set(nextState, gamma)
      }

      if (player === _mainPlayerId) {
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
    return player === _mainPlayerId ? alpha : beta
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
