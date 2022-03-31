import { GomokuContext } from './context'
import type { IGomokuContext } from './context.type'
import { GomokuState } from './state'
import { GomokuStateCache } from './state-cache'
import type { IGomokuState } from './state.type'
import type { IGomokuCandidateState, IGomokuPiece, IScoreMap } from './types'
import { createScoreMap } from './util'

const cmpCandidate = (x: IGomokuCandidateState, y: IGomokuCandidateState): number =>
  y.score - x.score

export interface IGomokuSolutionProps {
  MAX_ROW: number
  MAX_COL: number
  MAX_ADJACENT?: number
  MAX_DEPTH?: number
  MAX_DISTANCE_OF_NEIGHBOR?: number
  MAX_NEXT_MOVER_BUFFER?: number
  POSSIBILITY_SKIP_CANDIDATE?: number
  scoreMap?: IScoreMap
}

export class GomokuSolution {
  public readonly MAX_DEPTH: number
  public readonly POSSIBILITY_SKIP_CANDIDATE: number
  public readonly context: IGomokuContext
  public readonly state: IGomokuState
  protected readonly _cache: GomokuStateCache
  protected readonly _queues: IGomokuCandidateState[][]
  protected _bestMoveId: number
  protected _mainPlayerId: number

  constructor(props: IGomokuSolutionProps) {
    const {
      MAX_ROW,
      MAX_COL,
      MAX_ADJACENT = 5,
      MAX_DEPTH = 3,
      MAX_DISTANCE_OF_NEIGHBOR = 2,
      MAX_NEXT_MOVER_BUFFER = 0.4,
      POSSIBILITY_SKIP_CANDIDATE = 0.8,
    } = props
    const _context = new GomokuContext({ MAX_ROW, MAX_COL, MAX_ADJACENT, MAX_DISTANCE_OF_NEIGHBOR })
    const _state = new GomokuState({
      context: _context,
      scoreMap: props.scoreMap ?? createScoreMap(_context.MAX_ADJACENT),
      MAX_NEXT_MOVER_BUFFER,
    })

    const _MAX_DEPTH: number = Math.max(1, Math.round(MAX_DEPTH))
    const _MAX_POSSIBILITY_SKIP_CANDIDATE: number = Math.min(
      1,
      Math.max(0, POSSIBILITY_SKIP_CANDIDATE),
    )
    const _queues = new Array(_MAX_DEPTH).fill([]).map(() => [])

    this.MAX_DEPTH = _MAX_DEPTH
    this.POSSIBILITY_SKIP_CANDIDATE = _MAX_POSSIBILITY_SKIP_CANDIDATE
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
    this.state.reRandNextMoverBuffer()
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
    const { MAX_DEPTH, POSSIBILITY_SKIP_CANDIDATE, state, _cache, _mainPlayerId } = this
    if (state.isWin(_mainPlayerId)) return Number.POSITIVE_INFINITY
    if (state.isWin(_mainPlayerId ^ 1)) return Number.NEGATIVE_INFINITY
    if (cur === MAX_DEPTH || state.isDraw()) return state.score(player ^ 1, _mainPlayerId)

    const candidates = this._queues[cur]
    state.expand(player, candidates)
    candidates.sort(cmpCandidate)

    const _size: number = candidates.length
    const shouldCache: boolean = cur > 1 && cur + 1 < MAX_DEPTH
    for (let i = 0, prevCandidateScore = -1; i < _size; ++i) {
      let candidate = candidates[i]
      if (candidate.score === prevCandidateScore) {
        for (
          let possibility = POSSIBILITY_SKIP_CANDIDATE;
          Math.random() < possibility;
          possibility *= POSSIBILITY_SKIP_CANDIDATE
        ) {
          i += 1
          if (i === _size) break
          candidate = candidates[i]
        }
        if (i === _size) break
      }

      prevCandidateScore = candidate.score
      const posId = candidate.id
      const nextState: bigint = _cache.calcNextState(cur, prevState, posId)

      let gamma: number | undefined = _cache.get(nextState)
      if (gamma === undefined) {
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

    if (cur === 0 && this._bestMoveId < 0) this._bestMoveId = candidates[0].id
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
