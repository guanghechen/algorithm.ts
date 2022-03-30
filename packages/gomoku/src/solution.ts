import type { IPriorityQueue } from '@algorithm.ts/priority-queue'
import { createPriorityQueue } from '@algorithm.ts/priority-queue'
import { GomokuContext } from './context'
import type { IGomokuContext } from './context.type'
import { GomokuState } from './state'
import type { IGomokuState } from './state.type'
import type { IGomokuCandidateState, IGomokuPiece, IScoreMap } from './types'
import { createScoreMap } from './util'

const tmpCandidates: IGomokuCandidateState[] = []

export interface IGomokuSolutionProps {
  mainPlayerId: number
  MAX_ROW: number
  MAX_COL: number
  MAX_ADJACENT?: number
  MAX_DEPTH?: number
  MAX_DISTANCE_OF_NEIGHBOR?: number
  MAX_NEXT_MOVER_BUFFER?: number
  scoreMap?: IScoreMap
}

export class GomokuSolution {
  public readonly MAX_DEPTH: number
  public readonly context: IGomokuContext
  protected readonly state: IGomokuState
  protected readonly mainPlayerId: number
  protected readonly queues: Array<IPriorityQueue<IGomokuCandidateState>>
  protected bestMoveId: number | null

  constructor(props: IGomokuSolutionProps) {
    const {
      mainPlayerId,
      MAX_ROW,
      MAX_COL,
      MAX_ADJACENT = 5,
      MAX_DEPTH = 3,
      MAX_DISTANCE_OF_NEIGHBOR = 2,
      MAX_NEXT_MOVER_BUFFER = 0.4,
    } = props
    const _context = new GomokuContext({ MAX_ROW, MAX_COL, MAX_ADJACENT, MAX_DISTANCE_OF_NEIGHBOR })
    const _state = new GomokuState({
      mainPlayerId,
      context: _context,
      scoreMap: props.scoreMap ?? createScoreMap(_context.TOTAL_POS, _context.MAX_ADJACENT),
      MAX_NEXT_MOVER_BUFFER,
    })

    const _MAX_DEPTH: number = Math.max(1, Math.round(MAX_DEPTH))
    const _queues = new Array(_MAX_DEPTH)
    for (let cur = 0; cur < _MAX_DEPTH; ++cur) {
      _queues[cur] = createPriorityQueue<IGomokuCandidateState>(
        cur & 1 ? (x, y) => x.score - y.score : (x, y) => y.score - x.score,
      )
    }

    this.MAX_DEPTH = _MAX_DEPTH
    this.context = _context
    this.state = _state
    this.mainPlayerId = mainPlayerId
    this.queues = _queues
    this.bestMoveId = null
  }

  public init(pieces: ReadonlyArray<IGomokuPiece>): void {
    this.context.init(pieces)
    this.state.init(pieces)
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

    this.bestMoveId = null
    this.state.reRandNextMoverBuffer()
    this.alphaBeta(nextPlayer, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 0)

    /* istanbul ignore next */
    if (!this.bestMoveId) return [-1, -1]
    const [r, c] = this.context.revIdx(this.bestMoveId)
    return [r, c]
  }

  protected alphaBeta(player: number, alpha: number, beta: number, cur: number): number {
    const { state, mainPlayerId } = this
    if (state.isWin(mainPlayerId)) return Number.POSITIVE_INFINITY
    if (state.isWin(mainPlayerId ^ 1)) return Number.NEGATIVE_INFINITY
    if (cur === this.MAX_DEPTH || state.isDraw()) return state.score(player ^ 1)

    const _size: number = state.expand(player, tmpCandidates)
    const Q = this.queues[cur]
    Q.init(tmpCandidates, 0, _size)

    // eslint-disable-next-line no-cond-assign
    for (let candidate; (candidate = Q.dequeue()); ) {
      const posId = candidate.id
      this._forward(posId, player)
      const gamma = this.alphaBeta(player ^ 1, alpha, beta, cur + 1)
      this._revert(posId)

      if (player === mainPlayerId) {
        if (alpha < gamma) {
          // eslint-disable-next-line no-param-reassign
          alpha = gamma
          // Update answer.
          if (cur === 0) this.bestMoveId = posId
        }
      } else {
        if (beta > gamma) {
          // eslint-disable-next-line no-param-reassign
          beta = gamma
        }
      }
      if (beta <= alpha) break
    }
    return player === mainPlayerId ? alpha : beta
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
