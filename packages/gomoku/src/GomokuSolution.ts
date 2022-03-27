import { GomokuContext } from './GomokuContext'
import { GomokuState } from './GomokuState'
import type { IGomokuCandidateState, IGomokuPiece, IScoreMap } from './types'
import { createScoreMap } from './util'

export class GomokuSolution {
  protected readonly MAX_DEPTH: number
  protected readonly context: GomokuContext
  protected readonly state: GomokuState
  protected readonly stateCache: Map<bigint, number>
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

    this.MAX_DEPTH = Math.max(1, Math.round(MAX_DEPTH))
    this.context = context
    this.state = new GomokuState(context, _scoreMap)
    this.stateCache = new Map()
    this.scoreForPlayer = -1
    this.bestMoveId = null
  }

  public init(pieces: ReadonlyArray<IGomokuPiece>): void {
    this.state.init(pieces)
    this.stateCache.clear()
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

    this.stateCache.clear()
    this.scoreForPlayer = nextPlayer
    this.bestMoveId = null

    this.context.reRandNextMoverBuffer()
    this.alphaBeta(nextPlayer, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 0, 0)

    /* istanbul ignore next */
    if (!this.bestMoveId) return [-1, -1]
    const [r, c] = this.context.revIdx(this.bestMoveId)
    return [r, c]
  }

  protected alphaBeta(
    player: number,
    alpha: number,
    beta: number,
    cur: number,
    stateScore: number,
  ): number {
    const { state, scoreForPlayer } = this
    if (state.isWin(this.scoreForPlayer)) return Number.POSITIVE_INFINITY
    if (state.isWin(this.scoreForPlayer ^ 1)) return Number.NEGATIVE_INFINITY
    if (cur === this.MAX_DEPTH || state.isDraw()) return stateScore

    const candidates: IGomokuCandidateState[] = state.expand(player, scoreForPlayer)
    if (player === scoreForPlayer) {
      // Higher score items common first.
      candidates.sort((x, y) => y.score - x.score)
    } else {
      // Lower score items common first.
      candidates.sort((x, y) => x.score - y.score)
    }

    if (cur === 0) this.bestMoveId = candidates[0].id
    for (const { id, score } of candidates) {
      state.forward(id, player)
      const gamma = this.alphaBeta(player ^ 1, alpha, beta, cur + 1, score)
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

    return player === scoreForPlayer ? alpha : beta
  }
}
