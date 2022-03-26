import { GomokuContext } from './GomokuContext'
import { GomokuState } from './GomokuState'
import { GomokuStateCompressor } from './GomokuStateCompressor'
import type { IGomokuCandidateState, IGomokuPiece, IScoreMap } from './types'
import { createScoreMap } from './util'

export class GomokuSolution {
  protected readonly MAX_DEPTH: number
  protected readonly context: GomokuContext
  protected readonly state: GomokuState
  protected readonly stateCompressor: GomokuStateCompressor
  protected readonly stateCache: Map<bigint, number>
  protected scoreForPlayer: number
  protected bestMoveId: number | null

  constructor(
    MAX_ROW: number,
    MAX_COL: number,
    MAX_INLINE = 5,
    MAX_DEPTH = 3,
    NEXT_MOVER_MAX_BUFFER?: number,
    scoreMap?: IScoreMap,
  ) {
    const context = new GomokuContext(MAX_ROW, MAX_COL, MAX_INLINE, NEXT_MOVER_MAX_BUFFER)
    const _scoreMap: IScoreMap = scoreMap ?? createScoreMap(context.MAX_INLINE)

    this.MAX_DEPTH = Math.max(1, Math.round(MAX_DEPTH))
    this.context = context
    this.state = new GomokuState(context, _scoreMap)
    this.stateCompressor = new GomokuStateCompressor(BigInt(context.TOTAL_POS))
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

  public minmaxMatch(currentPlayer: number): [r: number, c: number] {
    if (this.state.isFinal()) return [-1, -1]

    this.stateCache.clear()
    this.scoreForPlayer = currentPlayer
    this.bestMoveId = null
    this.alphaBeta(
      currentPlayer,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      0,
      this.stateCompressor.INITIAL_STATE,
      0,
    )

    /* istanbul ignore next */
    const bestMoveId: number = this.bestMoveId ?? this.state.randomMove()
    /* istanbul ignore next */
    const [r, c] = bestMoveId < 0 ? [-1, -1] : this.context.revIdx(bestMoveId)
    return [r, c]
  }

  protected alphaBeta(
    player: number,
    alpha: number,
    beta: number,
    cur: number,
    prevState: bigint,
    stateScore: number,
  ): number {
    const { state, stateCompressor, stateCache, scoreForPlayer } = this
    if (cur === this.MAX_DEPTH || state.isFinal()) return stateScore

    const candidates: IGomokuCandidateState[] = state.expand(player, scoreForPlayer)
    if (player === scoreForPlayer) {
      // Higher score items common first.
      candidates.sort((x, y) => y.score - x.score)
    } else {
      // Lower score items common first.
      candidates.sort((x, y) => x.score - y.score)
    }

    for (const { id, score } of candidates) {
      const nextState: bigint = stateCompressor.compress(cur, prevState, BigInt(id))
      let gamma = stateCache.get(nextState)
      if (gamma === undefined) {
        state.forward(id, player)
        gamma = this.alphaBeta(player ^ 1, alpha, beta, cur + 1, nextState, score)
        state.rollback(id)
        stateCache.set(nextState, gamma)
      }

      // Update answer.
      if (cur === 0 && alpha < gamma) this.bestMoveId = id

      if (player === scoreForPlayer) {
        // eslint-disable-next-line no-param-reassign
        if (alpha < gamma) alpha = gamma
      } else {
        // eslint-disable-next-line no-param-reassign
        if (beta > gamma) beta = gamma
      }
      if (beta <= alpha) break
    }

    return player === scoreForPlayer ? alpha : beta
  }
}
