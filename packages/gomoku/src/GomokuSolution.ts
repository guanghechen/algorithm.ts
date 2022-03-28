import type { IPriorityQueue } from '@algorithm.ts/priority-queue'
import { createPriorityQueue } from '@algorithm.ts/priority-queue'
import { GomokuContext } from './GomokuContext'
import { GomokuState } from './GomokuState'
import type { IGomokuCandidateState, IGomokuPiece, IScoreMap } from './types'
import { createScoreMap } from './util'

export class GomokuSolution {
  protected readonly MAX_DEPTH: number
  protected readonly context: GomokuContext
  protected readonly state: GomokuState
  protected readonly queues: Array<IPriorityQueue<IGomokuCandidateState>>
  protected readonly candidates: IGomokuCandidateState[]
  protected scoreForPlayer: number
  protected bestMoveId: number | null

  constructor(
    MAX_ROW: number,
    MAX_COL: number,
    MAX_INLINE = 5,
    MAX_DEPTH = 3,
    MAX_NEXT_MOVER_BUFFER?: number,
    scoreMap?: IScoreMap,
  ) {
    const context = new GomokuContext(MAX_ROW, MAX_COL, MAX_INLINE, MAX_NEXT_MOVER_BUFFER)
    const _scoreMap: IScoreMap = scoreMap ?? createScoreMap(context.TOTAL_POS, context.MAX_INLINE)
    const _MAX_DEPTH: number = Math.max(1, Math.round(MAX_DEPTH))
    const _queues = new Array(_MAX_DEPTH)
    for (let cur = 0; cur < _MAX_DEPTH; ++cur) {
      _queues[cur] = createPriorityQueue<IGomokuCandidateState>((x, y) => x.score - y.score)
    }

    this.MAX_DEPTH = _MAX_DEPTH
    this.context = context
    this.state = new GomokuState(context, _scoreMap)
    this.queues = _queues
    this.candidates = []
    this.scoreForPlayer = -1
    this.bestMoveId = null
  }

  public init(pieces: ReadonlyArray<IGomokuPiece>): void {
    this.state.init(pieces)
  }

  public forward(r: number, c: number, p: number): void {
    const id: number = this.context.idx(r, c)
    this.state.forward(id, p)
  }

  public rollback(r: number, c: number): void {
    const id: number = this.context.idx(r, c)
    this.state.rollback(id)
  }

  public minimaxSearch(nextPlayer: number): [r: number, c: number] {
    if (this.state.isFinal()) return [-1, -1]

    this.scoreForPlayer = nextPlayer
    this.bestMoveId = null
    this.context.reRandNextMoverBuffer()
    this.alphaBeta(nextPlayer, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 0)

    /* istanbul ignore next */
    if (!this.bestMoveId) return [-1, -1]
    const [r, c] = this.context.revIdx(this.bestMoveId)
    return [r, c]
  }

  protected alphaBeta(player: number, alpha: number, beta: number, cur: number): number {
    const { state, scoreForPlayer } = this
    if (state.isWin(scoreForPlayer)) return Number.POSITIVE_INFINITY
    if (state.isWin(scoreForPlayer ^ 1)) return Number.NEGATIVE_INFINITY
    if (cur === this.MAX_DEPTH || state.isDraw()) return state.score(player ^ 1, scoreForPlayer)

    const _size: number = state.expand(player, this.candidates)
    const Q = this.queues[cur]
    Q.init(this.candidates, 0, _size)

    const visited = new Set()
    for (;;) {
      const candidate = Q.dequeue()
      if (candidate === undefined) break

      const id = candidate.id
      if (visited.has(id)) continue

      visited.add(id)
      state.forward(id, player)
      const gamma = this.alphaBeta(player ^ 1, alpha, beta, cur + 1)
      state.rollback(id)

      if (player === scoreForPlayer) {
        if (alpha < gamma) {
          // eslint-disable-next-line no-param-reassign
          alpha = gamma
          // Update answer.
          if (cur === 0) this.bestMoveId = id
        }
      } else {
        if (beta > gamma) {
          // eslint-disable-next-line no-param-reassign
          beta = gamma
        }
      }
      if (beta <= alpha) break
    }
    visited.clear()

    return player === scoreForPlayer ? alpha : beta
  }
}
