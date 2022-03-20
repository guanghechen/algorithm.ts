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
  protected bestR: number
  protected bestC: number

  constructor(
    MAX_ROW: number,
    MAX_COL: number,
    MAX_INLINE = 5,
    MAX_DEPTH = 3,
    scoreMap?: IScoreMap,
  ) {
    const context = new GomokuContext(MAX_ROW, MAX_COL, MAX_INLINE)
    const _scoreMap: IScoreMap = scoreMap ?? createScoreMap(context.MAX_INLINE)

    this.MAX_DEPTH = Math.max(1, Math.round(MAX_DEPTH))
    this.context = context
    this.state = new GomokuState(context, _scoreMap)
    this.stateCompressor = new GomokuStateCompressor(BigInt(context.TOTAL_POS))
    this.stateCache = new Map()
    this.scoreForPlayer = -1
    this.bestR = -1
    this.bestC = -1
  }

  public init(pieces: ReadonlyArray<IGomokuPiece>): void {
    this.state.init(pieces)
    this.stateCache.clear()
  }

  public move(r: number, c: number, p: number): void {
    this.state.forward(r, c, p)
  }

  public minmaxMatch(currentPlayer: number): { r: number; c: number } {
    if (this.state.isFinal()) return { r: -1, c: -1 }

    this.stateCache.clear()
    this.scoreForPlayer = currentPlayer
    this.bestR = this.bestC = -1
    this.alphaBeta(
      currentPlayer,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      0,
      this.stateCompressor.INITIAL_STATE,
      0,
    )
    const { bestR: r, bestC: c } = this
    return r < 0 || c < 0 ? this.state.randomMove() : { r, c }
  }

  protected alphaBeta(
    player: number,
    alpha: number,
    beta: number,
    cur: number,
    prevState: bigint,
    stateScore: number,
  ): number {
    const { context, state, stateCompressor, stateCache, scoreForPlayer } = this
    if (cur === this.MAX_DEPTH || state.isFinal()) return stateScore

    const candidates: IGomokuCandidateState[] = state.expand(player, scoreForPlayer)
    if (candidates.length <= 0) return stateScore

    if (player === scoreForPlayer) {
      // Higher score items common first.
      candidates.sort((x, y) => y.score - x.score)
    } else {
      // Lower score items common first.
      candidates.sort((x, y) => x.score - y.score)
    }

    if (cur === 0 && this.bestR === -1) {
      const { r, c } = candidates[0]
      this.bestR = r
      this.bestC = c
    }

    for (const { r, c, score } of candidates) {
      const id: number = context.idx(r, c)
      const nextState: bigint = stateCompressor.compress(cur, prevState, BigInt(id))
      let gamma = stateCache.get(nextState)
      if (gamma === undefined) {
        state.forward(r, c, player)
        gamma = this.alphaBeta(player ^ 1, alpha, beta, cur + 1, nextState, score)
        state.rollback(r, c)
        stateCache.set(nextState, gamma)
      }

      if (cur === 0) {
        if (alpha < gamma) {
          this.bestR = r
          this.bestC = c
        }
      }

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
